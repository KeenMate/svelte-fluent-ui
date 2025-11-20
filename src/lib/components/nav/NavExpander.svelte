<script lang="ts">
	import HamburgerIcon from "$lib/components/icons/HamburgerIcon.svelte"
	import NavItem from "$lib/components/nav/NavItem.svelte"
	import PositioningRegion from "$lib/components/PositioningRegion.svelte"
	import ContentRegion from "$lib/components/ContentRegion.svelte"

	type Props = {
		onClick?: (ev: MouseEvent) => void
		class?: string
	}

	let {
		onClick = undefined,
		class: className = undefined
	    }: Props = $props()
</script>

<NavItem
	class="expander {className || ''}"
	{onClick}
>
	<PositioningRegion>
		<ContentRegion>
			<HamburgerIcon />
		</ContentRegion>
	</PositioningRegion>
</NavItem>
