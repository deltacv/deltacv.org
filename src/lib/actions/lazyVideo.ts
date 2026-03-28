export interface LazyVideoOptions {
    shouldPlay?: boolean;
    resetOnPause?: boolean;
}

/**
 * Svelte action: lazyVideo
 *
 * - Starts buffering (preload="auto") when the video is within 400px of the viewport
 * - Plays the video when it enters the viewport (if shouldPlay is true)
 * - Pauses when it leaves or when shouldPlay becomes false
 * - Resets to 0:00 when paused if resetOnPause is true
 */
export function lazyVideo(node: HTMLVideoElement, initialOptions: LazyVideoOptions = {}) {
    let isInViewport = false;
    let options = { shouldPlay: true, resetOnPause: false, ...initialOptions };

    function updatePlayback() {
        const canPlay = options.shouldPlay && isInViewport;
        if (canPlay) {
            node.play().catch(() => {
                // Autoplay blocked — not a problem
            });
        } else {
            node.pause();
            if (options.resetOnPause) {
                node.currentTime = 0;
            }
        }
    }

    // Outer observer: triggers preload ~400px before visible
    const preloadObserver = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                node.preload = 'auto';
                preloadObserver.disconnect();
            }
        },
        { rootMargin: '400px', threshold: 0 }
    );

    // Inner observer: viewport sync
    const playObserver = new IntersectionObserver(
        (entries) => {
            isInViewport = entries[0].isIntersecting;
            updatePlayback();
        },
        { rootMargin: '0px', threshold: 0.1 }
    );

    preloadObserver.observe(node);
    playObserver.observe(node);

    return {
        update(newOptions: LazyVideoOptions) {
            options = { ...options, ...newOptions };
            updatePlayback();
        },
        destroy() {
            preloadObserver.disconnect();
            playObserver.disconnect();
        }
    };
}
