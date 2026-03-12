<script>
  import { onMount } from "svelte";
  import BlogCard from "$lib/blog/BlogCard.svelte";
  import { fade } from "svelte/transition";

  // Dynamically import all blog posts (.svx files)
  const modules = import.meta.glob("../../../posts/*.svx", { eager: true });

  let blogPosts = Object.entries(modules).map(([path, mod]) => {
    const slug = path.split("/").pop().replace(".svx", "");
    return {
      slug,
      title: mod.metadata?.title || slug,
      description: mod.metadata?.description || "",
      date: mod.metadata?.date || "",
    };
  });

  let ready = false;

  onMount(() => {
    ready = true; // no images preloading for now
  });
</script>

{#if ready}
  <div class="content" in:fade={{ duration: 300 }}>
    <header class="page-header">
      <h1>the deltacv blog</h1>
      <p>insights & learnings from our development process</p>
    </header>

    <div class="cards">
      {#each blogPosts as post}
        <BlogCard
          title={post.title}
          date={post.date}
          description={post.description}
          href={`/blog/${post.slug}`}
        />
      {/each}
    </div>
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
  padding: 5vh 5%;
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

/* Blog cards grid */
.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 30px;
  width: 100%;
}

@media (max-width: 1024px) {
  .cards {
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .content {
    padding: 5vh 2%;
  }

  .page-header {
    margin-bottom: 6vh; /* more spacing on mobile */
    gap: 0.8rem;
  }

  .cards {
    gap: 15px;
  }
}
</style>
