import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
    redirect(307, 'https://discord.gg/A3RMYzf6DA');
};

