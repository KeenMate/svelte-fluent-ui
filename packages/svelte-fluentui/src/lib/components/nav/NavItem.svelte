<script lang="ts">
	import type {SlotType} from "../../types/index.js"

	type Props = {
		disabled?: boolean
		group?: boolean
		onClick?: (ev: MouseEvent) => void
		children?: SlotType
		class?: string
	}

	let {
		    disabled    = undefined,
		    group    = undefined,
		    onClick = undefined,
		    children = undefined,
		    class: className = undefined
	    }: Props = $props()

	// const isInNavGroup = getContext<NavGroupSvelteContext>("nav-group")
</script>

<div
	role="menuitem"
	{disabled}
	class="fluent-nav-item {className || ''}"
	class:fluent-nav-group={group}
	class:disabled
	onclick={onClick}
>
	{@render children?.()}

</div>
