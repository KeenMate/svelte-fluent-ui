<script lang="ts">
	import type {SlotType} from "../../types/index.js"
	import NavExpander from "./NavExpander.svelte"
	import {styleList} from "../../helpers/html.js"

	type Props = {
		width?: string
		collapsed?: boolean
		collapsible?: boolean
		children?: SlotType
		class?: string
	}

	let {
		    width       = undefined,
		    collapsed   = $bindable(),
		    collapsible = undefined,
		    children    = undefined,
		    class: className = undefined
	    }: Props = $props()

	const computedStyle = $derived(styleList(
			collapsed ? "width: 40px; min-width: 40px" : width ? `width: ${width}` : "width: 100%"
	))
</script>

<div
	role="menu"
	class="fluent-nav-menu {className || ''}"
	class:collapsed
	style={computedStyle}
>
	{#if collapsible}
		<NavExpander onClick={() => collapsed = !collapsed} />
	{/if}

	{@render children?.()}
</div>
