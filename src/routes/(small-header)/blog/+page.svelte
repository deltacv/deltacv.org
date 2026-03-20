<script lang="ts">
  import { onMount } from "svelte";
  import BlogCard from "$lib/blog/BlogCard.svelte";
  import Pagination from "$lib/blog/Pagination.svelte";
  import { fade } from "svelte/transition";

  // Dynamically import all blog posts (.svx files) — metadata only, no raw content
  const modules = import.meta.glob("/src/posts/*.svx", { eager: true });

  // Dynamically import all authors globally from the people directory
  const authorModules = import.meta.glob("../people/**/author.ts", {
    eager: true,
  });

  const authors = Object.entries(authorModules).map(([path, mod]) => {
    return {
      ...mod.author,
      href: path.replace("../people", "/people").replace("/author.ts", ""),
    };
  });

  let blogPosts = Object.entries(modules)
    .map(([path, mod]) => {
      const slug = path.split("/").pop().replace(".svx", "");
      const email = mod.metadata?.author || "";
      const resolvedAuthor = authors.find((a) => a.email === email);
      const tags: string[] = Array.isArray(mod.metadata?.tags) ? mod.metadata.tags : [];

      return {
        slug,
        title: mod.metadata?.title || slug,
        description: mod.metadata?.description || "",
        date: mod.metadata?.date || "",
        authorName: resolvedAuthor?.name || "",
        authorHref: resolvedAuthor?.href || "",
        tags,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // ─── Inverted index search ───────────────────────────────────────────────

  // Import shared tokenizer (same logic as the Vite plugin)
  const STOP_WORDS = new Set([
    "a",
    "an",
    "the",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "can",
    "to",
    "of",
    "in",
    "for",
    "on",
    "with",
    "at",
    "by",
    "from",
    "up",
    "about",
    "into",
    "this",
    "that",
    "it",
    "its",
    "and",
    "or",
    "but",
    "not",
    "so",
    "if",
    "as",
    "all",
    "how",
    "more",
    "also",
    "just",
    "than",
    "too",
    "very",
    "only",
    "each",
    "both",
    "same",
    "such",
    "no",
    "our",
    "we",
    "they",
    "you",
    "he",
    "she",
    "his",
    "her",
    "their",
    "there",
    "when",
    "what",
    "which",
    "who",
    "use",
    "used",
    "using",
  ]);

  function tokenizeQuery(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));
  }

  // Per-letter shard cache: letter → resolved data
  const shardCache = new Map<string, Record<string, string[]>>();
  // In-flight promise cache: prevents duplicate fetches while a request is pending
  const shardInflight = new Map<string, Promise<Record<string, string[]>>>();

  function getShard(letter: string): Promise<Record<string, string[]>> {
    // Already resolved — return immediately
    if (shardCache.has(letter)) return Promise.resolve(shardCache.get(letter)!);
    // Already in-flight — reuse the same promise
    if (shardInflight.has(letter)) return shardInflight.get(letter)!;

    const promise = fetch(`/api/blog/search/${letter}`)
      .then((r) => r.json())
      .then((data: Record<string, string[]>) => {
        shardCache.set(letter, data);
        shardInflight.delete(letter);
        return data;
      })
      .catch(() => {
        const empty: Record<string, string[]> = {};
        shardCache.set(letter, empty); // cache empty so we don't retry
        shardInflight.delete(letter);
        return empty;
      });

    shardInflight.set(letter, promise);
    return promise;
  }

  // Slugs matched by the inverted index (updated reactively as shards load)
  let fulltextSlugs = new Set<string>();
  let lastIndexedQuery = "";

  async function runIndexSearch(q: string) {
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      fulltextSlugs = new Set();
      return;
    }

    const tokens = tokenizeQuery(trimmed);
    if (tokens.length === 0) {
      fulltextSlugs = new Set();
      return;
    }

    // Fetch only the shards for letters we actually need
    const letters: string[] = [...new Set(tokens.map((t) => t[0]))];
    const shards = await Promise.all(letters.map((l: string) => getShard(l)));
    const shardMap = new Map(letters.map((l, i) => [l, shards[i]]));

    // AND semantics: post must contain ALL query tokens
    let result: Set<string> | null = null;
    for (const token of tokens) {
      const shard = shardMap.get(token[0]) ?? {};
      // Prefix match: find all words in the shard that start with the token
      const matchingWords = Object.keys(shard).filter((w) =>
        w.startsWith(token),
      );
      const slugSet = new Set<string>(matchingWords.flatMap((w) => shard[w]));
      if (result === null) {
        result = slugSet;
      } else {
        const prev: Set<string> = result;
        result = new Set(Array.from(slugSet).filter((s) => prev.has(s)));
      }
    }

    // Only apply if the query hasn't changed while we were fetching
    if (q === searchQuery) {
      fulltextSlugs = result ?? new Set();
    }
  }

  // Kick off index search whenever the query changes
  $: if (searchQuery !== lastIndexedQuery) {
    lastIndexedQuery = searchQuery;
    runIndexSearch(searchQuery);
  }

  let searchQuery = "";
  let currentPage = 1;
  const POSTS_PER_PAGE = 9; // 3 columns × 3 rows on desktop

  $: filteredPosts = blogPosts.filter((post) => {
    const q = searchQuery.trim();
    if (!q) return true;
    const ql = q.toLowerCase();
    // Metadata match is instant (no network)
    const metaMatch =
      post.title.toLowerCase().includes(ql) ||
      post.description.toLowerCase().includes(ql) ||
      post.authorName.toLowerCase().includes(ql) ||
      post.tags.some((t) => t.toLowerCase().includes(ql));
    // Inverted index match (updates reactively as shards load)
    return metaMatch || fulltextSlugs.has(post.slug);
  });

  // Reset to page 1 whenever the search changes
  $: {
    searchQuery;
    currentPage = 1;
  }

  $: totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  $: pagedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  let ready = false;

  onMount(() => {
    const tag = new URLSearchParams(window.location.search).get("tag");
    if (tag) searchQuery = tag;
    ready = true;
  });
</script>

<svelte:head>
  <title>Blog - deltacv</title>
  <meta name="description" content="Technical writing from the deltacv team — insights and learnings on computer vision, Java/Kotlin development, robotics, and building developer tools." />
</svelte:head>

{#if ready}
  <div class="content" in:fade={{ duration: 300 }}>
    <header class="page-header">
      <h1>the deltacv blog</h1>
      <p>insights & learnings from our development process</p>
    </header>

    <div class="search-container">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search posts..."
        class="search-input"
        aria-label="Search blog posts"
      />
    </div>

    <div class="cards">
      {#each pagedPosts as post}
        <BlogCard
          title={post.title}
          date={post.date}
          description={post.description}
          href={`/blog/${post.slug}`}
          authorName={post.authorName}
          tags={post.tags}
        />
      {/each}

      {#if filteredPosts.length === 0}
        <div class="empty-state">
          <p>No posts found matching your query.</p>
        </div>
      {/if}
    </div>

    <Pagination
      {currentPage}
      {totalPages}
      onPageChange={(page) => {
        currentPage = page;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    />
  </div>
{/if}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background-color: #000;
    font-family: Arial, sans-serif;
    min-height: 100vh;
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: calc(var(--header-height, 64px) + 4rem) 2rem 2rem;
    max-width: 1600px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  /* Header (title + subtitle) */
  .page-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem; /* space between title and subtitle */
    margin-bottom: 4vh; /* space between header and cards */
  }

  .page-header h1 {
    font-family: "Noto Sans", sans-serif;
    font-size: clamp(1.5rem, 2.5vw, 2.5rem);
    font-weight: 700;
    color: #c9d1d9;
    margin: 0;
  }

  .page-header p {
    font-size: clamp(0.9rem, 1.8vw, 1.2rem);
    font-weight: 400;
    color: #8b949e;
    margin: 0;
  }

  /* Search Bar */
  .search-container {
    width: 100%;
    max-width: 600px;
    margin-bottom: 3rem;
    display: flex;
    justify-content: center;
  }

  .search-input {
    width: 100%;
    padding: 0.8rem 1.5rem;
    background-color: #0d1117;
    border: 1px solid #30363d;
    border-radius: 9999px;
    color: #c9d1d9;
    font-size: 1rem;
    font-family: Arial, sans-serif;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
    outline: none;
  }

  .search-input:focus {
    border-color: #58a6ff;
    box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.3);
  }

  .search-input::placeholder {
    color: #8b949e;
  }

  /* Blog cards grid */
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 420px));
    gap: 30px;
    width: 100%;
    max-width: 100%;
    justify-content: center;
  }

  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem 2rem;
    background: #0d1117;
    border: 1px dashed #30363d;
    border-radius: 12px;
    color: #8b949e;
    font-size: 1.1rem;
    width: 100%;
  }



  @media (max-width: 1024px) {
    .cards {
      gap: 20px;
    }
  }

  @media (max-width: 480px) {
    .page-header {
      margin-bottom: 6vh; /* more spacing on mobile */
      gap: 0.8rem;
    }

    .cards {
      gap: 15px;
    }
  }
</style>
