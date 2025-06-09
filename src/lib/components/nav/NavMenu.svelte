<script lang="ts">
	import type {SlotType} from "../../types/index.js"

	type Props = {
		width?: string
		children?: SlotType
		[prop: string]: any
	}

	let {
		width = undefined,
		children = undefined,
		...restProps
	    }: Props = $props()
</script>

<div
	class="fluent-nav-menu"
	role="menu"
	{...restProps}
	style:width={width || "250px"}
>
	{@render children?.()}
</div>
