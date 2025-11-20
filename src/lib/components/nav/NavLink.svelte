<script lang="ts">
	import type {SlotType} from "../../types/index.js"
	import PositioningRegion from "$lib/components/PositioningRegion.svelte"
	import ContentRegion from "$lib/components/ContentRegion.svelte"
	import NavIcon from "$lib/components/nav/NavIcon.svelte"

	type Props = {
		href?: string
		rel?: string
		onClick?: (ev: MouseEvent) => void
		icon?: SlotType
		afterText?: SlotType
		children?: SlotType
		linkAction?: (node: HTMLElement) => void
		class?: string
	}

	let {
		    href      = undefined,
		    rel       = undefined,
		    icon      = undefined,
		    onClick   = undefined,
		    afterText = undefined,
		    children  = undefined,
		    linkAction = undefined,
		    class: className = undefined
	    }: Props = $props()

	let renderElement = $derived(href
		? "a"
		: "div"
	)
</script>

<svelte:element
	this={renderElement}
	{href}
	{rel}
	class="fluent-nav-link {className || ''}"
	onclick={onClick}
	use:linkAction
>
	<PositioningRegion>
		<ContentRegion>
			<NavIcon>
				{@render icon?.()}
			</NavIcon>

			<span class="fluent-nav-text">
				{@render children?.()}
			</span>

			{@render afterText?.()}
		</ContentRegion>
	</PositioningRegion>
</svelte:element>
