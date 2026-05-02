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

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
<div
	role="menuitem"
	tabindex="0"
	aria-disabled={disabled}
	class="fluent-nav-item {className || ''}"
	class:fluent-nav-group={group}
	class:disabled
	onclick={onClick}
>
	{@render children?.()}

</div>
