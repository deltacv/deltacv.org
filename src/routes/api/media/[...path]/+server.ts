import type { RequestEvent } from '@sveltejs/kit';

export const GET = async ({ params, platform }: RequestEvent) => {
    // Get the r2 bucket object key from the path
    const path = params.path!;

    // Check the bucket exists
    if (!platform?.env?.MEDIA) {
        return new Response(null, { status: 500 });
    }

    // Get the file from the bucket
    const file = await platform.env.MEDIA.get(path);

    // Return 404 if that's not possible
    if (!file) {
        return new Response(null, { status: 404 });
    }

    return new Response(file.body, {
        headers: {
            'Content-Type': file.httpMetadata?.contentType ?? 'application/octet-stream',
            'Cache-Control': 'public, max-age=3600',
            'CDN-Cache-Control': 'public, max-age=86400'
        }
    });
};