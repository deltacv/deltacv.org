<script>
    import { lazyVideo } from "$lib/actions/lazyVideo";

    export let title = "Featured Title";
    export let description =
        "This is a detailed description of the featured project.";
    export let image = "";
    export let hoverImage = "";
    export let href = "#";

    export let imageFit = "cover"; // "cover" or "contain"

    let isHovering = false;
</script>

<a
    {href}
    class="featured-card"
    on:mouseenter={() => (isHovering = true)}
    on:mouseleave={() => (isHovering = false)}
    aria-label={title}
    style="--image-fit: {imageFit};"
>
    <!-- Left: Image -->
    <div class="image-container">
        <!-- Base Layer -->
        <div
            class="media-layer base-layer"
            class:fade-out={isHovering && hoverImage}
        >
            {#if /\.(mp4|webm|ogg|mov)$/i.test(image)}
                <video
                    src={image}
                    use:lazyVideo
                    loop
                    muted
                    playsinline
                    disablePictureInPicture
                    disableRemotePlayback
                    preload="none"
                    controlsList="nodownload noplaybackrate noplaylist"
                    aria-label={title}
                ></video>
            {:else}
                <img src={image} alt={title} loading="lazy" />
            {/if}
        </div>

        <!-- Hover Layer -->
        {#if hoverImage}
            <div class="media-layer hover-layer" class:visible={isHovering}>
                {#if /\.(mp4|webm|ogg|mov)$/i.test(hoverImage)}
                    <video
                        src={hoverImage}
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
                    <img src={hoverImage} alt={title} loading="lazy" />
                {/if}
            </div>
        {/if}
    </div>

    <!-- Right: Content -->
    <div class="content-container">
        <div class="badge">Featured Open Source</div>
        <h2>{title}</h2>
        <p>{description}</p>
        <div class="card-footer">
            <span class="read-more">Learn More &rarr;</span>
        </div>
    </div>
</a>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

    .featured-card {
        font-family: "Inter", sans-serif;
        display: flex;
        flex-direction: row;
        width: 100%;
        max-width: 850px;
        margin: 0 auto;
        background-color: #161b22;
        border: 1px solid #30363d;
        border-radius: 16px;
        overflow: hidden;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        transition:
            transform 0.3s ease,
            box-shadow 0.3s ease,
            border-color 0.3s ease;
        text-decoration: none;
        align-items: stretch;
    }

    .featured-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
        border-color: #58a6ff;
    }

    .image-container {
        position: relative;
        flex: 1.25;
        min-width: 0;
        overflow: hidden;
        background-color: #0d1117;
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

    .image-container img,
    .image-container video {
        width: 100%;
        height: 100%;
        object-fit: var(--image-fit, cover);
        display: block;
        transition: transform 0.5s ease;
    }

    .featured-card:hover .image-container img,
    .featured-card:hover .image-container video {
        transform: scale(1.03);
    }

    .content-container {
        flex: 1;
        padding: 1.75rem 2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background: #0d1117;
        border-left: 1px solid #21262d;
    }

    .badge {
        display: inline-block;
        color: #58a6ff;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.5rem;
    }

    .content-container h2 {
        color: #c9d1d9;
        font-size: 1.8rem;
        font-weight: 800;
        margin: 0 0 0.75rem 0;
        letter-spacing: -0.02em;
        transition: color 0.2s ease;
    }

    .featured-card:hover .content-container h2 {
        color: #58a6ff;
    }

    .content-container p {
        color: #8b949e;
        font-size: 1rem;
        line-height: 1.5;
        margin: 0 0 1.5rem 0;
    }

    .card-footer {
        margin-top: auto;
    }

    .read-more {
        color: #8b949e;
        font-weight: 600;
        font-size: 1rem;
        transition: color 0.2s ease;
    }

    .featured-card:hover .read-more {
        color: #c9d1d9;
    }

    @media (max-width: 900px) {
        .featured-card {
            flex-direction: column;
        }
        .content-container {
            border-left: none;
            border-top: 1px solid #21262d;
            padding: 2rem;
        }
        .image-container img {
            aspect-ratio: 16 / 9;
        }
    }
</style>
