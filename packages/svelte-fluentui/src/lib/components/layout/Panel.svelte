<script lang="ts" module>
	type PanelHandle = {
		closeOnEscape: () => boolean
		hide: () => void
	}
	const openPanelStack: PanelHandle[] = []
	let escListenerAttached = false

	function handleGlobalEscape(e: KeyboardEvent) {
		if (e.key !== "Escape") return
		const top = openPanelStack[openPanelStack.length - 1]
		if (!top) return
		if (!top.closeOnEscape()) return
		e.preventDefault()
		e.stopPropagation()
		top.hide()
	}

	function pushPanel(handle: PanelHandle) {
		openPanelStack.push(handle)
		if (!escListenerAttached && typeof document !== "undefined") {
			document.addEventListener("keydown", handleGlobalEscape, true)
			escListenerAttached = true
		}
	}

	function popPanel(handle: PanelHandle) {
		const idx = openPanelStack.lastIndexOf(handle)
		if (idx >= 0) openPanelStack.splice(idx, 1)
		if (openPanelStack.length === 0 && escListenerAttached && typeof document !== "undefined") {
			document.removeEventListener("keydown", handleGlobalEscape, true)
			escListenerAttached = false
		}
	}
</script>

<script lang="ts">
	import {onDestroy} from "svelte"
	import type {SlotType} from "../../types/index.js"

	type Side = "left" | "right" | "start" | "end"

	type Props = {
		open?: boolean
		side?: Side
		width?: string
		overlay?: boolean
		closeOnOutsideClick?: boolean
		closeOnEscape?: boolean
		onclose?: () => void
		children?: SlotType
		class?: string
		style?: string
	}

	let {
		open = $bindable(false),
		side = "right",
		width = "320px",
		overlay = true,
		closeOnOutsideClick = true,
		closeOnEscape = true,
		onclose = undefined,
		children = undefined,
		class: className = undefined,
		style = undefined
	}: Props = $props()

	let panelEl: HTMLElement | undefined = $state()
	let isRTL = $state(false)

	const handle: PanelHandle = {
		closeOnEscape: () => closeOnEscape,
		hide: () => close()
	}

	let wasOpen = false
	$effect(() => {
		if (open && !wasOpen) {
			pushPanel(handle)
			wasOpen = true
		} else if (!open && wasOpen) {
			popPanel(handle)
			wasOpen = false
		}
	})

	// Document-level outside-click detection — only needed when there's no
	// overlay to catch the click. Deferred to the next task so the same click
	// that opened the panel doesn't immediately close it.
	$effect(() => {
		if (!open || overlay || !closeOnOutsideClick) return
		const id = setTimeout(() => {
			document.addEventListener("pointerdown", handleOutsideClick, true)
		}, 0)
		return () => {
			clearTimeout(id)
			document.removeEventListener("pointerdown", handleOutsideClick, true)
		}
	})

	function handleOutsideClick(e: PointerEvent) {
		if (!panelEl) return
		if (panelEl.contains(e.target as Node)) return
		close()
	}

	onDestroy(() => {
		if (wasOpen) popPanel(handle)
	})

	function close() {
		open = false
		onclose?.()
	}

	function onOverlayClick() {
		if (closeOnOutsideClick) close()
	}

	// Combined: capture the original parent's direction BEFORE moving the node
	// under <body>. Doing both in one action avoids relying on Svelte's
	// multi-action source-order. We set `dir="rtl"` (so `inset-inline-*`
	// resolves correctly) AND flip an isRTL flag (so a class-based selector can
	// drive the rest of the styling without depending on attribute matching).
	function setupRoot(node: HTMLElement) {
		const parent = node.parentElement
		if (parent && getComputedStyle(parent).direction === "rtl") {
			node.setAttribute("dir", "rtl")
			isRTL = true
		}
		document.body.appendChild(node)
		return {
			destroy() {
				node.parentNode?.removeChild(node)
			}
		}
	}
</script>

<div
	class="fluent-panel-root fluent-panel-root--{side} {className || ''}"
	class:fluent-panel-root--open={open}
	class:fluent-panel-root--rtl={isRTL}
	aria-hidden={!open}
	use:setupRoot
>
	{#if overlay}
		<div
			class="fluent-panel-overlay"
			role="button"
			tabindex={-1}
			aria-label="Close panel"
			onclick={onOverlayClick}
			onkeydown={(e) => (e.key === "Enter" || e.key === " ") && onOverlayClick()}
		></div>
	{/if}

	<div
		bind:this={panelEl}
		class="fluent-panel"
		role="dialog"
		aria-modal={overlay}
		style="width: {width}; {style || ''}"
	>
		{@render children?.()}
	</div>
</div>

<style lang="scss">
	.fluent-panel-root {
		position: fixed;
		inset: 0;
		z-index: var(--fluent-z-modal, 1050);
		// Never block the page — only the overlay and the panel surface
		// (re-enabled below) capture pointer events.
		pointer-events: none;
	}

	.fluent-panel-overlay {
		position: absolute;
		inset: 0;
		background-color: rgba(0, 0, 0, 0);
		cursor: pointer;
		pointer-events: none;
		transition: background-color 0.25s ease;
		z-index: var(--fluent-z-modal-backdrop, 1040);
	}

	.fluent-panel {
		position: absolute;
		top: 0;
		height: 100vh;
		max-width: 90vw;
		background-color: var(--neutral-layer-1, #ffffff);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		pointer-events: none;
		transition: transform 0.25s ease, visibility 0.25s ease;
		visibility: hidden;
		z-index: calc(var(--fluent-z-modal, 1050) + 1);
	}

	// Closed-state per-side transforms — declared BEFORE the --open rule so
	// the open rule wins on source order at equal specificity.

	// Physical sides — never flip with direction.
	.fluent-panel-root--right .fluent-panel {
		right: 0;
		box-shadow: -4px 0 16px rgba(0, 0, 0, 0.15);
		transform: translateX(100%);
	}

	.fluent-panel-root--left .fluent-panel {
		left: 0;
		box-shadow: 4px 0 16px rgba(0, 0, 0, 0.15);
		transform: translateX(-100%);
	}

	// Logical sides — follow the writing direction (start = left in LTR, right in RTL).
	.fluent-panel-root--start .fluent-panel {
		inset-inline-start: 0;
		box-shadow: 4px 0 16px rgba(0, 0, 0, 0.15);
		transform: translateX(-100%);
	}

	.fluent-panel-root--start.fluent-panel-root--rtl .fluent-panel {
		inset-inline-start: unset;
		right: 0;
		box-shadow: -4px 0 16px rgba(0, 0, 0, 0.15);
		transform: translateX(100%);
	}

	.fluent-panel-root--end .fluent-panel {
		inset-inline-end: 0;
		box-shadow: -4px 0 16px rgba(0, 0, 0, 0.15);
		transform: translateX(100%);
	}

	.fluent-panel-root--end.fluent-panel-root--rtl .fluent-panel {
		inset-inline-end: unset;
		left: 0;
		box-shadow: 4px 0 16px rgba(0, 0, 0, 0.15);
		transform: translateX(-100%);
	}

	.fluent-panel-root--open .fluent-panel-overlay {
		background-color: rgba(0, 0, 0, 0.3);
		pointer-events: auto;
	}

	// Match the (0,3,0) specificity of the RTL side overrides so the open
	// transform wins on source order (this rule is last).
	.fluent-panel-root.fluent-panel-root--open .fluent-panel {
		transform: translateX(0);
		visibility: visible;
		pointer-events: auto;
	}
</style>
