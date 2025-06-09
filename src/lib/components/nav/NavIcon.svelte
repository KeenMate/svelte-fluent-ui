<script lang="ts">
	import type {SlotType} from "../../types/index.js"

	type Props = {
		children?: SlotType
	}

	let {
		children = undefined
	    }: Props = $props()
</script>

<span class="fluent-nav-icon" style="min-width: 20px">
	{@render children?.()}
</span>
