<script lang="ts">
	import type {SlotType} from "../types/index.js"
	import {fluentCard, provideFluentDesignSystem} from "@fluentui/web-components"
	import {classList, styleList} from "../helpers/html.js"

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

	const styles  = $derived(styleList(
		styleParam,
		width && `--card-width: ${width}${typeof width === "number" ? "px" : ""}`,
		height && `--card-height: ${height}${typeof height === "number" ? "px" : ""}`
	))
	const classes = $derived(classList(
			classParam,
			minimalStyle && "fluent-card-minimal-style"
		))

	$inspect("class and style", {styles, classes})
</script>

<fluent-card
	{...restProps} class={classes} class:area-restricted={areaRestricted} style={styles}
>
	{@render children?.()}
</fluent-card>
