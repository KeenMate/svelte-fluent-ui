<script lang="ts">
	import { fluentAnchor, provideFluentDesignSystem } from "@fluentui/web-components"
	import type { SlotType } from "../types/index.js"

	provideFluentDesignSystem().register(fluentAnchor())

	type Props = {
		id?: string
		class?: string
		style?: string
		download?: string
		href?: string
		hreflang?: string
		ping?: string
		referrerpolicy?: string
		rel?: string
		target?: string
		type?: string
		appearance?: "neutral" | "accent" | "hypertext" | "stealth"
		iconStart?: SlotType
		iconEnd?: SlotType
		children?: SlotType
		preventDefault?: boolean
		onClick?: (event: MouseEvent) => void
		[prop: string]: any
	}

	let {
		id = undefined,
		class: className = "",
		style = "",
		download = undefined,
		href = undefined,
		hreflang = undefined,
		ping = undefined,
		referrerpolicy = undefined,
		rel = undefined,
		target = undefined,
		type = undefined,
		appearance = undefined,
		iconStart = undefined,
		iconEnd = undefined,
		children = undefined,
		preventDefault = false,
		onClick = undefined,
		...restProps
	}: Props = $props()

	function handleClick(event: MouseEvent) {
		if (preventDefault) {
			event.preventDefault()
		}
		if (onClick) {
			onClick(event)
		}
	}
</script>

<fluent-anchor
	id={id}
	class={className}
	{style}
	{download}
	{href}
	{hreflang}
	{ping}
	referrerpolicy={referrerpolicy}
	{rel}
	{target}
	{type}
	appearance={appearance}
	on:click={handleClick}
	{...restProps}
>
	{#if iconStart}
		<span slot={children ? "start" : undefined}>
			{@render iconStart?.()}
		</span>
	{/if}

	{#if children}
		{@render children?.()}
	{/if}

	{#if iconEnd}
		<span slot={children ? "end" : undefined}>
			{@render iconEnd?.()}
		</span>
	{/if}
</fluent-anchor>
