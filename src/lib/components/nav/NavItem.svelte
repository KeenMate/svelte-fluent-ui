<script lang="ts">
	import type {SlotType} from "../../types/index.js"

	type Props = {
		children?: SlotType
		group?: boolean
		[prop: string]: any
	}

	let {
		    group    = undefined,
		    children = undefined,
		    ...restProps
	    }: Props = $props()
</script>

<div
	class="fluent-nav-item"
	class:fluent-nav-group={group}
	role="menuitem"
	{...restProps}
>
	{@render children?.()}
</div>
