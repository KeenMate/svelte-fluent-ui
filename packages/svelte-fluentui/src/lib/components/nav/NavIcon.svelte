<script lang="ts">
	import type {SlotType} from "../../types/index.js"

	type Props = {
		children?: SlotType
	}

	let {
		children = undefined
	    }: Props = $props()
</script>

<span class="fluent-nav-icon">
	{@render children?.()}
</span>

<style>
	.fluent-nav-icon {
		min-width: 20px;
	}
</style>
