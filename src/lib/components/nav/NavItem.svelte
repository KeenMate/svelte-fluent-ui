<script lang="ts">
	import type {SlotType} from "../../types/index.js"

	type Props = {
		disabled?: boolean
		group?: boolean
		onClick?: (ev: MouseEvent) => void
		children?: SlotType
		[prop: string]: any
	}

	let {
		    disabled    = undefined,
		    group    = undefined,
		    onClick = undefined,
		    children = undefined,
		    ...restProps
	    }: Props = $props()

	// const isInNavGroup = getContext<NavGroupSvelteContext>("nav-group")
</script>

<div
	role="menuitem"
	{disabled}
	{...restProps}
	class="fluent-nav-item {restProps.class || ''}"
	class:fluent-nav-group={group}
	onclick={onClick}
>
	{@render children?.()}

</div>
