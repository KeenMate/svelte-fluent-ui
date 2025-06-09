<script lang="ts">
	import type {SlotType} from "../../types/index.js"
	import {getContext} from "svelte"
	import type {NavGroupSvelteContext} from "../../fluent-ui/types/nav-group.js"
	import PositioningRegion from "$lib/components/PositioningRegion.svelte"
	import ContentRegion from "$lib/components/ContentRegion.svelte"

	type Props = {
		children?: SlotType
		group?: boolean
		[prop: string]: any
	}

	let {
		    group    = undefined,
		    children = undefined,
		    ...restProps
	    }: Props = $props()

	const isInNavGroup = getContext<NavGroupSvelteContext>("nav-group")
</script>

<div
	class="fluent-nav-item"
	class:fluent-nav-group={group}
	role="menuitem"
	{...restProps}
>
	{#if isInNavGroup}
		<PositioningRegion>
			<ContentRegion>
				{@render children?.()}
			</ContentRegion>
		</PositioningRegion>
	{:else}
		{@render children?.()}
	{/if}

</div>
