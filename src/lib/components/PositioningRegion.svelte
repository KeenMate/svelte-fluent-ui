<script lang="ts">

	import type {SlotType} from "../types/index.js"

	type Props = {
		title?: string
		children?: SlotType
	}

	let {
		title = undefined,
		children = undefined
	    }: Props = $props()
</script>

<div class="positioning-region" {title}>
	{@render children?.()}
</div>
