<script lang="ts">
	import type {SlotType} from "../../types/index.js"
	import NavItem from "./NavItem.svelte"
	import NavLink from "$lib/components/nav/NavLink.svelte"

	type Props = {
		href?: string
		rel?: string
		target?: string
		title?: string
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
		    target    = undefined,
		    title     = undefined,
		    disabled  = undefined,
		    group     = undefined,
		    icon      = undefined,
		    onClick   = undefined,
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
	<NavLink
		{href}
		{rel}
		{target}
		{title}
		{disabled}
		{icon}
		{children}
		{afterText}
		{...restProps}
	/>
</NavItem>
