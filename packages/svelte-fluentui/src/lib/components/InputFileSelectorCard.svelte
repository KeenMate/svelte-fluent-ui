<!--
 * InputFile — card selector
 * Internal sub-component used by InputFile.svelte. Renders the bordered
 * drop-zone "card" used as the primary file-picker entry point. The inner
 * content (icon, message, Browse button, hint lines) is supplied via the
 * `content` snippet so the parent can render the same content inside its
 * drag-expand overlay without duplication. Not exported from the package
 * barrel.
-->

<script lang="ts">
	import type {Snippet} from "svelte"
	import type {InputFileCardSize} from "./InputFile.types.js"

	type Props = {
		cardSize: InputFileCardSize
		isDragging: boolean
		disabled?: boolean
		// `undefined` means the card isn't acting as a popover trigger — don't
		// emit aria-expanded at all (rather than emitting "false", which would
		// claim the card controls a disclosure it doesn't).
		popoverExpanded?: boolean | undefined
		ariaLabel: string
		ondragenter: (e: DragEvent) => void
		ondragover: (e: DragEvent) => void
		ondragleave: (e: DragEvent) => void
		ondrop: (e: DragEvent) => void
		onclick: (e: MouseEvent) => void
		onkeydown: (e: KeyboardEvent) => void
		content: Snippet
	}

	let {
		cardSize,
		isDragging,
		disabled = false,
		popoverExpanded = undefined,
		ariaLabel,
		ondragenter,
		ondragover,
		ondragleave,
		ondrop,
		onclick,
		onkeydown,
		content
	}: Props = $props()

	// Stop drops bubbling to the optional .chips-row wrapper that may also
	// listen for drop events — without this, dropping a file on the card in
	// chips mode would run handleDrop twice (once on the card, once on the row).
	function handleDrop(e: DragEvent) {
		e.stopPropagation()
		ondrop(e)
	}
</script>

<div
	class="drop-zone drop-zone--{cardSize}"
	class:disabled
	class:dragging={isDragging}
	{ondragenter}
	{ondragover}
	{ondragleave}
	ondrop={handleDrop}
	tabindex={disabled ? -1 : 0}
	role="button"
	aria-label={ariaLabel}
	aria-expanded={popoverExpanded}
	{onkeydown}
	{onclick}
>
	{@render content()}
</div>
