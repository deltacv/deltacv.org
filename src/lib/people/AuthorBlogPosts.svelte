<script lang="ts">
    import BlogCard from "$lib/blog/BlogCard.svelte";
    import Pagination from "$lib/blog/Pagination.svelte";
    
    export let authorEmail = "";

    // Glob all posts dynamically
    const modules = import.meta.glob("/src/posts/*.svx", { eager: true });
    
    // Dynamically import all authors globally from the people directory
    const authorModules = import.meta.glob("../people/**/author.ts", {
        eager: true,
    });

    const authors = Object.entries(authorModules).map(([path, mod]: [string, any]) => {
        return {
            ...mod.author,
            href: path.replace("../people", "/people").replace("/author.ts", ""),
        };
    });

    const resolvedAuthor = authors.find((a) => a.email === authorEmail);
    const authorName = resolvedAuthor?.name || "";
    
    // Process, filter by author email, and sort by date descending
    $: authorPosts = Object.entries(modules)
        .filter(([_, mod]: [string, any]) => mod.metadata?.author === authorEmail)
        .map(([path, mod]: [string, any]) => {
            const slug = path.split("/").pop()?.replace(".svx", "");
            const tags: string[] = Array.isArray(mod.metadata?.tags) ? mod.metadata.tags : [];
            return {
                slug,
                title: mod.metadata?.title || slug,
                description: mod.metadata?.description || "",
                date: mod.metadata?.date || "",
                tags,
                authorName
            };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // --- Pagination ---
    let currentPage = 1;
    const POSTS_PER_PAGE = 6;
    
    $: totalPages = Math.max(1, Math.ceil(authorPosts.length / POSTS_PER_PAGE));
    $: pagedPosts = authorPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE,
    );

    // Reset page when author changes
    $: { authorEmail; currentPage = 1; }
</script>

{#if pagedPosts.length > 0}
<section class="projects-section">
    <h2 class="section-title">Articles</h2>

    <div class="projects-grid">
        {#each pagedPosts as post}
            <div class="portfolio-card-wrapper">
                <BlogCard
                    title={post.title}
                    date={post.date}
                    description={post.description}
                    href={`/blog/${post.slug}`}
                    authorName={post.authorName}
                    tags={post.tags}
                />
            </div>
        {/each}
    </div>

    <Pagination
        {currentPage}
        {totalPages}
        onPageChange={(page) => {
            currentPage = page;
            const container = document.querySelector(".projects-section");
            if (container) {
                container.scrollIntoView({ behavior: "smooth" });
            }
        }}
    />
</section>
{/if}

<style>
    .projects-section {
        padding: 2rem 0;
    }

    .section-title {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 2rem 0;
        color: #ffffff;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 350px));
        gap: 24px;
        justify-content: center;
    }
    
    .portfolio-card-wrapper {
        width: 100%;
        max-width: 350px;
        display: flex;
        justify-content: center;
    }
    
    @media (max-width: 768px) {
        .projects-grid {
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 16px;
        }
    }

    @media (max-width: 600px) {
        .projects-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 480px) {
        .projects-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
