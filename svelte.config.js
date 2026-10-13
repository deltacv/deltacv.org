import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import remarkSlug from 'remark-slug'; 

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.svx'],
		})
	],
	kit: {
		adapter: adapter(),
		prerender: {
			handleUnseenRoutes: 'ignore',
			entries: ['*', '/sitemap.xml']
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
