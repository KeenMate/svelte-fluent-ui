<script lang="ts">
	import type {SlotType} from "../../types/index.js"

	type Orientation = "horizontal" | "vertical"

	type Props = {
		children?: SlotType
		orientation?: Orientation
		class?: string
		style?: string
		[prop: string]: any
	}

	// Filter out null/undefined values from object to prevent Svelte 5 spreading errors
	function filterNullProps(obj: Record<string, any> | undefined): Record<string, any> {
		if (!obj) return {}
		return Object.fromEntries(
			Object.entries(obj).filter(([_, value]) => value != null)
		)
	}

	let {
		children = undefined,
		orientation = "vertical",
		class: className = "",
		style = "",
		...restProps
	}: Props = $props()

	let element: HTMLElement | undefined = $state()
</script>

<div
	bind:this={element}
	{style}
	class="layout {className}"
	data-orientation={orientation === "horizontal" ? "horizontal" : null}
>
	{@render children?.()}
</div>
