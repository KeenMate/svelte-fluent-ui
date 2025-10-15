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

// Generate main.scss with @import (required for theme override pattern)
const mainScssContent = `// Import FluentUI web components styles
@import "assets/styles/fluent-ui/main";

// Import variables (with !default flags, can be overridden by themes)
@import "assets/styles/variables.scss";

// Import theme system (converts variables to CSS custom properties)
@import "assets/styles/theme.scss";

// Import component styles
@import "assets/styles/layout.scss";
@import "assets/styles/nav.scss";
@import "assets/styles/components.scss";
`;
fs.writeFileSync(path.join(rootDir, 'dist', 'main.scss'), mainScssContent);

console.log('✓ Assets copied to dist/');
console.log('✓ main.scss generated');
