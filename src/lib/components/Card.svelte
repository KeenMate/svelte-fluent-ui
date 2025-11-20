<script lang="ts">
	import type {SlotType} from "../types/index.js"

	type Props = {
		width?: string | number
		height?: string | number
		areaRestricted?: boolean
		class?: string
		style?: string
		minimalStyle?: boolean
		children?: SlotType
	}

	let {
		width = undefined,
		height = undefined,
		areaRestricted = undefined,
		class: classParam = undefined,
		style: styleParam = undefined,
		minimalStyle = undefined,
		children = undefined
	}: Props = $props()

	let computedStyle = $derived.by(() => {
		let styles = styleParam || ""
		if (width) styles += ` width: ${typeof width === "number" ? width + "px" : width};`
		if (height) styles += ` height: ${typeof height === "number" ? height + "px" : height};`
		return styles
	})

	let computedClass = $derived.by(() => {
		let classes = "card " + (classParam || "")
		if (minimalStyle) classes += " minimal"
		if (areaRestricted) classes += " area-restricted"
		return classes.trim()
	})
</script>

<div class={computedClass} style={computedStyle} >
	{@render children?.()}
</div>

<style>
	.card {
		padding: calc(var(--design-unit) * 5px);
		background: var(--neutral-layer-1, #ffffff);
		border-radius: var(--control-corner-radius, 4px);
		border: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
		overflow: visible;
		transition: box-shadow 0.2s ease;
	}

	.card:hover {
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
	}

	.card.minimal {
		border: none;
		box-shadow: none;
		background: transparent;
	}

	.card.minimal:hover {
		box-shadow: none;
	}

	.card.area-restricted {
		overflow: auto;
	}
</style>
