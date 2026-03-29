/**
 * Svelte action to handle progressive video loading (fade-in).
 * Adds .video-loading class initially and swaps it for .video-loaded once the video is ready to play.
 */
export function progressiveVideo(node: HTMLVideoElement) {
    const handleLoaded = () => {
        node.classList.remove('video-loading');
        node.classList.add('video-loaded');
    };

    node.classList.add('video-transition');
    
    // Check if video is already ready to play
    // HAVE_CURRENT_DATA (2) is often enough to show the first frame
    if (node.readyState >= 2) {
        handleLoaded();
    } else {
        node.classList.add('video-loading');
        
        // Listen to multiple events to ensure we catch the "ready" state
        node.addEventListener('loadeddata', handleLoaded, { once: true });
        node.addEventListener('canplay', handleLoaded, { once: true });
    }

    return {
        destroy() {
            node.removeEventListener('loadeddata', handleLoaded);
            node.removeEventListener('canplay', handleLoaded);
        }
    };
}
