<script>
  import { error } from "@sveltejs/kit";
  import { blur } from "svelte/transition";
  import { onMount, onDestroy } from "svelte";
  import AuthorIcon from "$lib/icons/AuthorIcon.svelte";
  import TableOfContents from "$lib/blog/TableOfContents.svelte";

  // --- Load Post ---
  const modules = import.meta.glob("/src/posts/*.svx", { eager: true });
  export let params;
  const path = `/src/posts/${params.slug}.svx`;
  const mod = modules[path];
  if (!mod) throw error(404, "Post not found");
  const PostComponent = mod.default;

  // --- Get Metadata ---
  const { title, date, author, tags } = mod.metadata || {};
  /** @type {string[]} */
  const postTags = Array.isArray(tags) ? tags : [];

  // --- Resolve Author ---
  let authorData = null;
  if (author) {
    const authorModules = import.meta.glob("../../people/**/author.ts", { eager: true });
    for (const [authorPath, authorMod] of Object.entries(authorModules)) {
      if (authorMod.author && authorMod.author.email === author) {
        const href = authorPath.replace("../../people", "/people").replace("/author.ts", "");
        authorData = { ...authorMod.author, href };
        break;
      }
    }
  }

  // --- TOC and Scroll-Spy State ---
  /** @type {Array<{id: string, text: string, tagName: string}>} */
  let headings = [];
  let contentEl;
  let activeHeadingId = "";
  $: hasHeadings = headings.length > 0;

  let observer;
  let hashChangeHandler;

  onMount(() => {
    if (!contentEl) return;

    // --- Extract headings ---
    const headingNodes = contentEl.querySelectorAll("h1, h2");
    const extractedHeadings = [];

    headingNodes.forEach((node, index) => {
      let id = node.id;
      if (!id) {
        id = node.textContent
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, "")
          .replace(/\s+/g, "-")
          .slice(0, 50);
        id = `${id}-${index}`;
        node.id = id;
      }

      extractedHeadings.push({
        id,
        text: node.textContent || "Missing text",
        tagName: node.tagName.toLowerCase(),
      });

      // --- Add anchor link ---
      if (!node.querySelector(".heading-anchor-link")) {
        const anchorLink = document.createElement("a");
        anchorLink.className = "heading-anchor-link";
        anchorLink.textContent = "#";
        anchorLink.href = `#${id}`;
        anchorLink.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation(); // prevent heading click from toggling
          const url = `${window.location.origin}${window.location.pathname}#${id}`;
          navigator.clipboard.writeText(url).catch(console.error);
          window.location.hash = id;
        });
        node.appendChild(anchorLink);

        // Toggle visibility on tap/click for mobile
        node.addEventListener("click", () => {
          node.classList.toggle("anchor-visible");
        });
      }
    });

    headings = extractedHeadings;

    // --- IntersectionObserver for scroll highlight ---
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeHeadingId = entry.target.id;
          }
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0, 1.0],
      },
    );
    headingNodes.forEach((node) => observer.observe(node));

    // --- Sync with current hash on load ---
    if (window.location.hash) {
      const idFromHash = window.location.hash.replace(/^#/, "");
      if (headings.find((h) => h.id === idFromHash)) {
        activeHeadingId = idFromHash;
      }
    }

    // --- Hashchange listener ---
    hashChangeHandler = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (id && headings.find((h) => h.id === id)) {
        activeHeadingId = id;
      }
    };
    window.addEventListener("hashchange", hashChangeHandler);
  });

  onDestroy(() => {
    if (observer) observer.disconnect();
    if (hashChangeHandler)
      window.removeEventListener("hashchange", hashChangeHandler);
  });
</script>

<svelte:window on:scroll={() => {}} />

<main in:blur={{ duration: 300 }}>
  <div class="toc-container" class:visible={hasHeadings}>
    <TableOfContents {headings} {activeHeadingId} />
  </div>

  <article class="content-container" bind:this={contentEl}>
    {#if title}
      <p class="post-title">{title}</p>
    {/if}
    <div class="post-meta">
        {#if date}
            <span style="margin: 0;">{date}</span>
        {/if}
        {#if date && authorData}
            <span style="opacity: 0.5;">•</span>
        {/if}
        {#if authorData}
            <a href={authorData.href} class="author-link">
               <AuthorIcon class="author-icon" />
               {authorData.name}
            </a>
        {/if}
    </div>

    {#if postTags.length > 0}
      <div class="post-tags">
          {#each postTags as tag}
              <a href={`/blog?tag=${encodeURIComponent(tag)}`} class="post-tag">{tag}</a>
          {/each}
      </div>
    {/if}

    {#if hasHeadings}
      <details class="mobile-toc">
        <summary>Table of Contents</summary>
        <div class="mobile-toc-content">
          <TableOfContents {headings} {activeHeadingId} />
        </div>
      </details>
    {/if}

    <svelte:component this={PostComponent} />
  </article>
</main>

<style>
  /* Fixes scrolling to anchors with a fixed header */
  :global(html) {
    scroll-padding-top: 90px;
  }

  .toc-container {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    left: 2rem;
    width: 260px;
    max-height: 70vh;
    overflow-y: auto;
    padding-right: 1rem;
    scrollbar-width: thin;
    scrollbar-color: rgba(48, 54, 61, 0.5) transparent;
    display: none;
  }
  .toc-container.visible {
    display: block;
  }
  .content-container {
    margin: 0 auto;
    max-width: 800px;
    padding: calc(var(--header-height, 64px) + 2rem) 1rem 4rem;
    min-width: 0;
  }
  @media (max-width: 1500px) {
    .toc-container {
      display: none !important;
    }
  }

  @media (min-width: 1700px) {
    .toc-container {
      width: 320px;
    }
  }

  @media (min-width: 1900px) {
    .toc-container {
      width: 400px;
    }
  }

  /* --- Figures and Images --- */
  :global(.content-container figure) {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2rem auto;
    text-align: center;
  }

  :global(.content-container figure img) {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  }

  :global(.content-container figcaption) {
    margin-top: 0.75rem;
    font-size: 0.9rem;
    color: #aaa;
    font-style: italic;
  }

  /* --- Styles for Metadata --- */
  .post-title {
    font-size: 2.8rem;
    font-weight: 700;
    color: #f0f0f0;
    margin-bottom: 0.5rem;
    text-align: center;
  }
  .post-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    color: #a0a0a0;
    margin-bottom: 2.5rem;
    font-size: 1rem;
    font-weight: 500;
  }
  :global(.author-icon) {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.25rem;
    opacity: 0.8;
  }
  .author-link {
    display: inline-flex;
    align-items: center;
    color: #58a6ff !important;
    text-decoration: none !important;
    transition: color 0.15s ease;
  }
  .author-link:hover {
    color: #c9d1d9 !important;
    text-decoration: underline !important;
  }

  .post-tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-bottom: 2rem;
  }

  .post-tag {
    background: rgba(88, 166, 255, 0.1);
    color: #58a6ff;
    border: 1px solid rgba(88, 166, 255, 0.25);
    border-radius: 9999px;
    padding: 3px 12px;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    text-decoration: none;
    transition: background 0.15s ease, border-color 0.15s ease;
  }

  .post-tag:hover {
    background: rgba(88, 166, 255, 0.22);
    border-color: rgba(88, 166, 255, 0.5);
  }

  /* --- Global styles for post content --- */
  :global(.content-container h1) {
    color: #f0f0f0;
    border-bottom: 1px solid #444;
    font-size: 2rem;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  :global(.content-container h2) {
    color: #e0e0e0;
    font-size: 1.5rem;
    margin-top: 2rem;
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  :global(.content-container p) {
    color: #ccc;
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }

  :global(a.heading-anchor-link) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 0.6rem;
    font-size: 0.75em;
    font-weight: 500;
    text-decoration: none;
    color: #58a6ff;
    opacity: 0;
    padding: 0.1rem 0.3rem;
    transition:
      opacity 0.15s ease,
      color 0.15s ease;
  }

  @media (hover: hover) {
    :global(.content-container h1:hover a.heading-anchor-link),
    :global(.content-container h2:hover a.heading-anchor-link) {
      opacity: 1;
    }
    :global(a.heading-anchor-link:hover) {
      color: #79c0ff;
      text-decoration: underline;
    }
  }

  /* Tap to show on mobile */
  :global(.content-container .anchor-visible a.heading-anchor-link) {
    opacity: 1 !important;
  }

  .mobile-toc {
    display: none;
    background: rgba(13, 17, 23, 0.4);
    border: 1px solid rgba(48, 54, 61, 0.4);
    border-radius: 12px;
    margin-bottom: 3rem;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }

  .mobile-toc[open] {
    background: rgba(13, 17, 23, 0.6);
  }

  .mobile-toc summary {
    padding: 1rem 1.5rem;
    font-weight: 600;
    color: #c9d1d9;
    cursor: pointer;
    user-select: none;
    outline: none;
    list-style: none; /* remove arrow */
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .mobile-toc summary::after {
    content: "▾";
    font-size: 0.8rem;
    opacity: 0.6;
    transition: transform 0.2s ease;
  }

  .mobile-toc[open] summary::after {
    transform: rotate(180deg);
  }

  .mobile-toc-content {
    padding: 0 1.5rem 1.5rem;
    border-top: 1px solid rgba(48, 54, 61, 0.2);
    margin-top: 0.5rem;
    padding-top: 1rem;
  }

  @media (max-width: 1500px) {
    .mobile-toc {
      display: block;
    }
  }

  @media (max-width: 768px) {
    .mobile-toc {
      margin-bottom: 2rem;
    }
    .mobile-toc summary {
      padding: 0.8rem 1.2rem;
    }
    .mobile-toc-content {
      padding: 0 1.2rem 1.2rem;
      padding-top: 0.8rem;
    }
  }

  :global(.content-container ul) {
    color: #ccc; /* Match paragraph text color */
    line-height: 1.7; /* Match paragraph line height */
    list-style: disc; /* Adds the bullet point (dot) back */
    padding-left: 2rem; /* Adds the indentation back */
    margin-bottom: 1.5rem; /* Matches paragraph bottom margin */
  }

  :global(.content-container li) {
    margin-bottom: 0.5rem; /* Adds a bit of space between list items */
  }

  :global(.content-container a) {
    color: #64b5ff; /* bluish tone for visibility */
    text-decoration: underline;
    transition: color 0.15s ease;
  }

  :global(.content-container a:hover) {
    color: #a7d4ff; /* lighter on hover */
    text-decoration: none;
  }

  /* --- Blockquote Styling --- */
  :global(.content-container blockquote) {
    border-left: 3px solid #64b5ff;
    background: rgba(255, 255, 255, 0.03);
    padding: 1rem 1.25rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: #ccc;
    border-radius: 0.25rem;
  }

  :global(.content-container blockquote p) {
    margin: 0; /* Prevent extra space inside quotes */
  }
</style>
