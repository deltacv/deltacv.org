<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import { lazyVideo } from "$lib/actions/lazyVideo";

    let {
        open = false,
        title = "Project Details",
        image = "",
        onclose,
        children,
        imageFit = "cover" as "cover" | "contain" | "pan" | "fit" | "fill",
    } = $props();

    let isVideo = $derived(image && /\.(mp4|webm|ogg|mov)$/i.test(image));

    function close() {
        if (onclose) onclose();
    }

    // Handle escape key
    function handleKeydown(event: KeyboardEvent) {
        if (open && event.key === "Escape") {
            close();
        }
    }

    // Toggle body scroll
    $effect(() => {
        if (typeof window !== "undefined") {
            if (open) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
        }
    });

    function stopPropagation(e: Event) {
        e.stopPropagation();
    }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="modal-backdrop"
        in:fade={{ duration: 250 }}
        out:fade={{ duration: 200 }}
        onclick={close}
    >
        <div
            class="modal-container"
            in:fly={{ y: 30, duration: 350, easing: cubicOut }}
            out:fly={{ y: 20, duration: 250 }}
            style="--image-fit-object: {imageFit === 'fit' ? 'contain' : (imageFit === 'fill' ? 'cover' : (imageFit === 'pan' ? 'cover' : imageFit))}"
            onclick={stopPropagation}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabindex="-1"
        >
            <button class="close-btn" onclick={close} aria-label="Close modal">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M18 6L6 18M6 6L18 18"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </button>

            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modal-title">{title}</h2>
                </div>

                {#if image}
                    <div class="modal-hero">
                        {#if isVideo}
                            <video
                                src={image}
                                class:pan={imageFit === "pan"}
                                use:lazyVideo
                                loop
                                muted
                                playsinline
                                controls
                                preload="none"
                                aria-label={title}
                            ></video>
                        {:else}
                            <img
                                src={image}
                                class:pan={imageFit === "pan"}
                                alt={title}
                            />
                        {/if}
                    </div>
                {/if}

                <div class="modal-body">
                    {@render children?.()}
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(1, 4, 9, 0.85);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 20px;
        box-sizing: border-box;
    }

    .modal-container {
        position: relative;
        width: 100%;
        max-width: 800px;
        max-height: 90vh;
        background-color: #0d1117;
        border: 1px solid #30363d;
        border-radius: 16px;
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        font-family: "Inter", sans-serif;
    }

    .close-btn {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(33, 38, 45, 0.8);
        border: 1px solid #30363d;
        color: #c9d1d9;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
        transition: all 0.2s ease;
    }

    .close-btn:hover {
        background: #30363d;
        color: #fff;
        transform: scale(1.05);
    }

    .modal-content {
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        width: 100%;
        max-height: 100%;
        /* Custom scrollbar */
        scrollbar-width: thin;
        scrollbar-color: #484f58 #0d1117;
    }

    .modal-content::-webkit-scrollbar {
        width: 8px;
    }
    .modal-content::-webkit-scrollbar-track {
        background: #0d1117;
    }
    .modal-content::-webkit-scrollbar-thumb {
        background-color: #484f58;
        border-radius: 4px;
    }

    .modal-header {
        padding: 24px 32px 16px;
    }

    .modal-header h2 {
        margin: 0;
        color: #c9d1d9;
        font-size: 1.75rem;
        font-weight: 700;
        padding-right: 40px; /* Make room for close button */
    }

    .modal-hero {
        width: 100%;
        border-top: 1px solid #21262d;
        border-bottom: 1px solid #21262d;
        background-color: #010409;
        padding: 0;
        display: flex;
        justify-content: center;
    }

    .modal-hero img,
    .modal-hero video {
        width: 70%;
        max-height: 400px;
        object-fit: var(--image-fit-object, cover);
        display: block;
    }

    .modal-hero img.pan,
    .modal-hero video.pan {
        object-fit: contain;
    }

    @keyframes pan-vertical {
        0% {
            object-position: top;
        }
        100% {
            object-position: bottom;
        }
    }

    .modal-body {
        padding: 32px;
        color: #8b949e;
        font-size: 1.05rem;
        line-height: 1.6;
    }

    /* Style global tags that might be used inside slot */
    .modal-body :global(h3) {
        color: #c9d1d9;
        margin-top: 0;
        font-size: 1.35rem;
    }

    .modal-body :global(p) {
        margin-bottom: 1rem;
    }

    .modal-body :global(a) {
        color: #58a6ff;
        text-decoration: none;
    }

    .modal-body :global(a:hover) {
        text-decoration: underline;
    }

    .modal-body :global(.actions) {
        display: flex;
        gap: 12px;
        margin-top: 24px;
    }

    .modal-body :global(.btn) {
        display: inline-flex;
        align-items: center;
        padding: 8px 16px;
        border-radius: 6px;
        font-weight: 600;
        text-decoration: none;
        transition: 0.2s;
    }

    .modal-body :global(.btn-primary) {
        background-color: #238636;
        color: #ffffff;
        border: 1px solid rgba(240, 246, 252, 0.1);
    }

    .modal-body :global(.btn-primary:hover) {
        background-color: #2ea043;
    }

    .modal-body :global(.btn-secondary) {
        background-color: #21262d;
        color: #c9d1d9;
        border: 1px solid #30363d;
    }

    .modal-body :global(.btn-secondary:hover) {
        background-color: #30363d;
        border-color: #8b949e;
    }

    @media (max-width: 600px) {
        .modal-container {
            border-radius: 12px;
            max-height: 95vh;
        }

        .modal-header {
            padding: 20px 24px 12px;
        }

        .modal-body {
            padding: 24px;
        }
    }
</style>
