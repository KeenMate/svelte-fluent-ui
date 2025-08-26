<script lang="ts">
	import {fluentAnchor, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"
	import useActions from "$lib/actions/use-actions.js"

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
		appearance?: "neutral" | "accent" | "hypertext" | "stealth" | "transparent"
		iconStart?: SlotType
		iconEnd?: SlotType
		children?: SlotType
		preventDefault?: boolean
		use?: ((node: HTMLElement) => any) | undefined
		onClick?: (event: MouseEvent) => void
		[prop: string]: any
	}

	let element: HTMLElement

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
		use = undefined,
		onClick = undefined,
		...restProps
	}: Props = $props()

	$effect(() => {
		const a = element.shadowRoot?.querySelector("a")
		if (a) use?.(a)
	})

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
	bind:this={element}
	{id}
	class={className}
	{style}
	{download}
	{href}
	{hreflang}
	{ping}
	{referrerpolicy}
	{rel}
	{target}
	{type}
	{appearance}
	onclick={handleClick}
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