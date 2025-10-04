<script lang="ts">
	import type {SlotType} from "../../types/index.js"

	type Orientation = "horizontal" | "vertical"

	type Props = {
		children?: SlotType
		orientation?: Orientation
		class?: string
		style?: string
		[prop: string]: any
	}

	let {
		children = undefined,
		orientation = "vertical",
		class: className = "",
		style = "",
		...restProps
	}: Props = $props()

	let element: HTMLElement | undefined = $state()
</script>

<div
	bind:this={element}
	{...restProps}
	{style}
	class="layout {className}"
	data-orientation={orientation === "horizontal" ? "horizontal" : null}
>
	{@render children?.()}
</div>
