/**
 * Vite Plugin: FluentUI Icons
 *
 * A Vite plugin that handles @fluentui/svg-icons for both development and production:
 * - Dev mode: Configures server to serve icons from node_modules
 * - Build mode: Scans source files and copies only used icons to the output
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { fluentuiIcons } from 'svelte-fluentui/vite';
 *
 * export default defineConfig({
 *   plugins: [sveltekit(), fluentuiIcons()]
 * });
 * ```
 */

import { type Plugin, type ResolvedConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export interface FluentUIIconsOptions {
	/**
	 * Additional icon names to always include (for dynamic usage)
	 * @example ['home', 'settings', 'person']
	 */
	include?: string[];

	/**
	 * Path to a config file containing additional icons to include.
	 * Supports .json or .ts/.js files.
	 *
	 * JSON format: { "icons": ["home", "settings"] }
	 * TS/JS format: export default ["home", "settings"] or export const icons = [...]
	 *
	 * @default 'fluentui-icons.config.json' (if exists)
	 */
	configFile?: string | false;

	/**
	 * Glob patterns for files to scan for icon usage
	 * @default ['**\/*.svelte', '**\/*.ts', '**\/*.js']
	 */
	scanPatterns?: string[];

	/**
	 * Icon sizes to copy for each detected icon
	 * @default [16, 20, 24, 28, 32, 48]
	 */
	sizes?: number[];

	/**
	 * Icon variants to copy for each detected icon
	 * @default ['regular', 'filled']
	 */
	variants?: ('regular' | 'filled')[];

	/**
	 * Output path relative to build output directory
	 * @default 'node_modules/@fluentui/svg-icons/icons'
	 */
	outputPath?: string;

	/**
	 * Enable verbose logging
	 * @default false
	 */
	verbose?: boolean;
}

const DEFAULT_CONFIG_FILES = [
	'fluentui-icons.config.json',
	'fluentui-icons.config.js',
	'fluentui-icons.config.ts'
];

const DEFAULT_OPTIONS: Omit<Required<FluentUIIconsOptions>, 'configFile'> & { configFile: string | false | undefined } = {
	include: [],
	configFile: undefined, // Will auto-detect
	scanPatterns: ['**/*.svelte', '**/*.ts', '**/*.js'],
	sizes: [16, 20, 24, 28, 32, 48],
	variants: ['regular', 'filled'],
	outputPath: 'node_modules/@fluentui/svg-icons/icons',
	verbose: false
};

/**
 * Load icons from a config file
 */
async function loadConfigFile(configPath: string, verbose: boolean): Promise<string[]> {
	if (!fs.existsSync(configPath)) {
		return [];
	}

	const ext = path.extname(configPath).toLowerCase();

	try {
		if (ext === '.json') {
			const content = fs.readFileSync(configPath, 'utf-8');
			const config = JSON.parse(content);
			const icons = config.icons || config.include || config;
			if (Array.isArray(icons)) {
				if (verbose) {
					console.log(`[fluentui-icons] Loaded ${icons.length} icon(s) from ${configPath}`);
				}
				return icons;
			}
			console.warn(`[fluentui-icons] Config file ${configPath} does not contain an array of icons`);
			return [];
		}

		if (ext === '.js' || ext === '.ts') {
			// Use dynamic import for JS/TS files
			const fileUrl = `file://${configPath.replace(/\\/g, '/')}`;
			const module = await import(fileUrl);
			const icons = module.default || module.icons || module.include;
			if (Array.isArray(icons)) {
				if (verbose) {
					console.log(`[fluentui-icons] Loaded ${icons.length} icon(s) from ${configPath}`);
				}
				return icons;
			}
			console.warn(`[fluentui-icons] Config file ${configPath} does not export an array of icons`);
			return [];
		}

		console.warn(`[fluentui-icons] Unsupported config file format: ${ext}`);
		return [];
	} catch (err) {
		console.error(`[fluentui-icons] Error loading config file ${configPath}:`, err);
		return [];
	}
}

/**
 * Find the first existing config file
 */
function findConfigFile(root: string): string | null {
	for (const fileName of DEFAULT_CONFIG_FILES) {
		const filePath = path.join(root, fileName);
		if (fs.existsSync(filePath)) {
			return filePath;
		}
	}
	return null;
}

/**
 * Extract icon names from source code
 * Supports patterns like:
 * - <Icon name="icon_name" />
 * - <Icon name='icon_name' />
 * - name: "icon_name" (for JS/TS objects)
 */
function extractIconNames(code: string): Set<string> {
	const icons = new Set<string>();

	// Match <Icon name="..." /> or <Icon name='...' />
	const sveltePattern = /<Icon[^>]*\sname=["']([^"']+)["']/g;
	let match;
	while ((match = sveltePattern.exec(code)) !== null) {
		icons.add(match[1]);
	}

	// Match icon-related properties in objects (for programmatic usage)
	// Covers patterns like: name: "home", icon: "settings", iconName: "person"
	const objectPattern = /(?:icon(?:Name)?|name):\s*["']([a-z][a-z_]*)["']/g;
	while ((match = objectPattern.exec(code)) !== null) {
		icons.add(match[1]);
	}

	return icons;
}

/**
 * Find the @fluentui/svg-icons package in node_modules
 */
function findIconsPackage(startDir: string): string | null {
	let currentDir = startDir;

	while (currentDir !== path.parse(currentDir).root) {
		const iconsPath = path.join(currentDir, 'node_modules', '@fluentui', 'svg-icons', 'icons');
		if (fs.existsSync(iconsPath)) {
			return iconsPath;
		}
		currentDir = path.dirname(currentDir);
	}

	return null;
}

/**
 * Copy a single icon file if it exists
 */
function copyIconFile(
	iconName: string,
	size: number,
	variant: string,
	sourcePath: string,
	destPath: string,
	verbose: boolean
): boolean {
	const fileName = `${iconName}_${size}_${variant}.svg`;
	const sourceFile = path.join(sourcePath, fileName);
	const destFile = path.join(destPath, fileName);

	if (fs.existsSync(sourceFile)) {
		fs.copyFileSync(sourceFile, destFile);
		if (verbose) {
			console.log(`  Copied: ${fileName}`);
		}
		return true;
	}
	return false;
}

export function fluentuiIcons(options: FluentUIIconsOptions = {}): Plugin {
	const opts = { ...DEFAULT_OPTIONS, ...options };
	const detectedIcons = new Set<string>(opts.include);
	let config: ResolvedConfig;
	let iconsSourcePath: string | null = null;
	let configFileLoaded = false;

	return {
		name: 'vite-plugin-fluentui-icons',

		async configResolved(resolvedConfig) {
			config = resolvedConfig;
			iconsSourcePath = findIconsPackage(config.root);

			if (!iconsSourcePath) {
				console.warn(
					'[fluentui-icons] @fluentui/svg-icons not found in node_modules. Icons will not be available.'
				);
			}

			// Load config file if not disabled
			if (opts.configFile !== false && !configFileLoaded) {
				configFileLoaded = true;
				let configPath: string | null = null;

				if (typeof opts.configFile === 'string') {
					// Explicit config file path
					configPath = path.isAbsolute(opts.configFile)
						? opts.configFile
						: path.join(config.root, opts.configFile);
				} else {
					// Auto-detect config file
					configPath = findConfigFile(config.root);
				}

				if (configPath) {
					const configIcons = await loadConfigFile(configPath, opts.verbose);
					configIcons.forEach((icon) => detectedIcons.add(icon));
				}
			}
		},

		// Configure dev server to serve icons from node_modules
		configureServer(server) {
			if (!iconsSourcePath) return;

			// Serve icons from node_modules during development
			server.middlewares.use((req, res, next) => {
				if (req.url?.startsWith('/node_modules/@fluentui/svg-icons/icons/')) {
					const fileName = req.url.replace('/node_modules/@fluentui/svg-icons/icons/', '');
					const filePath = path.join(iconsSourcePath!, fileName);

					if (fs.existsSync(filePath)) {
						res.setHeader('Content-Type', 'image/svg+xml');
						res.end(fs.readFileSync(filePath));
						return;
					}
				}
				next();
			});
		},

		// Scan source files during transform to detect used icons
		transform(code, id) {
			// Only scan files matching our patterns
			const shouldScan = opts.scanPatterns.some((pattern) => {
				const ext = pattern.replace('**/*', '');
				return id.endsWith(ext);
			});

			if (shouldScan) {
				const icons = extractIconNames(code);
				icons.forEach((icon) => detectedIcons.add(icon));
			}

			return null; // Don't modify the code
		},

		// Copy detected icons to build output
		async writeBundle(outputOptions) {
			if (!iconsSourcePath) return;

			const outDir = outputOptions.dir || config.build.outDir;
			const destPath = path.join(outDir, opts.outputPath);

			// Create destination directory
			fs.mkdirSync(destPath, { recursive: true });

			let copiedCount = 0;
			const iconList = Array.from(detectedIcons);

			if (opts.verbose || iconList.length > 0) {
				console.log(`\n[fluentui-icons] Detected ${iconList.length} unique icon(s)`);
			}

			// Copy each icon in all size/variant combinations
			for (const iconName of iconList) {
				for (const size of opts.sizes) {
					for (const variant of opts.variants) {
						if (copyIconFile(iconName, size, variant, iconsSourcePath, destPath, opts.verbose)) {
							copiedCount++;
						}
					}
				}
			}

			console.log(`[fluentui-icons] Copied ${copiedCount} icon file(s) to ${opts.outputPath}`);

			if (iconList.length > 0 && opts.verbose) {
				console.log(`[fluentui-icons] Icons: ${iconList.join(', ')}`);
			}
		}
	};
}

export default fluentuiIcons;
