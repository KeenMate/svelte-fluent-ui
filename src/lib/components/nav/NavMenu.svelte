<script lang="ts">
	import type {SlotType} from "../../types/index.js"
	import NavExpander from "$lib/components/nav/NavExpander.svelte"
	import {styleList} from "../../helpers/html.js"

	type Props = {
		width?: string
		collapsed?: boolean
		collapsible?: boolean
		children?: SlotType
		[prop: string]: any
	}

	let {
		    width       = undefined,
		    collapsed   = $bindable(),
		    collapsible = undefined,
		    children    = undefined,
		    ...restProps
	    }: Props = $props()

	const computedStyle = $derived(styleList(
			collapsed ? "width: 40px; min-width: 40px" : `width: ${width || "250px"}`
	))
</script>

<div
	{...restProps}
	role="menu"
	class="fluent-nav-menu {restProps.class || ''}"
	class:collapsed
	style={computedStyle}
>
	{#if collapsible}
		<NavExpander onClick={() => collapsed = !collapsed} />
	{/if}

	{@render children?.()}
</div>
