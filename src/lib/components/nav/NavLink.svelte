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
		[prop: string]: any
	}

	let {
		    href      = undefined,
		    rel       = undefined,
		    icon      = undefined,
		    onClick   = undefined,
		    afterText = undefined,
		    children  = undefined,
		    ...restProps
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
	{...restProps}
	class="fluent-nav-link {restProps.class || ''}"
	onclick={onClick}
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
