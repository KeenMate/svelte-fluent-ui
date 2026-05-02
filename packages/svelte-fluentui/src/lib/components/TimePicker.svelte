<!--
 * TimePicker Component
 * Inspired by FluentUI Blazor TimePicker component
 * https://www.fluentui-blazor.net/TimePicker
 *
 * Provides time selection with hour, minute, and optional second/millisecond inputs
-->

<script lang="ts">
	import TextField from "./TextField.svelte"
	import PositioningRegion from "./PositioningRegion.svelte"
	import Button from "./Button.svelte"
	import type {SlotType} from "../types/index.js"

	type Props = {
		id?: string
		value?: string | null // HH:mm:ss or HH:mm format
		placeholder?: string
		disabled?: boolean
		readonly?: boolean
		required?: boolean
		autofocus?: boolean
		label?: string
		labelTemplate?: SlotType
		appearance?: string
		use24Hours?: boolean
		/** When set, forces AM/PM on (true) or off (false). Overrides `use24Hours`. Null/undefined = use `use24Hours`. */
		useAmPm?: boolean | null
		showSeconds?: boolean
		minuteStep?: number
		hourStep?: number
		secondStep?: number
		/** Minimum allowed time in HH:mm or HH:mm:ss format. */
		minTime?: string
		/** Maximum allowed time in HH:mm or HH:mm:ss format. */
		maxTime?: string
		/** When true (default), the popup closes when the user clicks OK. */
		autoClose?: boolean
		/** Bindable popup open state. */
		open?: boolean
		openClockIconAriaLabel?: string
		title?: string
		class?: string
		style?: string
		onValueChange?: (value: string | null) => void
		onOpenChange?: (open: boolean) => void
	}

	let {
		id = undefined,
		value = $bindable(null),
		placeholder = "Select time",
		disabled = false,
		readonly = false,
		required = false,
		autofocus = undefined,
		label = undefined,
		labelTemplate = undefined,
		appearance = undefined,
		use24Hours = true,
		useAmPm = undefined,
		showSeconds = false,
		minuteStep = 1,
		hourStep = 1,
		secondStep = 1,
		minTime = undefined,
		maxTime = undefined,
		autoClose = true,
		open = $bindable(false),
		openClockIconAriaLabel = "Open time picker",
		title = undefined,
		class: className = "",
		style = "",
		onValueChange = undefined,
		onOpenChange = undefined
	}: Props = $props()

	// Effective 24h mode: if `useAmPm` is set, it wins; otherwise fall back to `use24Hours`.
	const effective24h = $derived(useAmPm == null ? use24Hours : !useAmPm)

	let wrapperElement = $state<HTMLElement | undefined>(undefined)
	let popupElement = $state<HTMLElement | undefined>(undefined)
	let isOpen = $derived(open)
	function setOpen(next: boolean) {
		if (open === next) return
		open = next
		onOpenChange?.(next)
	}

	// Parse min/max time into total minutes for easy comparison.
	function toTotalSeconds(s?: string): number | null {
		if (!s) return null
		const [h = "0", m = "0", sec = "0"] = s.split(":")
		const hh = parseInt(h, 10)
		const mm = parseInt(m, 10)
		const ss = parseInt(sec, 10)
		if (Number.isNaN(hh) || Number.isNaN(mm)) return null
		return hh * 3600 + mm * 60 + (Number.isNaN(ss) ? 0 : ss)
	}
	const minTotal = $derived(toTotalSeconds(minTime))
	const maxTotal = $derived(toTotalSeconds(maxTime))
	function isTimeDisabled(h: number, m: number, s: number): boolean {
		const total = h * 3600 + m * 60 + s
		if (minTotal != null && total < minTotal) return true
		if (maxTotal != null && total > maxTotal) return true
		return false
	}

	// Close on outside click / Escape
	$effect(() => {
		if (!isOpen) return

		function handlePointerDown(event: PointerEvent) {
			const target = event.target as Node | null
			if (!target) return
			if (wrapperElement?.contains(target)) return
			if (popupElement?.contains(target)) return
			setOpen(false)
		}

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				event.stopPropagation()
				setOpen(false)
			}
		}

		document.addEventListener("pointerdown", handlePointerDown, true)
		document.addEventListener("keydown", handleKeyDown, true)
		return () => {
			document.removeEventListener("pointerdown", handlePointerDown, true)
			document.removeEventListener("keydown", handleKeyDown, true)
		}
	})
	let selectedHour = $state(12)
	let selectedMinute = $state(0)
	let selectedSecond = $state(0)
	let selectedPeriod = $state<"AM" | "PM">("AM")

	// Parse time value
	function parseTime(timeStr: string | null) {
		if (!timeStr) return

		const parts = timeStr.split(":")
		if (parts.length >= 2) {
			let hour = parseInt(parts[0])
			const minute = parseInt(parts[1])
			const second = parts.length > 2 ? parseInt(parts[2]) : 0

			if (!effective24h) {
				selectedPeriod = hour >= 12 ? "PM" : "AM"
				hour = hour % 12 || 12
			}

			selectedHour = hour
			selectedMinute = minute
			selectedSecond = second
		}
	}

	// Format time for display
	function formatTime(): string {
		if (!value) return ""

		let displayHour = selectedHour

		if (!effective24h) {
			displayHour = selectedHour % 12 || 12
		}

		const hourStr = displayHour.toString().padStart(2, "0")
		const minuteStr = selectedMinute.toString().padStart(2, "0")
		const secondStr = selectedSecond.toString().padStart(2, "0")

		let formatted = `${hourStr}:${minuteStr}`
		if (showSeconds) {
			formatted += `:${secondStr}`
		}
		if (!effective24h) {
			formatted += ` ${selectedPeriod}`
		}

		return formatted
	}

	// Generate time value in HH:mm:ss format
	function generateTimeValue(): string {
		let hour = selectedHour

		if (!effective24h) {
			if (selectedPeriod === "PM" && hour !== 12) {
				hour += 12
			} else if (selectedPeriod === "AM" && hour === 12) {
				hour = 0
			}
		}

		const hourStr = hour.toString().padStart(2, "0")
		const minuteStr = selectedMinute.toString().padStart(2, "0")
		const secondStr = selectedSecond.toString().padStart(2, "0")

		return showSeconds ? `${hourStr}:${minuteStr}:${secondStr}` : `${hourStr}:${minuteStr}`
	}

	// Initialize from value
	$effect(() => {
		parseTime(value)
	})

	let displayValue = $derived(formatTime())

	// Handle input click
	function handleInputClick(e: MouseEvent) {
		if (!disabled && !readonly) {
			setOpen(!isOpen)
		}
	}

	// Stop propagation to prevent closing when clicking inside popup
	function handlePopupClick(e: MouseEvent) {
		e.stopPropagation()
	}

	// Handle time selection
	function handleApply() {
		// Respect min/max — compute in 24h terms so AM/PM mode still works.
		let h = selectedHour
		if (!effective24h) {
			if (selectedPeriod === "PM" && h !== 12) h += 12
			else if (selectedPeriod === "AM" && h === 12) h = 0
		}
		if (isTimeDisabled(h, selectedMinute, showSeconds ? selectedSecond : 0)) return
		value = generateTimeValue()
		if (autoClose) setOpen(false)
		onValueChange?.(value)
	}

	// Handle clear
	function handleClear() {
		value = null
		setOpen(false)
		onValueChange?.(null)
	}

	// Generate hour options
	const hours = $derived.by(() => {
		const max = effective24h ? 23 : 12
		const start = effective24h ? 0 : 1
		const result: number[] = []
		for (let i = start; i <= max; i += hourStep) {
			result.push(i)
		}
		return result
	})

	// Generate minute options
	const minutes = $derived.by(() => {
		const result: number[] = []
		for (let i = 0; i < 60; i += minuteStep) {
			result.push(i)
		}
		return result
	})

	// Generate second options
	const seconds = $derived.by(() => {
		const result: number[] = []
		for (let i = 0; i < 60; i += secondStep) {
			result.push(i)
		}
		return result
	})
</script>

<div class="fluent-timepicker {className}" style={style}>
	{#if label || labelTemplate}
		<label for={id} class="fluent-label">
			{#if label}{label}{/if}
			{#if labelTemplate}{@render labelTemplate?.()}{/if}
			{#if required}<span class="required-indicator">*</span>{/if}
		</label>
	{/if}

	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div class="timepicker-wrapper" bind:this={wrapperElement} onclick={handleInputClick} style="cursor: pointer;">
		<TextField
			{id}
			value={displayValue}
			{placeholder}
			{disabled}
			readonly={true}
			{required}
			{autofocus}
			{appearance}
			{title}
			style="width: 100%;"
		>
			{#snippet end()}
				<span class="end-buttons">
				<!-- Clock icon -->
				<button
					type="button"
					class="clock-button"
					onclick={handleInputClick}
					disabled={disabled}
					aria-label={openClockIconAriaLabel}
				>
					<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
						<path d="M10 2a8 8 0 110 16 8 8 0 010-16zm0 1a7 7 0 100 14 7 7 0 000-14zm.5 2a.5.5 0 01.5.5V10h3a.5.5 0 010 1h-3.5a.5.5 0 01-.5-.5v-5a.5.5 0 01.5-.5z"/>
					</svg>
				</button>

				{#if value && !disabled && !readonly}
					<!-- Clear button -->
					<button
						type="button"
						class="clear-button"
						onclick={handleClear}
						aria-label="Clear time"
					>
						<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
							<path d="M2.09 2.22a.75.75 0 011.06-.13L6 4.94l2.85-2.85a.75.75 0 111.06 1.06L7.06 6l2.85 2.85a.75.75 0 11-1.06 1.06L6 7.06l-2.85 2.85a.75.75 0 01-1.06-1.06L4.94 6 2.09 3.15a.75.75 0 01-.13-1.06z"/>
						</svg>
					</button>
				{/if}
				</span>
			{/snippet}
		</TextField>

		{#if isOpen && wrapperElement}
			<PositioningRegion
				anchor={wrapperElement}
				visible={isOpen}
				matchWidth={false}
				style="z-index: var(--fluent-z-popover, 1060); background: var(--neutral-layer-1); border: 1px solid var(--neutral-stroke-rest); border-radius: 4px; padding: 1rem; box-shadow: 0 8px 16px rgba(0,0,0,0.14), 0 0 2px rgba(0,0,0,0.12); min-width: 280px;"
			>
				<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
				<div class="time-picker-panel" bind:this={popupElement} onclick={handlePopupClick}>
					<div class="time-selectors">
						<!-- Hour selector -->
						<div class="time-column">
							<div class="column-label">Hour</div>
							<div class="time-list">
								{#each hours as hour}
									<button
										type="button"
										class="time-option"
										class:selected={selectedHour === hour}
										onclick={() => selectedHour = hour}
									>
										{hour.toString().padStart(2, "0")}
									</button>
								{/each}
							</div>
						</div>

						<!-- Minute selector -->
						<div class="time-column">
							<div class="column-label">Minute</div>
							<div class="time-list">
								{#each minutes as minute}
									<button
										type="button"
										class="time-option"
										class:selected={selectedMinute === minute}
										onclick={() => selectedMinute = minute}
									>
										{minute.toString().padStart(2, "0")}
									</button>
								{/each}
							</div>
						</div>

						<!-- Second selector (optional) -->
						{#if showSeconds}
							<div class="time-column">
								<div class="column-label">Second</div>
								<div class="time-list">
									{#each seconds as second}
										<button
											type="button"
											class="time-option"
											class:selected={selectedSecond === second}
											onclick={() => selectedSecond = second}
										>
											{second.toString().padStart(2, "0")}
										</button>
									{/each}
								</div>
							</div>
						{/if}

						<!-- AM/PM selector (12-hour format) -->
						{#if !effective24h}
							<div class="time-column period-column">
								<div class="column-label">Period</div>
								<div class="time-list">
									<button
										type="button"
										class="time-option"
										class:selected={selectedPeriod === "AM"}
										onclick={() => selectedPeriod = "AM"}
									>
										AM
									</button>
									<button
										type="button"
										class="time-option"
										class:selected={selectedPeriod === "PM"}
										onclick={() => selectedPeriod = "PM"}
									>
										PM
									</button>
								</div>
							</div>
						{/if}
					</div>

					<div class="time-actions">
						<Button appearance="accent" onclick={handleApply} style="flex: 1;">
							OK
						</Button>
					</div>
				</div>
			</PositioningRegion>
		{/if}
	</div>
</div>

<style>
	.fluent-timepicker {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.required-indicator {
		color: var(--error-foreground-rest, #d13438);
		margin-left: 0.25rem;
	}

	.timepicker-wrapper {
		position: relative;
	}

	.end-buttons {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}

	.clock-button,
	.clear-button {
		background: transparent;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem;
		color: var(--neutral-foreground-rest);
		border-radius: 4px;
	}

	.clock-button:hover:not(:disabled),
	.clear-button:hover {
		background: var(--neutral-fill-secondary-hover);
	}

	.clock-button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.clear-button {
		margin-left: 0.25rem;
	}

	.time-picker-panel {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.time-selectors {
		display: flex;
		gap: 0.5rem;
	}

	.time-column {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.period-column {
		flex: 0.7;
	}

	.column-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--neutral-foreground-rest);
		text-align: center;
		padding: 0.25rem;
	}

	.time-list {
		display: flex;
		flex-direction: column;
		gap: 2px;
		max-height: 200px;
		overflow-y: auto;
		border: 1px solid var(--neutral-stroke-rest);
		border-radius: 4px;
		padding: 0.25rem;
	}

	.time-option {
		background: transparent;
		border: none;
		padding: 0.5rem;
		cursor: pointer;
		border-radius: 4px;
		font-size: 0.875rem;
		color: var(--neutral-foreground-rest);
		text-align: center;
	}

	.time-option:hover {
		background: var(--neutral-fill-secondary-hover);
	}

	.time-option.selected {
		background: var(--accent-fill-rest);
		color: var(--neutral-foreground-on-accent);
		font-weight: 600;
	}

	.time-actions {
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
	}
</style>
