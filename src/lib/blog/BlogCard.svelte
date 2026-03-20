<script>
    import AuthorIcon from "$lib/icons/AuthorIcon.svelte";

    export let title = "Default Title";
    export let description = "";
    export let date = "";
    export let href = "/";
    export let authorName = "";
    /** @type {string[]} */
    export let tags = [];
</script>

<a {href} class="card">
    <article>
        <h2>{title}</h2>

        {#if date || authorName}
            <div class="meta">
                {#if date}
                    <span class="date">{date}</span>
                {/if}
                {#if date && authorName}
                    <span class="meta-dot">•</span>
                {/if}
                {#if authorName}
                    <span class="author">
                        <AuthorIcon
                            size="0.85rem"
                            strokeWidth="2.5"
                            style="opacity: 0.9;"
                        />
                        {authorName}
                    </span>
                {/if}
            </div>
        {/if}

        <p class="description">{description}</p>

        {#if tags.length > 0}
            <div class="tags">
                {#each tags as tag}
                    <span class="tag">{tag}</span>
                {/each}
            </div>
        {/if}

        <span class="read-more">Read more &rarr;</span>
    </article>
</a>

<style>
    .card {
        display: block;
        background-color: #161b22;
        border: 1px solid #30363d;
        border-radius: 0.75rem;
        padding: 24px;
        text-decoration: none;
        color: #ffffff;
        transition: all 0.25s ease-in-out;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
    }

    .card:hover {
        transform: translateY(-4px);
        background-color: #21262d;
        border-color: #58a6ff;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
    }

    article {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    h2 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #ffffff;
        margin: 0 0 10px 0;
        line-height: 1.3;
    }

    .meta {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        margin: 0 0 20px 0;
        font-size: 0.9rem;
        color: #a0a0a0;
    }

    .date {
        margin: 0;
    }

    .meta-dot {
        opacity: 0.5;
        font-size: 0.75rem;
    }

    .author {
        color: #d0d0d0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
    }

    .description {
        font-size: 1rem;
        color: #8b949e;
        margin: 0 0 15px 0;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        flex-grow: 1;
    }

    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin: 0 0 14px 0;
    }

    .tag {
        background: rgba(88, 166, 255, 0.1);
        color: #58a6ff;
        border: 1px solid rgba(88, 166, 255, 0.25);
        border-radius: 9999px;
        padding: 2px 10px;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        white-space: nowrap;
    }

    .read-more {
        color: #58a6ff;
        font-weight: 600;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-top: auto;
        transition: color 0.2s;
    }

    .card:hover .read-more {
        color: #79c0ff;
    }
</style>
