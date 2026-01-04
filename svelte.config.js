import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		// Static adapter for PWA deployment
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '200.html', // SPA fallback
			precompress: false,
			strict: true
		}),
		paths: {
			// Set base path for GitHub Pages (repo name)
			// Comment out for custom domain or local dev
			base: process.env.NODE_ENV === 'production' ? '/myndness' : ''
		}
	}
};

export default config;
