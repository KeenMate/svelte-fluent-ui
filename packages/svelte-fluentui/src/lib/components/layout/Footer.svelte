<script lang="ts">
	import type {SlotType} from "../../types/index.js"

	type Props = {
		start?: SlotType
		center?: SlotType
		end?: SlotType
		children?: SlotType
		/** Stack to a single column below 600px container width. Only applies in 3-part mode. */
		stack?: boolean
		class?: string
		style?: string
	}

	let {
		start = undefined,
		center = undefined,
		end = undefined,
		children = undefined,
		stack = true,
		class: className = "",
		style = ""
	}: Props = $props()

	const hasThreeParts = $derived(!!start || !!center || !!end)
</script>

<footer
	{style}
	class="fluent-footer {className}"
	class:fluent-footer--three-part={hasThreeParts}
	class:fluent-footer--stacks={hasThreeParts && stack}
>
	{#if hasThreeParts}
		{#if start}
			<div class="fluent-footer__start">{@render start()}</div>
		{/if}
		{#if center}
			<div class="fluent-footer__center">{@render center()}</div>
		{/if}
		{#if end}
			<div class="fluent-footer__end">{@render end()}</div>
		{/if}
	{:else}
		{@render children?.()}
	{/if}
</footer>
