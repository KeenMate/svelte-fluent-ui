<script lang="ts">
	import type {SlotType} from "../../types/index.js"
	import {AppBarOrientation} from "../../fluent-ui/constants/app-bar.js"
	import {classList} from "../../helpers/html.js"

	type Props = {
		orientation?: AppBarOrientation
		children?: SlotType
		class?: string
	}

	let {
		    orientation = undefined,
		    children    = undefined,
		    class: className = undefined
	    }: Props = $props()

	const computedClasses = $derived(classList(
		"fluent-appbar",
		orientation === AppBarOrientation.Horizontal
			? "horizontal"
			: "vertical",
		className
	))
</script>

<nav
	orientation={orientation || AppBarOrientation.Vertical}
	class={computedClasses}
>
	{@render children?.()}
</nav>
