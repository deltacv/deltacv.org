import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

import remarkSlug from 'remark-slug'; // <-- 1. IMPORT

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(),
	mdsvex({
		extensions: ['.svx'],
		remarkPlugins: [
			remarkSlug // <-- 2. ADD PLUGIN HERE
		]
	})
	],
	kit: { // adapter-auto only supports some environments, see https://sve	lte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter()
	},
	extensions: ['.svelte', '.svx'],
};

export default config;
