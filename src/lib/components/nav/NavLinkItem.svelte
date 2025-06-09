<script lang="ts">
	import type {SlotType} from "../../types/index.js"
	import NavItem from "./NavItem.svelte"
	import PositioningRegion from "$lib/components/PositioningRegion.svelte"
	import ContentRegion from "$lib/components/ContentRegion.svelte"

	type Props = {
		href?: string
		rel?: string
		disabled?: boolean
		group?: boolean
		onClick?: (ev: MouseEvent) => void
		icon?: SlotType
		afterText?: SlotType
		children?: SlotType
		[prop: string]: any
	}

	let {
		    href      = undefined,
		    rel       = undefined,
		    disabled     = undefined,
		    group     = undefined,
		    icon      = undefined,
		    onClick = undefined,
		    afterText = undefined,
		    children  = undefined,
		    ...restProps
	    }: Props = $props()
</script>

<NavItem
	{group}
	{disabled}
	{...restProps}
	{onClick}
>
	<a
		{href}
		{rel}
		class="fluent-nav-link"
		class:disabled
		{...restProps}
	>
		<PositioningRegion>
			<ContentRegion>
				{@render icon?.()}

				<span
					class="fluent-nav-text"
					class:disabled
				>
					{@render children?.()}
				</span>

				{@render afterText?.()}
			</ContentRegion>
		</PositioningRegion>
	</a>
</NavItem>
