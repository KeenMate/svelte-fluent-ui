import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function copyDir(src, dest) {
	fs.mkdirSync(dest, {recursive: true});
	const entries = fs.readdirSync(src, {withFileTypes: true});

	for (const entry of entries) {
		const srcPath = path.join(src, entry.name);
		const destPath = path.join(dest, entry.name);

		if (entry.isDirectory()) {
			copyDir(srcPath, destPath);
		} else {
			fs.copyFileSync(srcPath, destPath);
		}
	}
}

// Copy assets to dist
const srcAssets = path.join(rootDir, 'src', 'assets');
const distAssets = path.join(rootDir, 'dist', 'assets');
copyDir(srcAssets, distAssets);

// Generate main.scss with @use (no @import, following Dart Sass 3.0 requirements)
const mainScssContent = `/**
 * Main SCSS Entry Point
 * This file imports all component styles and theme system
 *
 * Usage in themes:
 * Since Sass module system doesn't support dynamic variable overrides,
 * themes should create their own variables file and load components individually:
 *
 * // custom-theme.scss
 * @use 'my-variables' as variables;
 * @use 'svelte-fluentui/assets/styles/fluent-ui/main';
 * @use 'svelte-fluentui/assets/styles/theme' with ($navbar-bg-light: #FFCC00);
 * @use 'svelte-fluentui/assets/styles/layout';
 * @use 'svelte-fluentui/assets/styles/nav';
 * @use 'svelte-fluentui/assets/styles/components';
 */

// Use FluentUI web components styles
@use "assets/styles/fluent-ui/main";

// Use theme system (converts variables to CSS custom properties)
// Note: theme.scss internally loads variables.scss
@use "assets/styles/theme.scss";

// Use component styles
@use "assets/styles/layout.scss";
@use "assets/styles/nav.scss";
@use "assets/styles/components.scss";

// Use FluentUI Blazor compatibility styles
@use "assets/styles/fluent-blazor-compat.scss";
`;
fs.writeFileSync(path.join(rootDir, 'dist', 'main.scss'), mainScssContent);

console.log('✓ Assets copied to dist/');
console.log('✓ main.scss generated');
