import { page } from '$app/stores';
import { get } from 'svelte/store';

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
                if (urlPath && !path.startsWith(urlPath)) {
                    prefix = `${urlPath}/`;
                }
            }
        } catch (e) {
            // Fallback for non-component/non-request contexts
        }
    }

    return `/api/media/${prefix}${cleanPath}`;
};

/**
 * Namespace factory
 */
const ns = <T extends Record<string, any>>(obj: T) => obj;

/**
 * Media system with namespaces per feature/page
 */
export const media = ns({
    people: {
        serivesmejia: {
            profile: m("people/serivesmejia/profile.jpg"),
            geowareVid: m("people/serivesmejia/geoware-video.mp4"),
            mqttBeaconsImg: m("people/serivesmejia/mqttbeacons-screenshot.png"),
            deltacvPageImg: m("people/serivesmejia/deltacv-page.png"),
            deltacvPageVid: m("people/serivesmejia/deltacv-org-video.mp4"),
            eocvSimHeroImg: m("people/serivesmejia/eocvsim-hero.png"),
            paperVisionHeroImg: m("people/serivesmejia/papervision-hero.png"),
        },
    },
});