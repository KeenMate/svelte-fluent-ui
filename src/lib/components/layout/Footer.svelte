<script lang="ts">
	import type {SlotType} from "../../types/index.js"

	type Props = {
		children?: SlotType
		class?: string
		style?: string
	}

	let {
		children = undefined,
		class: className = "",
		style = ""
	}: Props = $props()

	let element: HTMLElement | undefined = $state()
</script>

<footer bind:this={element}  {style} class="footer {className}">
	{@render children?.()}
</footer>
