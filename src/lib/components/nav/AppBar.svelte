<script lang="ts">
	import type {SlotType} from "../../types/index.js"
	import {AppBarOrientation} from "../../fluent-ui/constants/app-bar.js"
	import {classList} from "../../helpers/html.js"

	type Props = {
		orientation?: AppBarOrientation
		children?: SlotType
		[prop: string]: any
	}

	let {
		    orientation = undefined,
		    children    = undefined,
		    ...restProps
	    }: Props = $props()

	const computedClasses = $derived(classList(
		"fluent-appbar",
		orientation === AppBarOrientation.Horizontal
			? "horizontal"
			: "vertical",
		restProps.class
	))
</script>

<nav
	orientation={orientation || AppBarOrientation.Vertical}
	{...restProps}
	class={computedClasses}
>
	{@render children?.()}
</nav>
