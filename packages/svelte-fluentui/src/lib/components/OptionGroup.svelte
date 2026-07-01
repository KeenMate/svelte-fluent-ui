<!--
 * OptionGroup Component
 *
 * A non-interactive section header + its <Option> rows inside a listbox
 * (Select / Combobox). Renders role="group" with a label so the options read
 * as a labelled group to assistive tech.
 *
 * Use it two ways:
 *   - directly in children:  <OptionGroup label="Fruits"><Option .../></OptionGroup>
 *   - automatically: pass a `group` on each item in a Combobox `options` array,
 *     and Combobox wraps each group in one of these.
 *
 * The group is not itself an option — Select/Combobox navigation and filtering
 * only ever touch `.fluent-option`, so the header is skipped by the keyboard and
 * ignored by the display/count logic. Combobox additionally hides an entire
 * group (header included) once all of its options filter out — see the
 * `:has()` rule in Combobox.svelte.
-->

<script lang="ts">
	import type {SlotType} from "../types/index.js"

	type Props = {
		/** Group heading text. */
		label?: string
		class?: string
		style?: string
		children: SlotType
	}

	let {
		label = undefined,
		class: className = undefined,
		style = undefined,
		children
	}: Props = $props()
</script>

<div
	class={`option-group${className ? ` ${className}` : ""}`}
	role="group"
	aria-label={label ?? null}
	{...(style ? {style} : {})}
>
	{#if label}
		<div class="option-group-label" aria-hidden="true">{label}</div>
	{/if}
	{@render children()}
</div>

<style>
	.option-group {
		display: flex;
		flex-direction: column;
	}

	/* A distinct header band: light fill + a top divider separate it clearly from
	 * the option rows above, while uppercase/letter-spaced text reads as a
	 * section label rather than a selectable row. */
	.option-group-label {
		position: sticky;
		top: 0;
		z-index: 1;
		padding: calc(var(--design-unit, 4) * 1.25 * 1px) calc(var(--design-unit, 4) * 2 * 1px);
		background: var(--neutral-fill-secondary-rest, #f0f0f0);
		border-top: 1px solid var(--neutral-stroke-divider-rest, #e0e0e0);
		font-size: var(--type-ramp-minus-1-font-size, 12px);
		line-height: var(--type-ramp-minus-1-line-height, 16px);
		font-weight: 700;
		color: var(--neutral-foreground-rest, #242424);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		user-select: none;
	}

	/* The first group has nothing above it — drop the leading divider. */
	.option-group:first-child .option-group-label {
		border-top: none;
	}

	/* Indent a group's option rows so they visibly nest under the header and
	 * read as distinct from any ungrouped (flush-left) options. */
	.option-group :global(.fluent-option) {
		padding-left: calc(var(--design-unit, 4) * 4 * 1px);
	}
</style>
