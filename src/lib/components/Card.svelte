<script lang="ts">
	import type {SlotType} from "../types/index.js"
	import {fluentCard, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentCard()
	)

	type Props = {
		width?: string | number
		height?: string | number
		areaRestricted?: boolean
		class?: string
		style?: string
		minimalStyle?: boolean
		children?: SlotType
		[prop: string]: any
	}

	let {
		    width             = undefined,
		    height            = undefined,
		    areaRestricted    = undefined,
		    class: classParam = undefined,
		    style: styleParam = undefined,
		    minimalStyle      = undefined,
		    children          = undefined,
		    ...restProps
	    }: Props = $props()

	const styles = $derived(
		[
			styleParam,
			width && `--card-width: ${width}${typeof width === "number" ? "px" : ""}`,
			height && `--card-height: ${height}${typeof height === "number" ? "px" : ""}`
		]
			.filter(x => x)
			.join("; ")
	)
	const classes = $derived(
		[
			classParam,
			minimalStyle && "fluent-card-minimal-style"
		]
			.filter(x => x)
			.join(" ")
	)

	$inspect("class and style", {styles, classes})
</script>

<fluent-card
	{...restProps}
	class={classes}
	class:area-restricted={areaRestricted}
	style={styles}
>
	{@render children?.()}
</fluent-card>
