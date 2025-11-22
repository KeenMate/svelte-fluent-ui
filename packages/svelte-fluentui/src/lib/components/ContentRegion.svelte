<script lang="ts">

	import type {SlotType} from "../types/index.js"

	type Props = {
		children?: SlotType
	}

	let {
		    children = undefined
	    }: Props = $props()
</script>

<div class="content-region">
	{@render children?.()}
</div>
