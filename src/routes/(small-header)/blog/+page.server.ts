import { getAllPosts, searchPosts } from '$lib/server/blog';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const tag = url.searchParams.get('tag') ?? '';
    const q = url.searchParams.get('q') ?? tag;
    const posts = getAllPosts();
    const initialMatchedSlugs = q ? searchPosts(q) : null;

    return {
        posts,
        initialQuery: q,
        initialMatchedSlugs,
    };
};

