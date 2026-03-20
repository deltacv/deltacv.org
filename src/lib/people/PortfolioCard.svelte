<script lang="ts">
    let {
        title = "Project Title",
        description = "A short description of the project.",
        staticSrc = "",
        hoverSrc = "",
        tags = [],
        href = null,
        onclick = undefined,
    } = $props();

    let isHovering = $state(false);
    let currentSrc = $derived(isHovering && hoverSrc ? hoverSrc : staticSrc);
</script>

<svelte:element
    this={href ? "a" : "button"}
    {href}
    role={href ? "link" : "button"}
    tabindex="0"
    class="portfolio-card"
    onmouseenter={() => (isHovering = true)}
    onmouseleave={() => (isHovering = false)}
    {onclick}
    aria-label={`View details for ${title}`}
>
    <!-- Image Area -->
    <div class="image-container">
        {#if currentSrc}
            <img src={currentSrc} alt={title} loading="lazy" />
        {:else}
            <div class="placeholder-img"></div>
        {/if}

        <div class="overlay">
            <span class="view-more">Click to View More</span>
        </div>
    </div>

    <div class="content">
        <h2>{title}</h2>

        <div class="desc-container">
            <div class="desc-wrapper">
                <p class="desc">{description}</p>
            </div>
        </div>

        {#if tags && tags.length > 0}
            <div class="tags">
                {#each tags as tag}
                    <span class="tag">{tag}</span>
                {/each}
            </div>
        {/if}
    </div>
</svelte:element>

<style>
    .portfolio-card {
        font-family: "Inter", sans-serif;
        position: relative;
        width: 100%;
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        background-color: #161b22;
        border: 1px solid #30363d;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.2s ease;
        text-decoration: none;
        text-align: left;
        padding: 0;
        margin: 0;
    }

    .portfolio-card:hover,
    .portfolio-card:focus-visible {
        transform: translateY(-4px);
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
        border-color: #484f58;
        outline: none;
    }

    .image-container {
        position: relative;
        width: 100%;
        overflow: hidden;
        border-bottom: 1px solid #30363d;
    }

    .portfolio-card img {
        display: block;
        width: 100%;
        height: auto;
        aspect-ratio: 16 / 9;
        object-fit: cover;
        background-color: #21262d;
        transition: transform 0.5s ease;
    }

    .placeholder-img {
        width: 100%;
        aspect-ratio: 16 / 9;
        background: linear-gradient(135deg, #21262d, #161b22);
    }

    .portfolio-card:hover img {
        transform: scale(1.05);
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(13, 17, 23, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition:
            opacity 0.3s ease,
            background 0.3s ease;
    }

    .portfolio-card:hover .overlay {
        opacity: 1;
        background: rgba(13, 17, 23, 0.6);
    }

    .view-more {
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.9rem;
        border: 1px solid #484f58;
        transform: translateY(10px);
        transition: transform 0.3s ease;
    }

    .portfolio-card:hover .view-more {
        transform: translateY(0);
    }

    .content {
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    h2 {
        color: #c9d1d9;
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
        font-weight: 600;
        transition: color 0.2s ease;
    }

    .portfolio-card:hover h2,
    .portfolio-card:focus-visible h2 {
        color: #58a6ff;
    }

    .desc-container {
        position: relative;
        height: 2.85rem; /* Strict reservation of 2 lines. This prevents the grid row from expanding! */
        width: 100%;
        margin-bottom: 0.5rem;
    }

    .desc-wrapper {
        position: absolute;
        top: -0.5rem;
        left: -0.5rem;
        right: -0.5rem;
        padding: 0.5rem;
        border-radius: 8px;
        background-color: transparent;
        z-index: 2;
        transition:
            background-color 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        border: 1px solid transparent;
        pointer-events: none; /* Let clicks pass down to the card */
    }

    .portfolio-card:hover .desc-wrapper,
    .portfolio-card:focus-visible .desc-wrapper {
        background-color: #21262d;
        border-color: #30363d;
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.7);
        z-index: 20;
    }

    .desc {
        color: #8b949e;
        margin: 0;
        font-size: 0.95rem;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        transition: color 0.2s ease;
    }

    .portfolio-card:hover .desc,
    .portfolio-card:focus-visible .desc {
        -webkit-line-clamp: 20;
        line-clamp: 20;
        color: #c9d1d9; /* Slight text brightening to draw focus */
    }

    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 1rem;
    }

    .tag {
        background-color: #21262d;
        color: #c9d1d9;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        border: 1px solid #30363d;
    }
</style>
