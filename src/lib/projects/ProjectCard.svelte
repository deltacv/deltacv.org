<script>
    import { lazyVideo } from "$lib/actions/lazyVideo";
    import { quintOut } from "svelte/easing";

    export let title = "Card Title";
    export let description = "This is the description that appears on hover.";
    export let image = "/path/to/static-image.jpg";
    export let hoverImage = "";
    export let href = "#";

    export let imageFit = "cover"; // "cover" (fill) or "contain" (fit)
    export let hoverImageFit = ""; // defaults to imageFit if empty

    let isHovering = false;
</script>

<a
    {href}
    class="card"
    on:mouseenter={() => (isHovering = true)}
    on:mouseleave={() => (isHovering = false)}
    aria-label={title}
    style="--image-fit: {imageFit === 'fit' ? 'contain' : (imageFit === 'fill' ? 'cover' : imageFit)}; --hover-image-fit: {(hoverImageFit || imageFit) === 'fit' ? 'contain' : ((hoverImageFit || imageFit) === 'fill' ? 'cover' : (hoverImageFit || imageFit))};"
>
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
                    <img src={hoverImage} alt={title} loading="lazy" />
                {/if}
            </div>
        {/if}
    </div>

    <div class="footer">
        <div class="footer-content">
            <h2>{title}</h2>
            <div class="description-container">
                <p>{description}</p>
            </div>
        </div>
    </div>
</a>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap");

    .card {
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
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.2s ease;
        text-decoration: none;
    }

    .card:hover {
        transform: scale(1.02);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
        border-color: #484f58;
    }

    .image-container {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        overflow: hidden;
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
        object-fit: var(--image-fit, cover);
        transition: transform 0.5s ease;
    }

    .hover-layer img,
    .hover-layer video {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: var(--hover-image-fit, cover);
        transition: transform 0.5s ease;
    }

    .card:hover img,
    .card:hover video {
        transform: scale(1.05);
    }

    .footer {
        width: 100%;
        background: #0d1117;
        box-sizing: border-box;
        height: 60px; /* Precise height for the swap */
        position: relative;
        overflow: hidden;
        border-top: 1px solid #21262d;
    }

    .footer-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .card:hover .footer-content {
        transform: translateY(-60px); /* Exact height swap */
    }

    .footer h2 {
        color: #c9d1d9;
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        transition: color 0.3s ease;
        line-height: 60px;
        height: 60px;
        text-align: center;
        width: 100%;
    }

    .card:hover .footer h2 {
        color: #58a6ff;
    }

    .description-container {
        height: 60px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 1rem;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .card:hover .description-container {
        opacity: 1;
    }

    .description-container p {
        margin: 0;
        font-size: 0.85rem;
        line-height: 1.4;
        text-align: center;
        color: #8b949e;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
