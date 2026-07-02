<script lang="ts">
	/**
	 * BadgeGroup — a flex-wrap container that limits how many child badges are
	 * visible. Ported from pure-admin's `pa-badge-group`, with the visible limit
	 * configurable per instance and an optional built-in expand/collapse toggle.
	 *
	 * Two modes:
	 * - **Static** (default): hides children past `limit` but always keeps the
	 *   LAST child shown — the conventional "+N more" tail you add yourself.
	 * - **Expandable** (`expandable`): the group renders its OWN clickable
	 *   "+N more" / "Show less" toggle after the badges (don't add a manual
	 *   tail), and clicking it reveals/collapses the hidden badges.
	 *
	 * Hidden children stay in the DOM (so filtering/sorting still see them) —
	 * they're just `display: none`. `showAll` forces everything visible.
	 */
	import type {SlotType} from "../types/index.js"

	type Props = {
		/** Max badges shown before the overflow is hidden. */
		limit?: number
		/** Reveal all children, ignoring `limit` (hard override). */
		showAll?: boolean
		/** Render a built-in clickable "+N more" / "Show less" toggle. */
		expandable?: boolean
		/** Label for the collapsed toggle. */
		moreLabel?: (hiddenCount: number) => string
		/** Label for the expanded toggle. */
		lessLabel?: string
		/** Gap between badges (any CSS length). */
		gap?: string
		children?: SlotType
		class?: string
		style?: string
	}

	let {
		limit = 5,
		showAll = false,
		expandable = false,
		moreLabel = (n: number) => `+${n} more`,
		lessLabel = "Show less",
		gap = "0.5rem",
		children = undefined,
		class: className = "",
		style = ""
	}: Props = $props()

	let containerEl: HTMLDivElement | undefined = $state()
	let expanded = $state(false)
	let hiddenCount = $state(0)

	function badgeChildren(): HTMLElement[] {
		if (!containerEl) return []
		return Array.from(containerEl.children).filter(
			(el): el is HTMLElement =>
				el instanceof HTMLElement && !el.classList.contains("badge-group-toggle")
		)
	}

	function applyLimit() {
		const kids = badgeChildren()
		const total = kids.length
		const revealed = showAll || (expandable && expanded)
		const lastIndex = total - 1
		kids.forEach((el, i) => {
			let hide: boolean
			if (revealed) hide = false
			else if (expandable) hide = i >= limit
			// static mode: keep the last child (the manual "+N more" tail) visible
			else hide = i >= limit && i !== lastIndex
			el.style.display = hide ? "none" : ""
		})
		hiddenCount = Math.max(0, total - limit)
	}

	function toggle() {
		expanded = !expanded
	}

	$effect(() => {
		// re-run when any of these change
		void limit
		void showAll
		void expandable
		void expanded
		applyLimit()

		// re-apply when children are added/removed (dynamic lists)
		const observer = new MutationObserver(() => applyLimit())
		if (containerEl) observer.observe(containerEl, {childList: true})
		return () => observer.disconnect()
	})
</script>

<div
	bind:this={containerEl}
	class={`badge-group${className ? ` ${className}` : ""}`}
	style={`--badge-group-gap: ${gap};${style ? ` ${style}` : ""}`}
>
	{@render children?.()}
	{#if expandable && hiddenCount > 0}
		<button type="button" class="badge-group-toggle" aria-expanded={expanded} onclick={toggle}>
			{expanded ? lessLabel : moreLabel(hiddenCount)}
		</button>
	{/if}
</div>

<style>
	.badge-group {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--badge-group-gap, 0.5rem);
	}

	/* Toggle styled to match a neutral Badge */
	.badge-group-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-family: var(--body-font);
		font-size: var(--type-ramp-minus-1-font-size, 12px);
		font-weight: 600;
		line-height: var(--type-ramp-minus-1-line-height, 16px);
		min-height: 20px;
		padding: 2px 8px;
		border: none;
		border-radius: var(--control-corner-radius, 4px);
		background-color: var(--neutral-fill-secondary-rest, #f0f0f0);
		color: var(--neutral-foreground-rest, #242424);
		cursor: pointer;
		transition: background-color 100ms ease;
	}

	.badge-group-toggle:hover {
		background-color: var(--neutral-fill-secondary-hover, #ebebeb);
	}

	.badge-group-toggle:focus-visible {
		outline: 2px solid var(--focus-stroke-outer, currentColor);
		outline-offset: 1px;
	}
</style>
