import { json } from '@sveltejs/kit';
import { searchPosts } from '$lib/server/blog';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
    const q = url.searchParams.get('q') ?? '';
    const slugs = searchPosts(q);
    return json({ slugs });
};

