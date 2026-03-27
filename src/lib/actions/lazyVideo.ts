/**
 * Svelte action: lazyVideo
 *
 * - Starts buffering (preload="auto") when the video is within 400px of the viewport
 * - Plays the video when it enters the viewport
 * - Pauses when it leaves
 *
 * Usage: <video use:lazyVideo preload="none" autoplay loop muted playsinline ...>
 * Note: remove the `autoplay` HTML attribute — this action manages play/pause.
 */
export function lazyVideo(node: HTMLVideoElement) {
    // Outer observer: triggers preload ~400px before visible so 2-3s buffer is ready
    const preloadObserver = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                node.preload = 'auto';
                preloadObserver.disconnect();
            }
        },
        { rootMargin: '400px', threshold: 0 }
    );

    // Inner observer: play when in view, pause when out
    const playObserver = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                node.play().catch(() => {
                    // Autoplay blocked — not a problem, video will play on interaction
                });
            } else {
                node.pause();
            }
        },
        { rootMargin: '0px', threshold: 0.1 }
    );

    preloadObserver.observe(node);
    playObserver.observe(node);

    return {
        destroy() {
            preloadObserver.disconnect();
            playObserver.disconnect();
        }
    };
}
