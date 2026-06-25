<script lang="ts">
	import {onMount, tick} from "svelte"
	import Icon from "./Icon.svelte"
	import {portal} from "../actions/portal.js"
	import type {SlotType} from "../types/index.js"
	import type {CommandPaletteItem, CommandPaletteFilter} from "./CommandPalette.types.js"

	type Props = {
		/** Items to search. Each is either navigation (`href`) or an action (`onSelect`). */
		items: CommandPaletteItem[]
		/** Controlled open state. Bind it to drive the palette from your own trigger. */
		open?: boolean
		/** Input placeholder. */
		placeholder?: string
		/** Items shown on the idle screen (no query yet), grouped by `group`. Defaults to the first `maxResults` of `items`. */
		homeItems?: CommandPaletteItem[]
		/** Max results rendered for a query. */
		maxResults?: number
		/**
		 * Global keyboard shortcut that toggles the palette, e.g. "mod+k"
		 * (mod = ⌘ on Mac, Ctrl elsewhere). Set `enableShortcut={false}` to
		 * disable the built-in listener and drive `open` yourself.
		 */
		shortcut?: string
		/** Register the global `shortcut` listener. */
		enableShortcut?: boolean
		/** Close the palette after an item is selected. */
		closeOnSelect?: boolean
		/** Override the built-in fuzzy scorer with app-specific search. */
		filter?: CommandPaletteFilter
		/** Called with the selected item before navigation/action runs. */
		onselect?: (item: CommandPaletteItem) => void
		onopen?: () => void
		onclose?: () => void
		/** Replace a result row's rendering. Receives the item and whether it's the active row. */
		item?: SlotType
		/** Replace the empty-state body. Receives the current query. */
		empty?: SlotType
		/** Replace the footer hints. */
		footer?: SlotType
	}

	let {
		items,
		open = $bindable(false),
		placeholder = "Search…",
		homeItems = undefined,
		maxResults = 50,
		shortcut = "mod+k",
		enableShortcut = true,
		closeOnSelect = true,
		filter = undefined,
		onselect = undefined,
		onopen = undefined,
		onclose = undefined,
		item: itemSnippet = undefined,
		empty: emptySnippet = undefined,
		footer: footerSnippet = undefined
	}: Props = $props()

	let query = $state("")
	let selectedIndex = $state(0)
	let inputEl = $state<HTMLInputElement | undefined>(undefined)
	let listEl = $state<HTMLDivElement | undefined>(undefined)

	const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.platform)
	const modKey = isMac ? "⌘" : "Ctrl"

	// Parse "mod+k" once into the modifier/key contract the keydown handler checks.
	const parsedShortcut = $derived.by(() => {
		const parts = shortcut.toLowerCase().split("+").map((p) => p.trim()).filter(Boolean)
		return {
			key: parts[parts.length - 1] ?? "",
			mod: parts.includes("mod"),
			ctrl: parts.includes("ctrl"),
			meta: parts.includes("cmd") || parts.includes("meta"),
			shift: parts.includes("shift"),
			alt: parts.includes("alt")
		}
	})

	// Score: higher = better match. 0 = no match. Layered so exact / prefix beat
	// substring beat fuzzy-subsequence. Searches title, meta, group and keywords.
	function score(it: CommandPaletteItem, needle: string): number {
		const title = it.title.toLowerCase()
		if (title === needle) return 1000
		if (title.startsWith(needle)) return 500 - (title.length - needle.length)
		const group = (it.group ?? "").toLowerCase()
		if (group === needle) return 400
		if (title.includes(needle)) return 300 - title.indexOf(needle)
		if ((it.meta ?? "").toLowerCase().includes(needle)) return 200
		if ((it.keywords ?? []).some((k) => k.toLowerCase().includes(needle))) return 150
		if (group.includes(needle)) return 100
		// Fuzzy: every character of needle must appear in title in order.
		let i = 0
		for (const c of title) {
			if (c === needle[i]) i++
			if (i === needle.length) return 20
		}
		return 0
	}

	const trimmedQuery = $derived(query.trim())

	const results = $derived.by(() => {
		const q = trimmedQuery
		if (!q) return []
		if (filter) return filter(items, q).slice(0, maxResults)
		const needle = q.toLowerCase()
		return items
			.map((it) => ({it, s: score(it, needle)}))
			.filter((r) => r.s > 0)
			.sort((a, b) => b.s - a.s)
			.slice(0, maxResults)
			.map((r) => r.it)
	})

	// Idle screen: grouped sections preserving first-appearance order.
	const homeSections = $derived.by(() => {
		const source = (homeItems ?? items).slice(0, maxResults)
		const order: string[] = []
		const byGroup = new Map<string, CommandPaletteItem[]>()
		for (const it of source) {
			const g = it.group ?? ""
			if (!byGroup.has(g)) {
				byGroup.set(g, [])
				order.push(g)
			}
			byGroup.get(g)!.push(it)
		}
		return order.map((g) => ({group: g, items: byGroup.get(g)!}))
	})

	// Flattened render list — section headers interleaved with rows — so a single
	// running index drives both keyboard nav and the highlight. Headers carry no index.
	type Row =
		| {kind: "header"; label: string}
		| {kind: "item"; item: CommandPaletteItem; index: number}

	const rows = $derived.by(() => {
		const out: Row[] = []
		let index = 0
		if (trimmedQuery) {
			for (const it of results) out.push({kind: "item", item: it, index: index++})
		} else {
			for (const section of homeSections) {
				if (section.group) out.push({kind: "header", label: section.group})
				for (const it of section.items) out.push({kind: "item", item: it, index: index++})
			}
		}
		return out
	})

	const itemCount = $derived(rows.filter((r) => r.kind === "item").length)

	function itemKey(it: CommandPaletteItem): string {
		return it.id ?? it.href ?? it.title
	}

	// Split a title around the first contiguous match of the query for <mark>
	// highlighting. Subsequence (fuzzy) matches don't highlight — only the simple
	// substring case, which is what users actually read.
	function highlight(title: string): {text: string; mark: boolean}[] {
		const q = trimmedQuery
		if (!q) return [{text: title, mark: false}]
		const i = title.toLowerCase().indexOf(q.toLowerCase())
		if (i < 0) return [{text: title, mark: false}]
		return [
			{text: title.slice(0, i), mark: false},
			{text: title.slice(i, i + q.length), mark: true},
			{text: title.slice(i + q.length), mark: false}
		].filter((s) => s.text.length > 0)
	}

	async function openPalette() {
		open = true
		query = ""
		selectedIndex = 0
		onopen?.()
		await tick()
		inputEl?.focus()
	}

	function closePalette() {
		if (!open) return
		open = false
		onclose?.()
	}

	function selectItem(it: CommandPaletteItem) {
		if (it.disabled) return
		onselect?.(it)
		if (closeOnSelect) closePalette()
		// Actions run inline; navigation rows are real <a> elements, so a click
		// (mouse or the synthetic Enter click below) lets the host router handle it.
		it.onSelect?.()
	}

	// Enter activates the highlighted row by clicking its DOM node — works for both
	// <button> actions and <a> navigation (router intercepts the anchor click).
	function activateSelected() {
		const el = listEl?.querySelector<HTMLElement>(`[data-idx="${selectedIndex}"]`)
		el?.click()
	}

	function matchesShortcut(e: KeyboardEvent): boolean {
		const s = parsedShortcut
		if (!s.key || e.key.toLowerCase() !== s.key) return false
		const wantCtrlOrMeta = s.mod || s.ctrl || s.meta
		if (wantCtrlOrMeta && !(e.ctrlKey || e.metaKey)) return false
		if (!wantCtrlOrMeta && (e.ctrlKey || e.metaKey)) return false
		if (s.shift !== e.shiftKey) return false
		if (s.alt !== e.altKey) return false
		return true
	}

	// Reset highlighted row whenever the query changes.
	$effect(() => {
		query
		selectedIndex = 0
	})

	// Keep highlighted row in view during keyboard nav.
	$effect(() => {
		if (!open || !listEl) return
		const target = listEl.querySelector<HTMLElement>(`[data-idx="${selectedIndex}"]`)
		target?.scrollIntoView({block: "nearest"})
	})

	function handleGlobalKey(e: KeyboardEvent) {
		if (enableShortcut && matchesShortcut(e)) {
			e.preventDefault()
			if (open) closePalette()
			else openPalette()
			return
		}

		if (!open) return

		if (e.key === "Escape") {
			e.preventDefault()
			closePalette()
		} else if (e.key === "ArrowDown") {
			e.preventDefault()
			selectedIndex = Math.min(selectedIndex + 1, Math.max(itemCount - 1, 0))
		} else if (e.key === "ArrowUp") {
			e.preventDefault()
			selectedIndex = Math.max(selectedIndex - 1, 0)
		} else if (e.key === "Enter") {
			e.preventDefault()
			activateSelected()
		}
	}

	onMount(() => {
		document.addEventListener("keydown", handleGlobalKey)
		return () => document.removeEventListener("keydown", handleGlobalKey)
	})
</script>

{#snippet rowBody(it: CommandPaletteItem)}
	{#if it.icon}
		<span class="cp-item-icon"><Icon name={it.icon} size={20} /></span>
	{/if}
	<span class="cp-item-content">
		<span class="cp-item-title">
			{#each highlight(it.title) as seg}{#if seg.mark}<mark>{seg.text}</mark>{:else}{seg.text}{/if}{/each}
		</span>
		{#if it.meta}<span class="cp-item-meta">{it.meta}</span>{/if}
	</span>
	{#if trimmedQuery && it.group}
		<span class="cp-item-group">{it.group}</span>
	{/if}
	{#if it.badge}
		<span class="cp-item-badge">{it.badge}</span>
	{/if}
	{#if it.shortcut}
		<span class="cp-item-shortcut">
			{#each it.shortcut.split(" ") as key}<kbd>{key}</kbd>{/each}
		</span>
	{/if}
{/snippet}

{#if open}
	<div use:portal class="cp-root">
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="cp-backdrop" onclick={closePalette}></div>
		<div
			class="cp-panel"
			role="dialog"
			aria-modal="true"
			aria-label="Command palette"
		>
			<div class="cp-search-row">
				<svg class="cp-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path d="M7 1.75a5.25 5.25 0 1 0 3.215 9.4l3.067 3.068a.75.75 0 1 0 1.061-1.061l-3.066-3.066A5.25 5.25 0 0 0 7 1.75zM3.25 7a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0z" fill="currentColor"/>
				</svg>
				<input
					bind:this={inputEl}
					bind:value={query}
					type="text"
					class="cp-input"
					{placeholder}
					autocomplete="off"
					spellcheck="false"
				/>
				<span class="cp-kbd-hint">esc to close</span>
			</div>

			<div class="cp-results" bind:this={listEl} role="listbox">
				{#each rows as row (row.kind === "header" ? "h:" + row.label : itemKey(row.item) + ":" + row.index)}
					{#if row.kind === "header"}
						<div class="cp-section">{row.label}</div>
					{:else if row.item.href && !row.item.onSelect}
						<!-- Navigation row — real <a> so the host router handles the click. -->
						<a
							class="cp-item"
							class:selected={row.index === selectedIndex}
							class:disabled={row.item.disabled}
							data-idx={row.index}
							href={row.item.disabled ? undefined : row.item.href}
							target={row.item.target ?? null}
							rel={row.item.rel ?? null}
							role="option"
							aria-selected={row.index === selectedIndex}
							onclick={() => selectItem(row.item)}
							onmousemove={() => (selectedIndex = row.index)}
						>
							{#if itemSnippet}{@render itemSnippet(row.item, row.index === selectedIndex)}{:else}{@render rowBody(row.item)}{/if}
						</a>
					{:else}
						<!-- Action row. -->
						<button
							type="button"
							class="cp-item"
							class:selected={row.index === selectedIndex}
							data-idx={row.index}
							disabled={row.item.disabled || undefined}
							role="option"
							aria-selected={row.index === selectedIndex}
							onclick={() => selectItem(row.item)}
							onmousemove={() => (selectedIndex = row.index)}
						>
							{#if itemSnippet}{@render itemSnippet(row.item, row.index === selectedIndex)}{:else}{@render rowBody(row.item)}{/if}
						</button>
					{/if}
				{/each}

				{#if itemCount === 0}
					{#if emptySnippet}
						{@render emptySnippet(trimmedQuery)}
					{:else}
						<div class="cp-empty">
							{#if trimmedQuery}No matches for "{trimmedQuery}"{:else}No items{/if}
						</div>
					{/if}
				{/if}
			</div>

			{#if footerSnippet}
				{@render footerSnippet()}
			{:else}
				<div class="cp-footer">
					<span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
					<span><kbd>↵</kbd> select</span>
					<span><kbd>{modKey}</kbd><kbd>{parsedShortcut.key.toUpperCase()}</kbd> toggle</span>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.cp-root {
		position: fixed;
		inset: 0;
		z-index: var(--fluent-z-modal, 1070);
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding-top: 12vh;
	}

	.cp-backdrop {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
	}

	.cp-panel {
		position: relative;
		width: min(640px, calc(100vw - 2rem));
		max-height: 70vh;
		display: flex;
		flex-direction: column;
		background: var(--neutral-layer-1, #ffffff);
		border: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		border-radius: 8px;
		box-shadow: 0 16px 40px rgba(0, 0, 0, 0.22), 0 0 2px rgba(0, 0, 0, 0.12);
		overflow: hidden;
		font-family: var(--body-font);
	}

	.cp-search-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
	}

	.cp-search-icon {
		color: var(--neutral-foreground-hint, #666);
		flex-shrink: 0;
	}

	.cp-input {
		flex: 1;
		min-width: 0;
		border: none;
		outline: none;
		background: transparent;
		font-size: 1rem;
		color: var(--neutral-foreground-rest, inherit);
		font-family: inherit;
	}

	.cp-kbd-hint {
		color: var(--neutral-foreground-hint, #888);
		font-size: 0.75rem;
		flex-shrink: 0;
	}

	.cp-results {
		flex: 1;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 0.25rem;
	}

	.cp-section {
		padding: 0.5rem 0.75rem 0.25rem;
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--neutral-foreground-hint, #888);
	}

	.cp-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.5rem 0.75rem;
		border: none;
		border-radius: 4px;
		background: transparent;
		cursor: pointer;
		text-align: start;
		text-decoration: none;
		font: inherit;
		color: var(--neutral-foreground-rest, inherit);
	}

	.cp-item.selected {
		background: var(--accent-fill-rest, #0078d4);
		color: var(--neutral-foreground-on-accent, #ffffff);
	}

	.cp-item.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.cp-item-icon {
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
		color: var(--accent-fill-rest);
	}

	.cp-item.selected .cp-item-icon {
		color: inherit;
	}

	.cp-item-content {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.0625rem;
	}

	.cp-item-title {
		font-size: 0.9375rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.cp-item-title :global(mark) {
		background: transparent;
		color: var(--accent-fill-rest, #0078d4);
		font-weight: 700;
	}

	.cp-item.selected .cp-item-title :global(mark) {
		color: inherit;
		text-decoration: underline;
	}

	.cp-item-meta {
		font-size: 0.75rem;
		color: var(--neutral-foreground-hint, #888);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.cp-item.selected .cp-item-meta {
		color: inherit;
		opacity: 0.85;
	}

	.cp-item-group {
		flex-shrink: 0;
		font-size: 0.75rem;
		opacity: 0.8;
		padding: 0.125rem 0.5rem;
		border-radius: 999px;
		background: var(--neutral-fill-secondary-rest, rgba(0, 0, 0, 0.06));
	}

	.cp-item.selected .cp-item-group {
		background: rgba(255, 255, 255, 0.2);
	}

	.cp-item-badge {
		flex-shrink: 0;
		font-size: 0.6875rem;
		font-weight: 600;
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
		background: var(--neutral-fill-secondary-rest, rgba(0, 0, 0, 0.06));
		color: var(--neutral-foreground-rest);
	}

	.cp-item.selected .cp-item-badge {
		background: rgba(255, 255, 255, 0.2);
		color: inherit;
	}

	.cp-item-shortcut {
		display: inline-flex;
		gap: 0.15rem;
		flex-shrink: 0;
	}

	.cp-empty {
		padding: 1.5rem 1rem;
		text-align: center;
		color: var(--neutral-foreground-hint, #888);
		font-size: 0.875rem;
	}

	.cp-footer {
		display: flex;
		gap: 1rem;
		padding: 0.5rem 1rem;
		border-top: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		font-size: 0.75rem;
		color: var(--neutral-foreground-hint, #888);
	}

	.cp-footer kbd,
	.cp-item-shortcut kbd {
		display: inline-block;
		padding: 0.05rem 0.35rem;
		border: 1px solid var(--neutral-stroke-layer-rest, #ccc);
		border-radius: 3px;
		background: var(--neutral-layer-2, #f5f5f5);
		color: var(--neutral-foreground-rest, #222);
		font-family: inherit;
		font-size: 0.7rem;
		margin: 0 0.15rem 0 0;
		min-width: 1rem;
		text-align: center;
	}

	.cp-item.selected .cp-item-shortcut kbd {
		background: rgba(255, 255, 255, 0.2);
		border-color: rgba(255, 255, 255, 0.3);
		color: inherit;
	}
</style>
