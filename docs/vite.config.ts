import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { fluentuiIcons } from '../packages/svelte-fluentui/src/lib/vite/vite-plugin-fluentui-icons.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read version from svelte-fluentui package.json
const pkg = JSON.parse(
	readFileSync(path.resolve(__dirname, '../packages/svelte-fluentui/package.json'), 'utf-8')
);

export default defineConfig({
	plugins: [
		sveltekit(),
		fluentuiIcons({
			verbose: true
		})
	],
	define: {
		__SVELTE_FLUENTUI_VERSION__: JSON.stringify(pkg.version)
	},
	resolve: {
		alias: {
			// Import library from SOURCE for instant HMR
			'svelte-fluentui': path.resolve(__dirname, '../packages/svelte-fluentui/src/lib'),
			'svelte-fluentui/styles.scss': path.resolve(__dirname, '../packages/svelte-fluentui/src/lib/main.scss')
		}
	},
	server: {
		fs: {
			// Allow Vite to read files from the workspace root (one level above docs/),
			// so `import '../../../CHANGELOG.md?raw'` in homepage / changelog routes
			// can resolve to the single source-of-truth CHANGELOG.md at the repo root.
			allow: [path.resolve(__dirname, '..')]
		}
	},
	ssr: {
		noExternal: ['@fluentui/web-components']
	}
});
