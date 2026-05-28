<!--
 * InputFile — minimal selector
 * Internal sub-component used by InputFile.svelte. Renders a compact icon
 * button with an item-count badge. The badge colour reflects the aggregate
 * upload status (pending, uploading, completed, error) so the consumer can
 * tell at a glance whether attention is needed without expanding the picker.
 * Not exported from the package barrel.
-->

<script lang="ts">
	import type {InputFileStatus} from "./InputFile.types.js"

	type Props = {
		disabled?: boolean
		itemsLength: number
		// `undefined` means "no popover association" — the button doesn't expose
		// aria-expanded at all (so screen readers don't announce a missing
		// disclosure). `true`/`false` means the button controls a popover.
		popoverExpanded?: boolean | undefined
		ariaLabel: string
		title: string
		badgeStatus: InputFileStatus
		onclick: (e: MouseEvent) => void
	}

	let {
		disabled = false,
		itemsLength,
		popoverExpanded = undefined,
		ariaLabel,
		title,
		badgeStatus,
		onclick
	}: Props = $props()
</script>

<button
	type="button"
	class="minimal-trigger"
	{onclick}
	{disabled}
	aria-label={ariaLabel}
	aria-expanded={popoverExpanded}
	{title}
>
	<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
		<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm0 7V3.5L19.5 9H14z" />
	</svg>
	{#if itemsLength > 0}
		<span class="minimal-badge minimal-badge--{badgeStatus}">
			{#if badgeStatus === "uploading"}
				<span class="minimal-badge-spinner" aria-hidden="true"></span>
			{/if}
			{itemsLength}
		</span>
	{/if}
</button>
