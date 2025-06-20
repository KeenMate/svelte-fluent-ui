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
	<div class="tw:flex tw:flex-col tw:h-full">
		{#if !preventClose}
			<div class="close-button-parent tw:self-end tw:flex-none tw:mt-1 tw:mr-1">
				<!-- todo: proper close button -->
				X
			</div>
		{/if}

		<div class="tw:flex-1">
			{@render children?.()}
		</div>

		{#if dismissable || actions}
			<div class="tw:flex-none tw:flex tw:justify-between tw:flex-wrap gaptw:-2">
				{#if dismissable}
					<div class="close-button-parent tw:flex tw:justify-end tw:flex-none">
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
					<div class="actions tw:flex-1 tw:flex tw:items-baseline tw:gap-1">
						{@render actions()}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</fluent-dialog>

<style lang="postcss">
	@reference "tailwindcss";
</style>

