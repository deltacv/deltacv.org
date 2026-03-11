<script>
  import { error } from "@sveltejs/kit";
  import { onMount, onDestroy } from "svelte";
  import TableOfContents from "$lib/blog/TableOfContents.svelte";

  // --- Load Post ---
  const modules = import.meta.glob("../../../../posts/*.svx", { eager: true });
  export let params;
  const path = `../../../../posts/${params.slug}.svx`;
  const mod = modules[path];
  if (!mod) throw error(404, "Post not found");
  const PostComponent = mod.default;

  // --- Get Metadata ---
  const { title, date } = mod.metadata || {};

  // --- TOC and Scroll-Spy State ---
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
          const url = `${window.location.origin}${window.location.pathname}#${id}`;
          navigator.clipboard.writeText(url).catch(console.error);
          window.location.hash = id;
        });
        node.appendChild(anchorLink);
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

<div class="toc-container" class:visible={hasHeadings}>
  <TableOfContents {headings} {activeHeadingId} />
</div>

<article class="content-container" bind:this={contentEl}>
  {#if title}
    <p class="post-title">{title}</p>
  {/if}
  {#if date}
    <p class="date">{date}</p>
  {/if}

  <svelte:component this={PostComponent} />
</article>

<style>
  /* Fixes scrolling to anchors with a fixed header */
  :global(html) {
    scroll-padding-top: 90px;
  }

  .toc-container {
    position: fixed;
    top: 150px;
    left: 2rem;
    display: none;
  }
  .toc-container.visible {
    display: block;
  }
  .content-container {
    margin: 2rem auto;
    max-width: 800px;
    padding: 0 1rem;
    min-width: 0;
  }
  @media (max-width: 1200px) {
    .toc-container {
      display: none !important;
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
  .date {
    color: #a0a0a0;
    margin-top: 0;
    margin-bottom: 2rem;
    font-size: 1rem;
    text-align: center;
  }

  /* --- Global styles for post content --- */
  /* Invisible bridge so hover isn't lost moving from heading text to # link */
  :global(.content-container h1::before),
  :global(.content-container h2::before) {
    content: "";
    position: absolute;
    left: -1.6em;
    top: 0;
    bottom: 0;
    width: 1.6em;
  }
  :global(.content-container h1) {
    color: #f0f0f0;
    border-bottom: 1px solid #444;
    font-size: 2rem;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    position: relative;
  }
  :global(.content-container h2) {
    color: #e0e0e0;
    font-size: 1.5rem;
    margin-top: 2rem;
    position: relative;
  }
  :global(.content-container p) {
    color: #ccc;
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }

  :global(a.heading-anchor-link) {
    position: absolute;
    left: -1.2em;
    top: 0;
    font-size: 0.8em;
    font-weight: 500;
    text-decoration: none;
    color: #888;
    opacity: 0;
    padding: 0.2em 0.25em;
    margin: -0.2em 0;
    transition:
      opacity 0.15s ease,
      color 0.15s ease;
  }

  :global(.content-container h1:hover a.heading-anchor-link),
  :global(.content-container h2:hover a.heading-anchor-link) {
    opacity: 1;
  }

  :global(a.heading-anchor-link:hover) {
    color: #eee;
    text-decoration: underline;
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
