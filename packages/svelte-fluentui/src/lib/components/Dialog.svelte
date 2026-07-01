<script lang="ts" module>
	export type HTMLDialogElement = HTMLElement & {
		show: VoidFunction
		hide: VoidFunction
		toggle: VoidFunction
	}

	/**
	 * Global stack of currently-open Dialog instances. Used so a single
	 * document-level keydown listener can always route Escape to the
	 * topmost open dialog, regardless of where focus lives. The listener
	 * is installed lazily when the first dialog opens and torn down when
	 * the last one closes.
	 */
	type DialogHandle = {
		closeOnEscape: () => boolean
		preventClose: () => boolean
		onbeforeclose: () => boolean | void
		hide: () => void
		/** Enable/disable this instance's FAST focus trap. See {@link syncFocusTrap}. */
		setFocusTrap: (active: boolean) => void
	}
	const openDialogStack: DialogHandle[] = []
	let escListenerAttached = false

	/**
	 * Keep the FAST focus trap active on only the topmost open dialog.
	 *
	 * `<fluent-dialog>` defaults `trapFocus` to true and installs a document-level
	 * `focusin` listener that yanks focus back inside whenever it escapes. With two
	 * dialogs open at once, both listeners fire on every focus change and pull focus
	 * into each other in turn — an infinite ping-pong that overflows the call stack
	 * (`RangeError`). Releasing the trap on every dialog beneath the top lets the
	 * topmost one own focus uncontested; closing it re-traps the new top.
	 */
	function syncFocusTrap() {
		for (let i = 0; i < openDialogStack.length; i++) {
			openDialogStack[i].setFocusTrap(i === openDialogStack.length - 1)
		}
	}

	function handleGlobalEscape(e: KeyboardEvent) {
		if (e.key !== "Escape") return
		const top = openDialogStack[openDialogStack.length - 1]
		if (!top) return
		if (top.preventClose()) return
		if (!top.closeOnEscape()) return
		const beforeClose = top.onbeforeclose
		if (beforeClose && beforeClose() === false) return
		e.preventDefault()
		e.stopPropagation()
		top.hide()
	}

	function pushDialog(handle: DialogHandle) {
		openDialogStack.push(handle)
		if (!escListenerAttached && typeof document !== "undefined") {
			document.addEventListener("keydown", handleGlobalEscape, true)
			escListenerAttached = true
		}
		syncFocusTrap()
	}

	function popDialog(handle: DialogHandle) {
		const idx = openDialogStack.lastIndexOf(handle)
		if (idx >= 0) openDialogStack.splice(idx, 1)
		if (openDialogStack.length === 0 && escListenerAttached && typeof document !== "undefined") {
			document.removeEventListener("keydown", handleGlobalEscape, true)
			escListenerAttached = false
		}
		syncFocusTrap()
	}

	/**
	 * Body scroll lock for modal dialogs. Without this, scrolling while the
	 * pointer is over a non-scrollable part of the dialog (header, tab strip,
	 * gaps) chains up to the document and scrolls the page behind the modal.
	 *
	 * Reference-counted so stacked/nested modals only release the lock once the
	 * last one closes. The original inline `overflow` / `paddingRight` are saved
	 * on lock and restored on unlock; padding compensates for the disappearing
	 * scrollbar so the page doesn't shift sideways when the lock engages.
	 */
	let scrollLockCount = 0
	let savedBodyOverflow = ""
	let savedBodyPaddingRight = ""

	function lockBodyScroll() {
		if (typeof document === "undefined") return
		if (scrollLockCount === 0) {
			const body = document.body
			savedBodyOverflow = body.style.overflow
			savedBodyPaddingRight = body.style.paddingRight
			const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
			if (scrollbarWidth > 0) {
				const current = parseFloat(window.getComputedStyle(body).paddingRight) || 0
				body.style.paddingRight = `${current + scrollbarWidth}px`
			}
			body.style.overflow = "hidden"
		}
		scrollLockCount++
	}

	function unlockBodyScroll() {
		if (typeof document === "undefined") return
		if (scrollLockCount === 0) return
		scrollLockCount--
		if (scrollLockCount === 0) {
			document.body.style.overflow = savedBodyOverflow
			document.body.style.paddingRight = savedBodyPaddingRight
		}
	}
</script>

<script lang="ts">
	import {onDestroy} from "svelte"
	import {fluentDialog, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"
	import Button from "./Button.svelte"
	import {portal} from "../actions/portal.js"

	provideFluentDesignSystem().register(
		fluentDialog()
	)

	export type DialogAction = {
		label: string
		appearance?: "accent" | "neutral" | "outline" | "stealth" | "lightweight"
		disabled?: boolean
		/** Return `false` to prevent the dialog from closing after the click. */
		onClick?: () => boolean | void | Promise<boolean | void>
	}

	type Props = {
		modal?: boolean
		visible?: boolean
		preventClose?: boolean
		dismissable?: boolean
		trapFocus?: boolean
		ariaDescribedby?: string
		ariaLabelledby?: string
		ariaLabel?: string
		/** Title text shown in the header row (left side). Ignored when `header` snippet is provided. */
		title?: string
		/** Fully custom header content (replaces the default title + close button row). */
		header?: SlotType
		/** Default slot — body content. */
		children?: SlotType
		/** Fully custom footer content (replaces primary/secondary action buttons and the legacy `actions` slot). */
		footer?: SlotType
		/** Convenience action — renders as a styled button (default `appearance="accent"`) on the right side of the footer. */
		primaryAction?: DialogAction
		/** Convenience action — renders as a styled button (default `appearance="neutral"`) next to the primary action. */
		secondaryAction?: DialogAction
		actions?: SlotType
		dismissButtonText?: SlotType
		onClose?: () => void
		onbeforeclose?: () => boolean | void
		closeOnEscape?: boolean
		size?: "small" | "medium" | "large" | "extra-large" | "full"
		width?: string
		height?: string
		style?: string
	}

	let {
		    modal = undefined,
		    visible = $bindable(undefined),
		    trapFocus = undefined,
		    ariaDescribedby = undefined,
		    ariaLabelledby = undefined,
		    ariaLabel = undefined,
		    preventClose = false,
		    dismissable = false,
		    title = undefined,
		    header = undefined,
		    children = undefined,
		    footer = undefined,
		    primaryAction = undefined,
		    secondaryAction = undefined,
		    actions = undefined,
		    dismissButtonText = undefined,
		    onClose = undefined,
		    onbeforeclose = undefined,
		    closeOnEscape = true,
		    size = "medium",
		    width = undefined,
		    height = undefined,
		    style = undefined
	    }: Props = $props()

	// Size mappings
	const sizeMap = {
		"small": { width: "400px", height: "auto" },
		"medium": { width: "600px", height: "auto" },
		"large": { width: "800px", height: "auto" },
		"extra-large": { width: "1000px", height: "auto" },
		"full": { width: "90vw", height: "90vh" }
	}

	const dialogWidth = $derived(width || sizeMap[size].width)
	const dialogHeight = $derived(height || sizeMap[size].height)
	const dialogStyle = $derived(`--dialog-width: ${dialogWidth}; --dialog-height: ${dialogHeight};`)

	let element: HTMLElement & {
		show: Function
		hide: Function
	} | undefined = undefined

	export function show() {
		if (!element) {
			return
		}

		visible = true
		element.show()
	}

	export function hide() {
		if (!element) {
			return
		}

		visible = false
		element.hide()
		onClose?.()
	}

	export function toggle() {
		if (!element) {
			return
		}

		visible = !visible
		if (visible) {
			element.show()
		} else {
			element.hide()
			onClose?.()
		}
	}

	function handleClose() {
		if (onbeforeclose && onbeforeclose() === false) {
			return
		}
		hide()
	}

	// Wire this instance into the global Escape stack while visible. Listener
	// lives on `document` so Esc works regardless of where focus is.
	const handle: DialogHandle = {
		closeOnEscape: () => closeOnEscape,
		preventClose: () => preventClose,
		onbeforeclose: () => onbeforeclose?.(),
		hide,
		// Topmost dialog keeps the trap; the rest release it. We never re-enable a
		// trap the author explicitly disabled (trapFocus={false}).
		//
		// Setting the `trapFocus` *property* alone is not enough: FAST's
		// `trapFocusChanged` reflection does not reliably tear down the document
		// `focusin` listener, so a released dialog keeps trapping (isTrappingFocus
		// stays true) and two live traps ping-pong focus into a stack overflow.
		// Calling the internal `updateTrapFocus(shouldTrap)` forces the listener
		// on/off immediately; we still set the property to keep FAST's own
		// `shouldTrapFocus()` coherent for any later internal recompute.
		setFocusTrap: (active: boolean) => {
			if (!element) return
			const fast = element as unknown as {
				trapFocus: boolean
				updateTrapFocus?: (shouldTrapFocusOverride?: boolean) => void
			}
			const shouldTrap = active && trapFocus !== false
			fast.trapFocus = shouldTrap
			fast.updateTrapFocus?.(shouldTrap)
		}
	}
	$effect(() => {
		if (visible) {
			pushDialog(handle)
			return () => popDialog(handle)
		}
	})

	// Lock the page scroll while a *modal* dialog is open so wheel events over
	// the dialog don't chain to the document. Non-modal dialogs leave the page
	// scrollable on purpose.
	$effect(() => {
		if (visible && modal) {
			lockBodyScroll()
			return () => unlockBodyScroll()
		}
	})

	onDestroy(() => popDialog(handle))

	async function runAction(action: DialogAction) {
		const result = await action.onClick?.()
		if (result !== false) {
			hide()
		}
	}

	const hasFooterContent = $derived(
		!!footer || !!actions || dismissable || !!primaryAction || !!secondaryAction
	)
	// A dedicated header row is rendered only when there's an actual title or custom
	// header snippet — otherwise the close X floats in the top-right corner so legacy
	// dialogs that put their own heading in the body don't get an empty strip on top.
	const hasHeaderRow = $derived(!!header || !!title)
	const showFloatingClose = $derived(!hasHeaderRow && !preventClose)
</script>

{#if visible}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div use:portal class="dialog-overlay" onclick={!preventClose ? handleClose : undefined}></div>
{/if}

<fluent-dialog
	use:portal
	bind:this={element}
	{...(modal ? { modal } : {})}
	hidden={!visible}
	{...(trapFocus ? { trapFocus } : {})}
	{...(ariaDescribedby ? { ariaDescribedby } : {})}
	{...(ariaLabelledby ? { ariaLabelledby } : {})}
	{...(ariaLabel ? { ariaLabel } : {})}
	class="dialog-positioned"
	style={dialogStyle + (style ? ` ${style}` : '')}
>
	<div class="dialog-container">
		{#if hasHeaderRow}
			<div class="dialog-header">
				{#if header}
					{@render header()}
				{:else}
					<div class="dialog-title">{title}</div>
					{#if !preventClose}
						<Button appearance="stealth" onclick={handleClose} aria-label="Close dialog">
							<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
								<path d="M2.09 2.22a.75.75 0 0 1 1.06-.13L6 4.94l2.85-2.85a.75.75 0 1 1 1.06 1.06L7.06 6l2.85 2.85a.75.75 0 1 1-1.06 1.06L6 7.06l-2.85 2.85a.75.75 0 0 1-1.06-1.06L4.94 6 2.09 3.15a.75.75 0 0 1-.13-1.06z"/>
							</svg>
						</Button>
					{/if}
				{/if}
			</div>
		{:else if showFloatingClose}
			<button
				type="button"
				class="dialog-close-floating"
				onclick={handleClose}
				aria-label="Close dialog"
			>
				<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
					<path d="M2.09 2.22a.75.75 0 0 1 1.06-.13L6 4.94l2.85-2.85a.75.75 0 1 1 1.06 1.06L7.06 6l2.85 2.85a.75.75 0 1 1-1.06 1.06L6 7.06l-2.85 2.85a.75.75 0 0 1-1.06-1.06L4.94 6 2.09 3.15a.75.75 0 0 1-.13-1.06z"/>
				</svg>
			</button>
		{/if}

		<div class="dialog-content">
			{@render children?.()}
		</div>

		{#if hasFooterContent}
			<div class="dialog-footer">
				{#if footer}
					{@render footer()}
				{:else}
					{#if actions}
						<div class="dialog-actions">
							{@render actions()}
						</div>
					{/if}
					{#if dismissable}
						<Button onclick={hide}>
							{#if dismissButtonText}
								{@render dismissButtonText()}
							{:else}
								Dismiss
							{/if}
						</Button>
					{/if}
					{#if primaryAction}
						<Button
							appearance={primaryAction.appearance ?? "accent"}
							disabled={primaryAction.disabled}
							onclick={() => runAction(primaryAction)}
						>
							{primaryAction.label}
						</Button>
					{/if}
					{#if secondaryAction}
						<Button
							appearance={secondaryAction.appearance ?? "neutral"}
							disabled={secondaryAction.disabled}
							onclick={() => runAction(secondaryAction)}
						>
							{secondaryAction.label}
						</Button>
					{/if}
				{/if}
			</div>
		{/if}
	</div>
</fluent-dialog>

<style>
	.dialog-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: var(--fluent-z-modal-backdrop, 1040);
	}

	.dialog-positioned {
		position: fixed;
		z-index: var(--fluent-z-modal, 1050);
	}

	fluent-dialog::part(control) {
		padding: 1rem;
	}

	.dialog-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		gap: 1rem;
		position: relative;
	}

	.dialog-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		flex: none;
	}

	.dialog-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--neutral-foreground-rest);
		flex: 1;
		min-width: 0;
	}

	/* Used when no title/header is provided — keeps legacy "X in the corner" look. */
	.dialog-close-floating {
		position: absolute;
		top: 0;
		right: 0;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		color: var(--neutral-foreground-rest);
		border-radius: var(--fluent-border-radius-md);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.dialog-close-floating:hover {
		background: var(--neutral-fill-stealth-hover, rgba(0, 0, 0, 0.05));
	}

	.dialog-content {
		flex: 1;
		min-height: 0;
	}

	.dialog-footer {
		flex: none;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.dialog-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>

