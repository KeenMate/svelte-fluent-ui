<script lang="ts">
	import type {SlotType} from "../../types/index.js"
	import NavItem from "./NavItem.svelte"

	type Props = {
		href?: string
		rel?: string
		group?: boolean
		icon?: SlotType
		children?: SlotType
		[prop: string]: any
	}

	let {
		    href     = undefined,
		    rel      = undefined,
		    group    = undefined,
		    icon     = undefined,
		    children = undefined,
		    ...restProps
	    }: Props = $props()
</script>

<NavItem
	{group}
	{...restProps}
>
	<a
		{href}
		{rel}
		class="fluent-nav-link"
		{...restProps}
	>
	<span class="positioning-region">
		<span class="content-region">
			{@render icon?.()}

			<span class="fluent-nav-text">
				{@render children?.()}
			</span>
		</span>
	</span>
	</a>
</NavItem>
