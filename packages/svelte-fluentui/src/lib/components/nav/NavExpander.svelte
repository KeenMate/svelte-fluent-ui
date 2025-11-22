<script lang="ts">
	import HamburgerIcon from "../icons/HamburgerIcon.svelte"
	import NavItem from "./NavItem.svelte"
	import PositioningRegion from "../PositioningRegion.svelte"
	import ContentRegion from "../ContentRegion.svelte"

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
