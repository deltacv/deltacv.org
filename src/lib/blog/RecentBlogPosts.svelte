<script>
    import BlogCard from "$lib/blog/BlogCard.svelte";

    // Glob all posts securely from absolute route
    const modules = import.meta.glob("/src/posts/*.svx", { eager: true });

    // Glob all authors globally, using * to bypass Vite fast-glob parenthesis parsing bugs on `(small-header)`
    const authorModules = import.meta.glob(
        "/src/routes/*/people/**/author.ts",
        { eager: true },
    );
    const authorsList = Object.values(authorModules)
        .map((m) => m.author)
        .filter(Boolean);
    console.log("Found authors for mapping:", authorsList);

    function getAuthorName(email) {
        if (!email) return "Anonymous";
        const found = authorsList.find((a) => a.email === email?.trim());
        return found?.name || email;
    }

    // Process, sort by date, and slice top 3
    const recentPosts = Object.entries(modules)
        .map(([path, mod]) => {
            const slug = path.split("/").pop()?.replace(".svx", "");
            return {
                slug,
                title: mod.metadata?.title || slug,
                description: mod.metadata?.description || "",
                date: mod.metadata?.date || "",
                authorName: getAuthorName(mod.metadata?.author),
            };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);
</script>

<section class="recent-writing">
    <div class="header-row">
        <h2 class="section-title">Recent Writing</h2>
        <a href="/blog" class="view-all">View All Posts &rarr;</a>
    </div>

    <div class="posts-grid">
        {#each recentPosts as post}
            <div class="card-wrapper">
                <BlogCard
                    title={post.title}
                    date={post.date}
                    description={post.description}
                    href={`/blog/${post.slug}`}
                    authorName={post.authorName}
                />
            </div>
        {/each}
        {#if recentPosts.length === 0}
            <div class="empty-state">
                <p>No recent posts found.</p>
            </div>
        {/if}
    </div>
</section>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@600;800&display=swap");

    .recent-writing {
        padding: 2rem 5vw 6rem;
        max-width: 1400px;
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;
    }

    .header-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 2.5rem;
        border-bottom: 1px solid #21262d;
        padding-bottom: 1rem;
    }

    .section-title {
        font-family: "Inter", sans-serif;
        font-size: 2.2rem;
        font-weight: 800;
        color: #ffffff;
        margin: 0;
        letter-spacing: -0.02em;
    }

    .view-all {
        font-family: "Inter", sans-serif;
        color: #58a6ff;
        text-decoration: none;
        font-weight: 600;
        font-size: 1rem;
        transition: color 0.2s ease;
        margin-bottom: 0.2rem;
    }

    .view-all:hover {
        color: #79c0ff;
        text-decoration: underline;
    }

    .posts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 24px;
        justify-items: center;
    }

    .card-wrapper {
        width: 100%;
        max-width: 380px;
        display: flex;
        justify-content: center;
    }

    .empty-state {
        color: #8b949e;
        font-family: "Inter", sans-serif;
        text-align: center;
        width: 100%;
        padding: 4rem 0;
        background: #0d1117;
        border-radius: 12px;
        border: 1px dashed #30363d;
        grid-column: 1 / -1;
    }

    @media (max-width: 600px) {
        .header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
        .posts-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
