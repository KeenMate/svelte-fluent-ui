<script lang="ts">
	import iconMap from 'virtual:fluentui-icons'

	type IconSize = 16 | 20 | 24 | 28 | 32 | 48
	type IconVariant = 'regular' | 'filled'
	type IconColor = 'neutral' | 'accent' | 'warning' | 'info' | 'error' | 'success' | 'fill' | 'fill-inverse' | 'lightweight' | 'disabled' | 'custom'

	type Props = {
		name: string
		size?: IconSize
		variant?: IconVariant
		color?: IconColor
		customColor?: string
		primaryFill?: string  // Legacy prop, use color instead
		hoverEffect?: boolean
		class?: string
		style?: string
		title?: string
		width?: string
	}

	// Color enum to CSS variable mapping (matching FluentUI Blazor)
	const colorMap: Record<IconColor, string> = {
		'neutral': 'var(--neutral-foreground-rest)',
		'accent': 'var(--accent-fill-rest)',
		'warning': 'var(--warning)',
		'info': 'var(--info)',
		'error': 'var(--error)',
		'success': 'var(--success)',
		'fill': 'var(--neutral-fill-rest)',
		'fill-inverse': 'var(--neutral-fill-inverse-rest)',
		'lightweight': 'var(--neutral-layer-1)',
		'disabled': 'var(--neutral-stroke-rest)',
		'custom': ''  // Uses customColor prop
	}

	let {
		name,
		size = 24,
		variant = 'regular',
		color = undefined,
		customColor = undefined,
		primaryFill = undefined,
		hoverEffect = false,
		class: className = '',
		style: styleParam = '',
		title = undefined,
		width = undefined
	}: Props = $props()

	// Resolve the fill color: color enum > customColor > primaryFill > currentColor
	let resolvedFill = $derived.by(() => {
		if (color === 'custom' && customColor) {
			return customColor
		}
		if (color && colorMap[color]) {
			return colorMap[color]
		}
		return primaryFill || 'currentColor'
	})

	let svgContent = $state<string>('')
	let svgContentFilled = $state<string>('')
	let isLoading = $state<boolean>(true)
	let error = $state<string | null>(null)

	// Derived computed style
	let computedStyle = $derived.by(() => {
		let styles = styleParam || ''
		styles += ` --icon-size: ${size}px;`
		styles += ` --icon-fill: ${resolvedFill};`
		if (width) {
			styles += ` width: ${width};`
		}
		return styles
	})

	const icons = iconMap as Record<string, string>

	// An inline-mode entry is raw SVG markup; an asset-mode entry is a URL.
	function isMarkup(entry: string): boolean {
		return entry.trimStart().startsWith('<')
	}

	// Resolve one icon key to its SVG markup. Inline entries are returned as-is;
	// asset URLs are fetched (so the SVG can be injected for `currentColor`).
	async function resolveMarkup(key: string): Promise<string> {
		const entry = icons[key]
		if (entry === undefined) {
			throw new Error(`Icon not found: ${key}`)
		}
		if (isMarkup(entry)) {
			return entry
		}
		const response = await fetch(entry)
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`)
		}
		return response.text()
	}

	// Resolve the requested icon (and the filled variant when hoverEffect is on)
	// from the virtual map whenever the inputs change.
	$effect(() => {
		const key = `${name}_${size}_${variant}`
		const entry = icons[key]

		if (entry === undefined) {
			console.error(
				`[svelte-fluentui] ${key}.svg not found. If this icon is referenced only ` +
					`through a dynamic name, add it to the svelteFluentUI({ iconsInclude: [...] }) option.`
			)
			error = `Icon not found: ${name}`
			svgContent = ''
			isLoading = false
			return
		}

		error = null

		if (isMarkup(entry)) {
			// Inline mode: markup is already in the bundle, no request needed.
			svgContent = entry
			isLoading = false
		} else {
			// Asset mode: fetch the hashed asset URL.
			isLoading = true
			resolveMarkup(key)
				.then((content) => {
					svgContent = content
				})
				.catch((err) => {
					console.error(`[svelte-fluentui] Failed to load icon: ${key}`, err)
					error = `Icon not found: ${name}`
					svgContent = ''
				})
				.finally(() => {
					isLoading = false
				})
		}

		// If hover effect is enabled, also resolve the filled variant.
		if (hoverEffect && variant === 'regular') {
			resolveMarkup(`${name}_${size}_filled`)
				.then((content) => {
					svgContentFilled = content
				})
				.catch(() => {
					svgContentFilled = ''
				})
		} else {
			svgContentFilled = ''
		}
	})
</script>

{#if error}
	<span class="fluent-icon-error" style={computedStyle} title={error}>⚠️</span>
{:else if isLoading}
	<span class="fluent-icon-loading" style={computedStyle} title="Loading icon..."></span>
{:else if hoverEffect && svgContentFilled}
	<!-- Hover effect: show both regular and filled -->
	<span class="fluent-icon fluent-icon-hoverable {className}" style={computedStyle}>
		<span class="icon-regular" {title}>{@html svgContent}</span>
		<span class="icon-filled" {title}>{@html svgContentFilled}</span>
	</span>
{:else}
	<!-- Standard icon without hover effect -->
	<span class="fluent-icon {className}" style={computedStyle} {title}>
		{@html svgContent}
	</span>
{/if}

<style>
	.fluent-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--icon-size, 24px);
		height: var(--icon-size, 24px);
		color: var(--icon-fill, currentColor);
		line-height: 1;
		vertical-align: middle;
	}

	.fluent-icon :global(svg) {
		width: 100%;
		height: 100%;
		fill: var(--icon-fill, currentColor);
		display: block;
	}

	/* Hover effect styles */
	.fluent-icon-hoverable {
		position: relative;
	}

	.fluent-icon-hoverable .icon-regular,
	.fluent-icon-hoverable .icon-filled {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	/* Default: show regular, hide filled */
	.fluent-icon-hoverable .icon-regular {
		display: inline-flex;
	}
	.fluent-icon-hoverable .icon-filled {
		display: none;
	}

	/* On hover/active: show filled, hide regular */
	.fluent-icon-hoverable:hover .icon-regular,
	.fluent-icon-hoverable:active .icon-regular {
		display: none;
	}
	.fluent-icon-hoverable:hover .icon-filled,
	.fluent-icon-hoverable:active .icon-filled {
		display: inline-flex;
	}

	/* Trigger icon change when parent button/link is hovered */
	:global(fluent-button:hover) .fluent-icon-hoverable .icon-regular,
	:global(button:hover) .fluent-icon-hoverable .icon-regular,
	:global(a:hover) .fluent-icon-hoverable .icon-regular,
	:global(.fluent-nav-link:hover) .fluent-icon-hoverable .icon-regular {
		display: none;
	}

	:global(fluent-button:hover) .fluent-icon-hoverable .icon-filled,
	:global(button:hover) .fluent-icon-hoverable .icon-filled,
	:global(a:hover) .fluent-icon-hoverable .icon-filled,
	:global(.fluent-nav-link:hover) .fluent-icon-hoverable .icon-filled {
		display: inline-flex;
	}

	/* Also trigger on active state */
	:global(fluent-button:active) .fluent-icon-hoverable .icon-regular,
	:global(button:active) .fluent-icon-hoverable .icon-regular,
	:global(a:active) .fluent-icon-hoverable .icon-regular,
	:global(.fluent-nav-link:active) .fluent-icon-hoverable .icon-regular {
		display: none;
	}

	:global(fluent-button:active) .fluent-icon-hoverable .icon-filled,
	:global(button:active) .fluent-icon-hoverable .icon-filled,
	:global(a:active) .fluent-icon-hoverable .icon-filled,
	:global(.fluent-nav-link:active) .fluent-icon-hoverable .icon-filled {
		display: inline-flex;
	}

	.fluent-icon-error,
	.fluent-icon-loading {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--icon-size, 24px);
		height: var(--icon-size, 24px);
		font-size: calc(var(--icon-size, 24px) * 0.75);
	}

	.fluent-icon-loading {
		opacity: 0.5;
	}
</style>
