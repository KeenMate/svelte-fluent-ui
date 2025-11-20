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
		linkAction?: (node: HTMLElement) => void
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
		    linkAction = undefined
	    }: Props = $props()
</script>

<NavItem
	{group}
	{disabled}
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
		{linkAction}
	/>
</NavItem>
