<script lang="ts">
	import type {SlotType} from "../../types/index.js"

	type Props = {
		children?: SlotType
		class?: string
		style?: string
		[prop: string]: any
	}

	let {
		children = undefined,
		class: className = "",
		style = "",
		...restProps
	}: Props = $props()

	let element: HTMLElement | undefined = $state()
</script>

<footer bind:this={element} {...restProps} {style} class="footer {className}">
	{@render children?.()}
</footer>
