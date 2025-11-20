<script lang="ts">
	import type {SlotType} from "../../types/index.js"

	type Props = {
		children?: SlotType
		height?: number
		class?: string
		style?: string
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
		height = 50,
		class: className = "",
		style = ""
	}: Props = $props()

	let element: HTMLElement | undefined = $state()

	let computedStyle = $derived(
		[height != null && `height: ${height}px;`, style].filter(Boolean).join(" ")
	)
</script>

<header
	bind:this={element}
	style={computedStyle}
	class="header {className}"
>
	<div class="header-gutters">
		{@render children?.()}
	</div>
</header>
