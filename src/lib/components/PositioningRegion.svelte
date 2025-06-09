<script lang="ts">

	import type {SlotType} from "../types/index.js"

	type Props = {
		children?: SlotType
	}

	let {
		children = undefined
	    }: Props = $props()
</script>

<div class="positioning-region">
	{@render children?.()}
</div>
