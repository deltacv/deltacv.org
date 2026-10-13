<script lang="ts">
  import { onMount } from "svelte";
  import BlogCard from "$lib/blog/BlogCard.svelte";
  import Pagination from "$lib/blog/Pagination.svelte";
  import { fade } from "svelte/transition";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: blogPosts = data.posts ?? [];

  let searchQuery = data.initialQuery || "";
  let fulltextSlugs: Set<string> | null = data.initialMatchedSlugs
    ? new Set(data.initialMatchedSlugs)
    : null;

  let searchTimeout: any;

  async function fetchSearchResults(q: string) {
    const trimmed = q.trim();
    if (!trimmed) {
      fulltextSlugs = null;
      return;
    }

    try {
      const res = await fetch(`/api/blog/search?q=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const body = await res.json();
        if (q === searchQuery) {
          fulltextSlugs = new Set(body.slugs ?? []);
        }
      }
    } catch {
      // Fallback: local metadata matching still works
    }
  }

  // Trigger search on query change (debounced slightly to avoid hammering the endpoint while typing)
  $: {
    const q = searchQuery;
    clearTimeout(searchTimeout);
    if (!q.trim()) {
      fulltextSlugs = null;
    } else {
      searchTimeout = setTimeout(() => {
        fetchSearchResults(q);
      }, 120);
    }
  }

  let currentPage = 1;
  const POSTS_PER_PAGE = 9; // 3 columns × 3 rows on desktop

  $: filteredPosts = blogPosts.filter((post) => {
    const q = searchQuery.trim();
    if (!q) return true;
    const ql = q.toLowerCase();

    // Instant metadata match (title, description, author, tags)
    const metaMatch =
      post.title.toLowerCase().includes(ql) ||
      post.description.toLowerCase().includes(ql) ||
      post.authorName.toLowerCase().includes(ql) ||
      post.tags.some((t) => t.toLowerCase().includes(ql));

    // SSR fulltext search match
    const fulltextMatch = fulltextSlugs !== null && fulltextSlugs.has(post.slug);

    return metaMatch || fulltextMatch;
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

  onMount(() => {
    const tag = new URLSearchParams(window.location.search).get("tag");
    if (tag && !searchQuery) {
      searchQuery = tag;
    }
  });
</script>

<svelte:head>
  <title>Blog - deltacv</title>
  <meta name="description" content="Technical writing from the deltacv team — insights and learnings on computer vision, Java/Kotlin development, robotics, and building developer tools." />
</svelte:head>

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
