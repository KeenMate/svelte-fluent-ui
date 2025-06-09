<script lang="ts">
	import HamburgerIcon from "$lib/components/icons/HamburgerIcon.svelte"
	import NavItem from "$lib/components/nav/NavItem.svelte"
	import PositioningRegion from "$lib/components/PositioningRegion.svelte"
	import ContentRegion from "$lib/components/ContentRegion.svelte"

	type Props = {
		onClick?: (ev: MouseEvent) => void
		[prop: string]: any
	}

	let {
		onClick = undefined,
		...restProps
	    }: Props = $props()
</script>

<NavItem
	{...restProps}
	class="expander {restProps.class || ''}"
	{onClick}
>
	<PositioningRegion>
		<ContentRegion>
			<HamburgerIcon />
		</ContentRegion>
	</PositioningRegion>
</NavItem>
