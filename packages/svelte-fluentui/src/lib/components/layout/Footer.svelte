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
</script>

<footer {style} class="fluent-footer {className}">
	{@render children?.()}
</footer>
