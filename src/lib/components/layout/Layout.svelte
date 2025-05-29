<script lang="ts">
	import type {SlotType} from "../../types/index.js"

	type Props = {
		children?: SlotType
		[prop: string]: any
	}

	let {
		    children = undefined,
		    ...restProps
	    }: Props = $props()
</script>

<div
	{...restProps}
	class="layout {restProps?.class || ''}"
>
	{@render children?.()}
</div>
