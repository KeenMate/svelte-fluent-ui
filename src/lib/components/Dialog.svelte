<script lang="ts">
	import {fluentDialog, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types.js"
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
</script>

<fluent-dialog
	bind:this={element}
	{modal}
	hidden={!visible}
	{trapFocus}
	{ariaDescribedby}
	{ariaLabelledby}
	{ariaLabel}
>
	<div class="flex flex-col h-full">
		{#if !preventClose}
			<div class="close-button-parent self-start flex-none">
				TODO close button
			</div>
		{/if}

		<div class="flex-1">
			{@render children?.()}
		</div>

		{#if dismissable || actions}
			<div class="flex-none flex justify-between flex-wrap gap-2">
				{#if dismissable}
					<div class="close-button-parent flex justify-end flex-none">
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
					<div class="actions flex-1 flex items-baseline gap-1">
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

