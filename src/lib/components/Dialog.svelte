<script lang="ts" module>
	export type HTMLDialogElement = HTMLElement & {
		show: VoidFunction
		hide: VoidFunction
		toggle: VoidFunction
	}
</script>

<script lang="ts">
	import {fluentDialog, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"
	import Button from "$lib/components/Button.svelte"

	provideFluentDesignSystem().register(
		fluentDialog()
	)

	type Props = {
		modal?: boolean
		visible?: boolean
		preventClose?: boolean
		dismissable?: boolean
		trapFocus?: boolean
		ariaDescribedby?: string
		ariaLabelledby?: string
		ariaLabel?: string
		children?: SlotType
		actions?: SlotType
		dismissButtonText?: SlotType
		onClose?: () => void
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
		    children = undefined,
		    actions = undefined,
		    dismissButtonText = undefined,
		    onClose = undefined,
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

	const dialogWidth = width || sizeMap[size].width
	const dialogHeight = height || sizeMap[size].height
	const dialogStyle = `--dialog-width: ${dialogWidth}; --dialog-height: ${dialogHeight};`

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
		hide()
	}
</script>

<fluent-dialog
	bind:this={element}
	{modal}
	hidden={!visible}
	{trapFocus}
	{ariaDescribedby}
	{ariaLabelledby}
	{ariaLabel}
	style={dialogStyle + (style ? ` ${style}` : '')}
>
	<div class="dialog-container">
		{#if !preventClose}
			<div class="close-button-wrapper">
				<Button appearance="stealth" onClick={handleClose} aria-label="Close dialog">
					<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
						<path d="M2.09 2.22a.75.75 0 0 1 1.06-.13L6 4.94l2.85-2.85a.75.75 0 1 1 1.06 1.06L7.06 6l2.85 2.85a.75.75 0 1 1-1.06 1.06L6 7.06l-2.85 2.85a.75.75 0 0 1-1.06-1.06L4.94 6 2.09 3.15a.75.75 0 0 1-.13-1.06z"/>
					</svg>
				</Button>
			</div>
		{/if}

		<div class="dialog-content">
			{@render children?.()}
		</div>

		{#if dismissable || actions}
			<div class="dialog-footer">
				{#if dismissable}
					<div class="dismiss-button-wrapper">
						<Button onClick={hide}>
							{#if dismissButtonText}
								{@render dismissButtonText()}
							{:else}
								Dismiss
							{/if}
						</Button>
					</div>
				{/if}
				{#if actions}
					<div class="dialog-actions">
						{@render actions()}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</fluent-dialog>

<style>
	.dialog-container {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.close-button-wrapper {
		align-self: flex-end;
		flex: none;
		margin-top: 0.25rem;
		margin-right: 0.25rem;
	}

	.dialog-content {
		flex: 1;
	}

	.dialog-footer {
		flex: none;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.dismiss-button-wrapper {
		display: flex;
		justify-content: flex-end;
		flex: none;
	}

	.dialog-actions {
		flex: 1;
		display: flex;
		align-items: baseline;
		gap: 0.25rem;
	}
</style>

