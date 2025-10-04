<script lang="ts">
	import type {SlotType} from "../../types/index.js"

	type Props = {
		children?: SlotType
		height?: number
		class?: string
		style?: string
		[prop: string]: any
	}

	let {
		children = undefined,
		height = 50,
		class: className = "",
		style = "",
		...restProps
	}: Props = $props()

	let element: HTMLElement | undefined = $state()

	let computedStyle = $derived(
		[height != null && `height: ${height}px;`, style].filter(Boolean).join(" ")
	)
</script>

<header
	bind:this={element}
	{...restProps}
	style={computedStyle}
	class="header {className}"
>
	<div class="header-gutters">
		{@render children?.()}
	</div>
</header>
