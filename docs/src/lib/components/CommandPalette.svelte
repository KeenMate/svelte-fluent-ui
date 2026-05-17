<script lang="ts">
	import {goto} from "$app/navigation"
	import {onMount, tick} from "svelte"

	type CommandItem = {
		label: string
		href: string
		group?: string
		target?: string
		rel?: string
	}

	type Props = {
		items: CommandItem[]
	}

	let {items}: Props = $props()

	let open = $state(false)
	let query = $state("")
	let selectedIndex = $state(0)
	let inputEl = $state<HTMLInputElement | undefined>(undefined)
	let listEl = $state<HTMLDivElement | undefined>(undefined)

	const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.platform)
	const modKey = isMac ? "⌘" : "Ctrl"

	// Score: higher = better match. 0 = no match.
	// Layered scoring so exact / prefix beat substring beat fuzzy.
	function score(item: CommandItem, q: string): number {
		const needle = q.toLowerCase()
		const label = item.label.toLowerCase()
		const group = (item.group ?? "").toLowerCase()
		if (label === needle) return 1000
		if (label.startsWith(needle)) return 500 - (label.length - needle.length)
		if (group === needle) return 400
		if (label.includes(needle)) return 200 - label.indexOf(needle)
		if (group.includes(needle)) return 100
		// Fuzzy: every character of needle must appear in label in order.
		let i = 0
		for (const c of label) {
			if (c === needle[i]) i++
			if (i === needle.length) return 20
		}
		return 0
	}

	const results = $derived.by(() => {
		const q = query.trim()
		if (!q) return items.slice(0, 50)
		return items
			.map((item) => ({item, s: score(item, q)}))
			.filter((r) => r.s > 0)
			.sort((a, b) => b.s - a.s)
			.slice(0, 50)
			.map((r) => r.item)
	})

	// Reset highlighted row whenever the query changes.
	$effect(() => {
		query
		selectedIndex = 0
	})

	// Keep highlighted row in view when using keyboard nav.
	$effect(() => {
		if (!open || !listEl) return
		const target = listEl.querySelector<HTMLElement>(`[data-idx="${selectedIndex}"]`)
		target?.scrollIntoView({block: "nearest"})
	})

	async function openPalette() {
		open = true
		query = ""
		selectedIndex = 0
		await tick()
		inputEl?.focus()
	}

	function closePalette() {
		open = false
	}

	function navigate(item: CommandItem) {
		closePalette()
		if (item.target === "_blank") {
			window.open(item.href, "_blank", item.rel || "noopener noreferrer")
		} else {
			goto(item.href)
		}
	}

	function handleGlobalKey(e: KeyboardEvent) {
		// Toggle on Ctrl/Cmd + K from anywhere.
		if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "k") {
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
			selectedIndex = Math.min(selectedIndex + 1, Math.max(results.length - 1, 0))
		} else if (e.key === "ArrowUp") {
			e.preventDefault()
			selectedIndex = Math.max(selectedIndex - 1, 0)
		} else if (e.key === "Enter") {
			e.preventDefault()
			const hit = results[selectedIndex]
			if (hit) navigate(hit)
		}
	}

	function handleOpenEvent() {
		if (!open) openPalette()
	}

	onMount(() => {
		document.addEventListener("keydown", handleGlobalKey)
		window.addEventListener("open-command-palette", handleOpenEvent)
		return () => {
			document.removeEventListener("keydown", handleGlobalKey)
			window.removeEventListener("open-command-palette", handleOpenEvent)
		}
	})
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div class="cp-backdrop" onclick={closePalette}>
		<div
			class="cp-panel"
			role="dialog"
			aria-label="Search pages"
			onclick={(e) => e.stopPropagation()}
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
					placeholder="Search pages and components..."
					autocomplete="off"
					spellcheck="false"
				/>
				<span class="cp-kbd-hint">esc to close</span>
			</div>

			<div class="cp-results" bind:this={listEl} role="listbox">
				{#each results as item, i (item.href + i)}
					<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
					<div
						class="cp-result"
						class:selected={i === selectedIndex}
						data-idx={i}
						role="option"
						aria-selected={i === selectedIndex}
						onclick={() => navigate(item)}
						onmousemove={() => (selectedIndex = i)}
					>
						<span class="cp-result-label">{item.label}</span>
						{#if item.group}
							<span class="cp-result-group">{item.group}</span>
						{/if}
						{#if item.target === "_blank"}
							<svg class="cp-external" width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
								<path d="M9.25 2.5a.75.75 0 0 0 0 1.5h2.19l-5.97 5.97a.75.75 0 1 0 1.06 1.06L12.5 5.06v2.19a.75.75 0 0 0 1.5 0v-4a.75.75 0 0 0-.75-.75h-4zM4 4.75A1.75 1.75 0 0 1 5.75 3h2a.75.75 0 0 1 0 1.5h-2a.25.25 0 0 0-.25.25v6.5c0 .138.112.25.25.25h6.5a.25.25 0 0 0 .25-.25v-2a.75.75 0 0 1 1.5 0v2A1.75 1.75 0 0 1 12.25 13h-6.5A1.75 1.75 0 0 1 4 11.25v-6.5z" fill="currentColor"/>
							</svg>
						{/if}
					</div>
				{/each}
				{#if results.length === 0}
					<div class="cp-empty">No matches for "{query}"</div>
				{/if}
			</div>

			<div class="cp-footer">
				<span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
				<span><kbd>↵</kbd> open</span>
				<span><kbd>{modKey}</kbd><kbd>K</kbd> toggle</span>
			</div>
		</div>
	</div>
{/if}

<style>
	.cp-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 9999;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding-top: 12vh;
	}

	.cp-panel {
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

	.cp-result {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0.75rem;
		border-radius: 4px;
		cursor: pointer;
		color: var(--neutral-foreground-rest, inherit);
	}

	.cp-result.selected {
		background: var(--accent-fill-rest, #0078d4);
		color: var(--neutral-foreground-on-accent, #ffffff);
	}

	.cp-result-label {
		flex: 1;
		font-size: 0.9375rem;
	}

	.cp-result-group {
		font-size: 0.75rem;
		opacity: 0.8;
		padding: 0.125rem 0.5rem;
		border-radius: 999px;
		background: var(--neutral-fill-secondary-rest, rgba(0, 0, 0, 0.06));
	}

	.cp-result.selected .cp-result-group {
		background: rgba(255, 255, 255, 0.2);
	}

	.cp-external {
		opacity: 0.7;
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

	.cp-footer kbd {
		display: inline-block;
		padding: 0.05rem 0.35rem;
		border: 1px solid var(--neutral-stroke-layer-rest, #ccc);
		border-radius: 3px;
		background: var(--neutral-layer-2, #f5f5f5);
		font-family: inherit;
		font-size: 0.7rem;
		margin: 0 0.15rem 0 0;
		min-width: 1rem;
		text-align: center;
	}
</style>
