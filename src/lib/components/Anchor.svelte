<script lang="ts">
	import type { SlotType } from "../types/index.js";

	type Props = {
		id?: string;
		class?: string;
		style?: string;
		download?: string;
		href?: string;
		hreflang?: string;
		ping?: string;
		referrerpolicy?: string;
		rel?: string;
		target?: string;
		type?: string;
		appearance?: "neutral" | "accent" | "hypertext" | "stealth" | "transparent";
		iconStart?: SlotType;
		iconEnd?: SlotType;
		children?: SlotType;
		preventDefault?: boolean;
		use?: ((node: HTMLAnchorElement) => any) | undefined;
		onClick?: (event: MouseEvent) => void;
		[prop: string]: any;
	};

	let element: HTMLAnchorElement;

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
	}: Props = $props();

	$effect(() => {
		if (element) {
			use?.(element);
		}
	});

	function handleClick(event: MouseEvent) {
		if (preventDefault) {
			event.preventDefault();
		}
		onClick?.(event);
	}
</script>

<a
	bind:this={element}
	{id}
	class={`${className} ${appearance ? `appearance-${appearance}` : ""}`}
	{style}
	{download}
	{href}
	{hreflang}
	{ping}
	{rel}
	{target}
	{type}
	onclick={handleClick}
	{...restProps}
>
	{#if iconStart}
		<span>
			{@render iconStart?.()}
		</span>
	{/if}

	{#if children}
		{@render children?.()}
	{/if}

	{#if iconEnd}
		<span>
			{@render iconEnd?.()}
		</span>
	{/if}
</a>

<style>
	.appearance-neutral {}
	.appearance-accent {}
	.appearance-hypertext {}
	.appearance-stealth {}
	.appearance-transparent {}
</style>
