/**
 * Vite Plugin: FluentUI Icons
 *
 * Scans your source for `<Icon name="..." />` usage and makes only the icons you
 * actually use available through a virtual module (`virtual:fluentui-icons`) that
 * the `Icon` component imports. Icons therefore travel through Vite's normal
 * output — never a `/node_modules/...` URL.
 *
 * Two delivery modes:
 * - `inline` (default): each used icon's SVG markup is baked into the JS bundle.
 *   No runtime request; the icons live in a shared, cached chunk.
 * - `asset`: each used icon is emitted as a hashed file under `/_app/*` (Vite's
 *   asset pipeline) and the component fetches that hashed URL.
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { fluentuiIcons } from 'svelte-fluentui/vite';
 *
 * export default defineConfig({
 *   plugins: [sveltekit(), fluentuiIcons({ mode: 'inline' })]
 * });
 * ```
 */

import { type Plugin, type ResolvedConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export type FluentUIIconsMode = 'inline' | 'asset';

/**
 * An icon to always include, optionally restricting which sizes/variants ship.
 * When `sizes`/`variants` are given they also *cap* the auto-detected usage of
 * that icon: e.g. a data-driven `<Icon name={item.icon} />` normally can't be
 * pinned to a size and falls back to every size, but `{ name, sizes: [16] }`
 * clamps it to size 16.
 */
export interface IconInclude {
	name: string;
	/** Sizes to bundle for this icon when a usage's size is unknown. */
	sizes?: number[];
	/** Variants to bundle for this icon when a usage's variant is unknown. */
	variants?: ('regular' | 'filled')[];
}

export interface FluentUIIconsOptions {
	/**
	 * Delivery mode for the icons.
	 * - `inline` (default): SVG markup baked into the JS bundle (no runtime request).
	 * - `asset`: emitted as hashed files under `/_app/*` and fetched at runtime.
	 */
	mode?: FluentUIIconsMode;

	/**
	 * Additional icons to always include (for names the scanner can't see, e.g.
	 * fully computed `name={iconName}` or template interpolation). Each entry is
	 * either a name (all sizes/variants) or an object restricting sizes/variants.
	 * @example ['home', 'settings', { name: 'history', sizes: [16] }]
	 */
	include?: (string | IconInclude)[];

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
	 * File extensions to scan for icon usage.
	 * @default ['.svelte', '.ts', '.js']
	 */
	scanExtensions?: string[];

	/**
	 * Icon sizes to make available for each detected icon.
	 * @default [16, 20, 24, 28, 32, 48]
	 */
	sizes?: number[];

	/**
	 * Icon variants to make available for each detected icon.
	 * @default ['regular', 'filled']
	 */
	variants?: ('regular' | 'filled')[];

	/**
	 * Enable verbose logging
	 * @default false
	 */
	verbose?: boolean;
}

const VIRTUAL_ID = 'virtual:fluentui-icons';
const RESOLVED_VIRTUAL_ID = '\0' + VIRTUAL_ID;

const DEFAULT_CONFIG_FILES = [
	'fluentui-icons.config.json',
	'fluentui-icons.config.js',
	'fluentui-icons.config.ts'
];

const DEFAULT_OPTIONS: Required<Omit<FluentUIIconsOptions, 'configFile'>> & {
	configFile: string | false | undefined;
} = {
	mode: 'inline',
	include: [],
	configFile: undefined, // Will auto-detect
	scanExtensions: ['.svelte', '.ts', '.js'],
	sizes: [16, 20, 24, 28, 32, 48],
	variants: ['regular', 'filled'],
	verbose: false
};

// Directories that never contain first-party <Icon> usage worth scanning.
const IGNORED_DIRS = new Set([
	'node_modules',
	'.git',
	'.svelte-kit',
	'dist',
	'build',
	'.vercel',
	'.netlify',
	'.output'
]);

/**
 * Load icons from a config file
 */
async function loadConfigFile(
	configPath: string,
	verbose: boolean
): Promise<(string | IconInclude)[]> {
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
 * A single icon requirement discovered in source. `size`/`variants` of `null`
 * mean "couldn't be determined statically — include every configured size /
 * variant" (the safe fallback for dynamic `size={…}` and data-driven names).
 */
interface IconRequest {
	name: string;
	size: number | null;
	variants: ('regular' | 'filled')[] | null;
}

const DEFAULT_ICON_SIZE = 24;

/**
 * Parse a single `<Icon … >` tag into per-name requirements, reading the
 * `name`, `size`, `variant`, and `hoverEffect` attributes so we can bundle only
 * the exact size/variant tuples actually rendered.
 */
function parseIconTag(tag: string): IconRequest[] {
	// Names: static name="x", plus any quoted literals inside a dynamic
	// name={cond ? "a" : "b"} / name={"home" + suffix} expression.
	const names = new Set<string>();
	const staticName = /\sname=["']([^"']+)["']/.exec(tag);
	if (staticName) names.add(staticName[1]);
	const dynamicName = /\sname=\{([^}]*)\}/.exec(tag);
	if (dynamicName) {
		const literalPattern = /["']([a-z][a-z0-9_]*)["']/g;
		let literal;
		while ((literal = literalPattern.exec(dynamicName[1])) !== null) {
			names.add(literal[1]);
		}
	}
	if (names.size === 0) return [];

	// Size: literal size={20} / size="20" → that size; no size attr → default;
	// dynamic size={expr} → null (all sizes).
	let size: number | null;
	const sizeLiteral = /\ssize=(?:\{(\d+)\}|["'](\d+)["'])/.exec(tag);
	if (sizeLiteral) {
		size = parseInt(sizeLiteral[1] ?? sizeLiteral[2], 10);
	} else if (/\ssize=/.test(tag)) {
		size = null;
	} else {
		size = DEFAULT_ICON_SIZE;
	}

	// Variant: static variant="filled" → that; no variant attr → regular;
	// dynamic variant={expr} → null (both).
	let variants: ('regular' | 'filled')[] | null;
	const variantLiteral = /\svariant=["'](regular|filled)["']/.exec(tag);
	if (variantLiteral) {
		variants = [variantLiteral[1] as 'regular' | 'filled'];
	} else if (/\svariant=/.test(tag)) {
		variants = null;
	} else {
		variants = ['regular'];
	}

	// hoverEffect swaps to the filled variant on hover, so it needs `filled` too.
	if (/\shoverEffect\b/.test(tag) && variants && !variants.includes('filled')) {
		variants = [...variants, 'filled'];
	}

	return [...names].map((name) => ({ name, size, variants }));
}

/**
 * Extract every icon requirement from a source file: `<Icon>` tags (size/variant
 * aware) plus object properties (name:/icon:/iconName: "…", all sizes/variants).
 */
function extractIconRequests(code: string): IconRequest[] {
	const requests: IconRequest[] = [];

	const tagPattern = /<Icon\b[^>]*>/g;
	let match;
	while ((match = tagPattern.exec(code)) !== null) {
		requests.push(...parseIconTag(match[0]));
	}

	// Programmatic usage (data arrays, config): name has no tag context, so we
	// can't know the size/variant — include all.
	const objectPattern = /(?:icon(?:Name)?|name):\s*["']([a-z][a-z_]*)["']/g;
	while ((match = objectPattern.exec(code)) !== null) {
		requests.push({ name: match[1], size: null, variants: null });
	}

	return requests;
}

/**
 * Recursively scan a project directory for icon usage.
 */
function scanProjectForIcons(root: string, extensions: string[]): IconRequest[] {
	const requests: IconRequest[] = [];

	const walk = (dir: string) => {
		let entries: fs.Dirent[];
		try {
			entries = fs.readdirSync(dir, { withFileTypes: true });
		} catch {
			return;
		}

		for (const entry of entries) {
			if (entry.isDirectory()) {
				if (IGNORED_DIRS.has(entry.name) || entry.name.startsWith('.')) continue;
				walk(path.join(dir, entry.name));
			} else if (entry.isFile() && extensions.includes(path.extname(entry.name))) {
				try {
					const code = fs.readFileSync(path.join(dir, entry.name), 'utf-8');
					requests.push(...extractIconRequests(code));
				} catch {
					// Ignore unreadable files
				}
			}
		}
	};

	walk(root);
	return requests;
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

export function fluentuiIcons(options: FluentUIIconsOptions = {}): Plugin {
	const opts = { ...DEFAULT_OPTIONS, ...options };
	const includeEntries: (string | IconInclude)[] = [...opts.include];

	let config: ResolvedConfig;
	let iconsSourcePath: string | null = null;
	let isBuild = false;

	return {
		name: 'vite-plugin-fluentui-icons',

		async configResolved(resolvedConfig) {
			config = resolvedConfig;
			isBuild = config.command === 'build';
			iconsSourcePath = findIconsPackage(config.root);

			if (!iconsSourcePath) {
				console.warn(
					'[fluentui-icons] @fluentui/svg-icons not found in node_modules. Icons will not be available.'
				);
			}

			// Load config file if not disabled
			if (opts.configFile !== false) {
				let configPath: string | null = null;
				if (typeof opts.configFile === 'string') {
					configPath = path.isAbsolute(opts.configFile)
						? opts.configFile
						: path.join(config.root, opts.configFile);
				} else {
					configPath = findConfigFile(config.root);
				}

				if (configPath) {
					const configIcons = await loadConfigFile(configPath, opts.verbose);
					includeEntries.push(...configIcons);
				}
			}
		},

		resolveId(id) {
			if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID;
			return null;
		},

		load(id) {
			if (id !== RESOLVED_VIRTUAL_ID) return null;

			if (!iconsSourcePath) {
				return 'export default {};';
			}

			// Collect every icon requirement from scanned usage, and register each
			// `include` entry (a name pulls every size/variant; an object entry caps
			// the sizes/variants for that name — even for its auto-detected usage).
			const requests = scanProjectForIcons(config.root, opts.scanExtensions);
			const overrides = new Map<string, { sizes?: number[]; variants?: ('regular' | 'filled')[] }>();
			for (const entry of includeEntries) {
				const name = typeof entry === 'string' ? entry : entry.name;
				requests.push({ name, size: null, variants: null });
				if (typeof entry !== 'string' && (entry.sizes?.length || entry.variants?.length)) {
					const override = overrides.get(name) ?? {};
					if (entry.sizes?.length) override.sizes = entry.sizes;
					if (entry.variants?.length) override.variants = entry.variants;
					overrides.set(name, override);
				}
			}

			// Expand requirements into the exact set of `name_size_variant` keys we
			// need. A usage with a literal size/variant is used as-is; an unknown
			// one falls back to the per-name override, then to the configured
			// sizes/variants.
			const wanted = new Set<string>();
			const names = new Set<string>();
			for (const req of requests) {
				names.add(req.name);
				const override = overrides.get(req.name);
				const sizes = req.size !== null ? [req.size] : (override?.sizes ?? opts.sizes);
				const variants = req.variants !== null ? req.variants : (override?.variants ?? opts.variants);
				for (const size of sizes) {
					for (const variant of variants) {
						wanted.add(`${req.name}_${size}_${variant}`);
					}
				}
			}

			// `asset` mode only emits hashed files during a real build; in dev we
			// always inline (Vite's asset pipeline isn't running), which also keeps
			// dev and prod consistent — a missing icon fails the same way in both.
			const useAsset = isBuild && opts.mode === 'asset';

			const entries: string[] = [];
			let count = 0;

			for (const key of wanted) {
				const fileName = `${key}.svg`;
				const sourceFile = path.join(iconsSourcePath, fileName);
				if (!fs.existsSync(sourceFile)) continue;

				if (useAsset) {
					const referenceId = this.emitFile({
						type: 'asset',
						name: fileName,
						source: fs.readFileSync(sourceFile)
					});
					entries.push(`${JSON.stringify(key)}: import.meta.ROLLUP_FILE_URL_${referenceId}`);
				} else {
					const svg = fs.readFileSync(sourceFile, 'utf-8');
					entries.push(`${JSON.stringify(key)}: ${JSON.stringify(svg)}`);
				}
				count++;
			}

			if (opts.verbose) {
				console.log(
					`[fluentui-icons] ${opts.mode} mode: ${names.size} icon(s), ${count} file(s) ` +
						`(${useAsset ? 'emitted as assets' : 'inlined'})`
				);
			}

			return `export default {\n${entries.join(',\n')}\n};`;
		},

		handleHotUpdate(ctx) {
			// When a scanned source file changes, the set of used icons may change —
			// invalidate the virtual module so it regenerates.
			if (!opts.scanExtensions.includes(path.extname(ctx.file))) return;
			const mod = ctx.server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID);
			if (mod) {
				ctx.server.moduleGraph.invalidateModule(mod);
				return [...ctx.modules, mod];
			}
		}
	};
}

export default fluentuiIcons;
