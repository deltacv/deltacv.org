/**
 * Svelte action to handle progressive image loading.
 * Adds .img-loading class initially and swaps it for .img-loaded once the image is ready.
 */
export function progressiveImage(node: HTMLImageElement) {
    const handleLoad = () => {
        node.classList.remove('img-loading');
        node.classList.add('img-loaded');
    };

    node.classList.add('img-transition');
    
    if (node.complete) {
        handleLoad();
    } else {
        node.classList.add('img-loading');
        node.addEventListener('load', handleLoad);
    }

    return {
        destroy() {
            node.removeEventListener('load', handleLoad);
        }
    };
}
