export interface LazyVideoOptions {
    shouldPlay?: boolean;
    resetOnPause?: boolean;
}

// SHARED OBSERVERS for better performance (one observer for ALL lazy videos)
const callbacks = new WeakMap<Element, (isIntersecting: boolean, isPreload?: boolean) => void>();

const preloadObserver = typeof window !== 'undefined' ? new IntersectionObserver(
    (entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                const cb = callbacks.get(entry.target);
                if (cb) cb(true, true);
            }
        }
    },
    { rootMargin: '400px', threshold: 0 }
) : null;

const playObserver = typeof window !== 'undefined' ? new IntersectionObserver(
    (entries) => {
        for (const entry of entries) {
            const cb = callbacks.get(entry.target);
            if (cb) cb(entry.isIntersecting);
        }
    },
    { rootMargin: '0px', threshold: 0.1 }
) : null;

/**
 * Svelte action: lazyVideo
 */
export function lazyVideo(node: HTMLVideoElement, initialOptions: LazyVideoOptions = {}) {
    let isInViewport = false;
    let options = { shouldPlay: true, resetOnPause: false, ...initialOptions };

    function updatePlayback() {
        const canPlay = options.shouldPlay && isInViewport;
        if (canPlay) {
            node.play().catch(() => {});
        } else {
            node.pause();
            if (options.resetOnPause) {
                node.currentTime = 0;
            }
        }
    }

    callbacks.set(node, (isIntersecting, isPreload) => {
        if (isPreload) {
            // Stage 1: metadata handshake (lightweight)
            if (node.preload !== 'auto') {
                node.preload = 'metadata';
            }
        } else {
            // Stage 2: full buffer for visible videos
            if (isIntersecting) {
                node.preload = 'auto';
            }
            isInViewport = isIntersecting;
            updatePlayback();
        }
    });

    preloadObserver?.observe(node);
    playObserver?.observe(node);

    return {
        update(newOptions: LazyVideoOptions) {
            options = { ...options, ...newOptions };
            updatePlayback();
        },
        destroy() {
            preloadObserver?.unobserve(node);
            playObserver?.unobserve(node);
            callbacks.delete(node);
        }
    };
}
