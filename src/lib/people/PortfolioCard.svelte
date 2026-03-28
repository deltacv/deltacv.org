<script lang="ts">
    import { lazyVideo } from "$lib/actions/lazyVideo";

    let {
        title = "Project Title",
        description = "A short description of the project.",
        staticSrc = "",
        hoverSrc = "",
        tags = [],
        href = null,
        onclick = undefined,
        imageFit = "cover" as "cover" | "contain" | "pan" | "fit" | "fill",
        hoverImageFit = "" as "cover" | "contain" | "pan" | "fit" | "fill" | "",
    } = $props();

    let isHovering = $state(false);
</script>

<svelte:element
    this={href ? "a" : "button"}
    {href}
    role={href ? "link" : "button"}
    tabindex="0"
    class="portfolio-card"
    onmouseenter={() => (isHovering = true)}
    onmouseleave={() => (isHovering = false)}
    style="--image-fit-object: {imageFit === 'fit' ? 'contain' : (imageFit === 'fill' ? 'cover' : (imageFit === 'pan' ? 'cover' : imageFit))}; --hover-image-fit-object: {((hoverImageFit || imageFit) === 'fit' ? 'contain' : ((hoverImageFit || imageFit) === 'fill' ? 'cover' : ((hoverImageFit || imageFit) === 'pan' ? 'cover' : (hoverImageFit || imageFit))))};"
    {onclick}
    aria-label={`View details for ${title}`}
>
    <!-- Image Area -->
    <div class="image-container">
        {#if staticSrc || hoverSrc}
            {#if staticSrc}
                <div
                    class="media-layer base-layer"
                    class:fade-out={isHovering && hoverSrc}
                >
                    {#if /\.(mp4|webm|ogg|mov)$/i.test(staticSrc)}
                        <video
                            src={staticSrc}
                            class:pan={imageFit === "pan"}
                            use:lazyVideo
                            loop
                            muted
                            playsinline
                            disablePictureInPicture
                            disableRemotePlayback
                            controlsList="nodownload noplaybackrate noplaylist"
                            preload="none"
                            aria-label={title}
                        ></video>
                    {:else}
                        <img
                            src={staticSrc}
                            class:pan={imageFit === "pan"}
                            alt={title}
                            loading="lazy"
                        />
                    {/if}
                </div>
            {/if}

            {#if hoverSrc}
                <div class="media-layer hover-layer" class:visible={isHovering}>
                    {#if /\.(mp4|webm|ogg|mov)$/i.test(hoverSrc)}
                        <video
                            src={hoverSrc}
                            class:pan={imageFit === "pan"}
                            use:lazyVideo={{
                                shouldPlay: isHovering,
                                resetOnPause: true,
                            }}
                            loop
                            muted
                            playsinline
                            disablePictureInPicture
                            disableRemotePlayback
                            controlsList="nodownload noplaybackrate noplaylist"
                            preload="none"
                            aria-label={title}
                        ></video>
                    {:else}
                        <img
                            src={hoverSrc}
                            class:pan={imageFit === "pan"}
                            alt={title}
                            loading="lazy"
                        />
                    {/if}
                </div>
            {/if}
        {:else}
            <div class="placeholder-img"></div>
        {/if}
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
        aspect-ratio: 16 / 9;
        overflow: hidden;
        border-bottom: 1px solid #30363d;
        background-color: #21262d;
    }

    .media-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: opacity 0.5s ease;
    }

    .base-layer {
        z-index: 1;
        opacity: 1;
    }

    .hover-layer {
        z-index: 2;
        opacity: 0;
    }

    .fade-out {
        opacity: 0;
    }

    .visible {
        opacity: 1;
    }

    .base-layer img,
    .base-layer video {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: var(--image-fit-object, cover);
        object-position: var(--image-position, center);
        transition: transform 0.5s ease;
        pointer-events: none;
    }

    .hover-layer img,
    .hover-layer video {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: var(--hover-image-fit-object, cover);
        object-position: var(--image-position, center);
        transition: transform 0.5s ease;
        pointer-events: none;
    }

    .portfolio-card img.pan,
    .portfolio-card video.pan {
        object-fit: cover;
        animation: pan-vertical 30s linear infinite;
        transition: object-fit 0.3s ease;
    }

    .portfolio-card:hover img.pan,
    .portfolio-card:hover video.pan,
    .portfolio-card:focus-visible img.pan,
    .portfolio-card:focus-visible video.pan {
        animation: none;
        object-fit: contain;
    }

    @keyframes pan-vertical {
        0% {
            object-position: top;
            opacity: 0;
        }
        5% {
            opacity: 1;
        }
        95% {
            opacity: 1;
        }
        100% {
            object-position: bottom;
            opacity: 0;
        }
    }

    .placeholder-img {
        width: 100%;
        aspect-ratio: 16 / 9;
        background: linear-gradient(135deg, #21262d, #161b22);
    }

    .portfolio-card:hover img,
    .portfolio-card:hover video {
        transform: scale(1.05);
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
