<script lang="ts">
	import {fluentAccordionItem, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {FluentAccordionSvelteContext, SlotType} from "../types/index.js"
	import {getContext} from "svelte"

	provideFluentDesignSystem().register(
		fluentAccordionItem()
	)

	type Props = {
		id: string
		headingLevel?: string | number
		header?: string
		expanded?: boolean
		heading?: SlotType
		start?: SlotType
		end?: SlotType
		icon?: SlotType
		children?: SlotType
		onchange?: (ev: Event, isExpanded: boolean) => void
	}

	let {
		    id,
		    headingLevel = undefined,
		    expanded     = undefined,
		    header       = undefined,
		    heading      = undefined,
		    start        = undefined,
		    end          = undefined,
		    icon         = undefined,
		    children     = undefined,
		    onchange     = undefined
	    }: Props = $props()

	const ctx = getContext<FluentAccordionSvelteContext>("fluent-accordion")

	$inspect(id, expanded, ctx.value)

	function handleOnChange(ev: Event) {
		// console.log("Accordion item change", ev)
		const target = ev.target as HTMLElement

		onchange?.(ev, target.getAttribute("expanded") === "")
	}
</script>

<!-- todo: investigate flicker during switching of accordions -->
<fluent-accordion-item
	{id}
	data-custom-id={id}
	heading-level={headingLevel}
	expanded={expanded === undefined && ctx.value !== undefined ? !!ctx.value?.includes(id) : expanded}
	onchange={handleOnChange}
>
	<div slot="heading">
		{#if heading}
			{@render heading()}
		{:else}
			{header}
		{/if}
	</div>

	{#if start}
		<div slot="start">
			{@render start()}
		</div>
	{/if}
	{#if end}
		<div slot="end">
			{@render end()}
		</div>
	{/if}
	{#if icon}
		<div slot="expanded-icon">
			{@render icon(true)}
		</div>
		<div slot="collapsed-icon">
			{@render icon(false)}
		</div>
	{/if}

	{@render children?.()}
</fluent-accordion-item>

