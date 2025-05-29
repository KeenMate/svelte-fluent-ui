<script lang="ts">
	import type {SlotType} from "../../types/index.js"

	type Props = {
		children?: SlotType
		width?: string
		[prop: string]: any
	}

	let {
		children = undefined,
		width = undefined,
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
