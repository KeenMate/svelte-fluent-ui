<script lang="ts">
	import {fluentAccordion, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {FluentAccordionSvelteContext, SlotType} from "../types/index.js"
	import {setContext} from "svelte"

	provideFluentDesignSystem().register(
		fluentAccordion()
	)

	type ValueType = string | string[] | null | undefined

	type Props = {
		value?: ValueType
		multi?: boolean
		children?: SlotType
		[prop: string]: any
	}

	let {
		value = $bindable(),
		multi = undefined,
		children = undefined,
		...restProps
	    }: Props = $props()

	const ctx: FluentAccordionSvelteContext = $state({value: toContextValue(value)})
	setContext("fluent-accordion", ctx)

	$effect(() => {
		ctx.value = toContextValue(value)
	})
	// $effect(() => {
	// 	if ($state.snapshot(internalValue) !== value) {
	// 		internalValue = value
	// 	}
	// })

	function handleAccordionChange(ev: CustomEvent) {
		const accordionItemTarget = (ev.target as HTMLElement)

		if ((ev.target as HTMLElement)?.nodeName !== "FLUENT-ACCORDION-ITEM") {
			return
		}

		// to allow fluent-accordion-item to update HTML attributes that are to be relied upon
		window.requestAnimationFrame(() => {
			const accordionItemId = accordionItemTarget.dataset.customId!
			const accordionItemIsExpanded = accordionItemTarget.attributes["expanded" as unknown as number]?.value === ""
			// console.log("Accordion change", {
			// 	ev,
			// 	accordionItemTarget,
			// 	accordionItemId,
			// 	expandedValue: accordionItemTarget.attributes["expanded" as unknown as number]?.value,
			// 	accordionItemIsExpanded
			// })

			if ((ev.target as HTMLElement)?.nodeName !== "FLUENT-ACCORDION-ITEM") {
				return
			}

			if (multi) {
				let tmp = typeof value === "string"
					? [$state.snapshot(value)]
					: (value?.slice() || [])
				if (accordionItemIsExpanded) {
					tmp.push(accordionItemId)
				} else {
					tmp = tmp.filter(x => x !== accordionItemId)
				}

				setExpanded(tmp)
			} else {
				setExpanded(accordionItemIsExpanded
					? accordionItemId
					: null
				)
			}
		})
	}

	function setExpanded(newValue: ValueType) {
		if (multi && newValue?.length === 0) {
			newValue = null
		}

		value = newValue
		// ctx.value = toContextValue(newValue)
	}

	function toContextValue(value: ValueType): string[] | null | undefined {
		if (multi) {
			return typeof value === "string"
				? [$state.snapshot(value)]
				: $state.snapshot(value)
		} else {
			return typeof value === "string"
				? [value]
				: null
		}
	}
</script>

<fluent-accordion
	expand-mode={multi}
	{...restProps}
	onchange={handleAccordionChange}
>
	{@render children?.()}
</fluent-accordion>

