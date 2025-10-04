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
		[prop: string]: any
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
		...restProps
	    }: Props = $props()

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
		}
	}
</script>

<fluent-dialog
	bind:this={element}
	{...restProps}
	{modal}
	hidden={!visible}
	{trapFocus}
	{ariaDescribedby}
	{ariaLabelledby}
	{ariaLabel}
>
	<div class="dialog-container">
		{#if !preventClose}
			<div class="close-button-wrapper">
				<!-- todo: proper close button -->
				X
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

