import { page } from '$app/stores';
import { get } from 'svelte/store';
import { PUBLIC_MEDIA_BASE } from '$env/static/public';

export const m = (path: string) => {
    let prefix = "";
    let cleanPath = path;

    // If the path starts with /, it's considered absolute from the media root
    // and route-awareness is skipped.
    if (path.startsWith('/')) {
        cleanPath = path.substring(1);
    } else if (!path.startsWith('http')) {
        try {
            const $page = get(page);
            if ($page && $page.url) {
                let urlPath = $page.url.pathname.replace(/^\/|\/$/g, '');

                // If we are in a subroute, use it as a prefix for relative paths
                if (urlPath && !path.startsWith(urlPath + '/')) {
                    prefix = `${urlPath}/`;
                }
            }
        } catch (e) {
            // Fallback for non-component/non-request contexts
        }
    }

    return `${PUBLIC_MEDIA_BASE}/${prefix}${cleanPath}`;
};