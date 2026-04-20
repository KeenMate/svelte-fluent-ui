<script lang="ts">
	import { getContext, onDestroy, untrack } from "svelte"
	import type { SlotType } from "../types/index.js"
	import { TABS_CONTEXT_KEY, type TabsContext } from "./Tabs.svelte"

	type Props = {
		class?: string
		style?: string
		id: string
		disabled?: boolean
		ariaLabel?: string
		label?: string
		icon?: SlotType
		header?: SlotType
		content?: SlotType
		childContent?: SlotType
		labelEditable?: boolean
		showClose?: boolean
		visible?: boolean
		/** Arbitrary context data passed to `ontabchange` when this tab becomes active. */
		data?: Record<string, unknown>
		oncloseclick?: () => void
	}

	let {
		class: className = "",
		style = "",
		id,
		disabled = false,
		ariaLabel = undefined,
		label = undefined,
		icon = undefined,
		header = undefined,
		content = undefined,
		childContent = undefined,
		labelEditable = false,
		showClose = false,
		visible = true,
		data = undefined,
		oncloseclick = undefined
	}: Props = $props()

	const ctx = getContext<TabsContext | undefined>(TABS_CONTEXT_KEY)

	if (!ctx && typeof console !== "undefined") {
		console.warn("<Tab> must be placed inside a <Tabs> component. Nothing will render.")
	}

	/*
	 * Tab.svelte renders no DOM of its own — it only registers its props
	 * with the parent <Tabs> via context. <Tabs> reads the registered
	 * entries and renders the real tab buttons + panels from them.
	 *
	 * The property reads in the `entry` literal below subscribe this effect
	 * to Tab's props — so when the consumer changes `label`, `disabled`, a
	 * snippet reference, etc., we re-register. The `register()` call itself
	 * is wrapped in `untrack(…)` because Tabs.svelte's register() reads the
	 * `tabs` $state array (to find/update the entry) and then writes to it.
	 * Without untrack, those reads would make this effect subscribe to the
	 * very array register() mutates, causing an immediate effect-update-
	 * depth-exceeded loop (Svelte 5: an effect must not read the state it
	 * writes). untrack prevents the read-side of register from being
	 * tracked, while the prop reads in the object literal above remain
	 * tracked and still drive re-registration on real prop changes.
	 */
	$effect(() => {
		if (!ctx) return
		const entry = {
			id,
			label,
			icon,
			header,
			content,
			childContent,
			disabled,
			ariaLabel,
			labelEditable,
			showClose,
			visible,
			data,
			oncloseclick,
			class: className,
			style
		}
		untrack(() => ctx.register(entry))
	})

	onDestroy(() => {
		if (ctx) untrack(() => ctx.unregister(id))
	})
</script>
