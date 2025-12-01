import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { fluentuiIcons } from '../packages/svelte-fluentui/src/lib/vite/vite-plugin-fluentui-icons.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [
		sveltekit(),
		fluentuiIcons({
			verbose: true
		})
	],
	resolve: {
		alias: {
			// Import library from SOURCE for instant HMR
			'svelte-fluentui': path.resolve(__dirname, '../packages/svelte-fluentui/src/lib'),
			'svelte-fluentui/styles.scss': path.resolve(__dirname, '../packages/svelte-fluentui/src/lib/main.scss')
		}
	},
	ssr: {
		noExternal: ['@fluentui/web-components']
	}
});
