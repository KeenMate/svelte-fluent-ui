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
		value?: string | null // HH:mm:ss or HH:mm format
		placeholder?: string
		disabled?: boolean
		readonly?: boolean
		required?: boolean
		label?: string
		appearance?: string
		use24Hours?: boolean
		showSeconds?: boolean
		minuteStep?: number
		hourStep?: number
		class?: string
		style?: string
		onValueChange?: (value: string | null) => void
		[prop: string]: any
	}

	let {
		value = $bindable(null),
		placeholder = "Select time",
		disabled = false,
		readonly = false,
		required = false,
		label = undefined,
		appearance = undefined,
		use24Hours = true,
		showSeconds = false,
		minuteStep = 1,
		hourStep = 1,
		class: className = "",
		style = "",
		onValueChange = undefined,
		...restProps
	}: Props = $props()

	let isOpen = $state(false)
	let textFieldElement: HTMLElement | undefined
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

			if (!use24Hours) {
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

		if (!use24Hours) {
			displayHour = selectedHour % 12 || 12
		}

		const hourStr = displayHour.toString().padStart(2, "0")
		const minuteStr = selectedMinute.toString().padStart(2, "0")
		const secondStr = selectedSecond.toString().padStart(2, "0")

		let formatted = `${hourStr}:${minuteStr}`
		if (showSeconds) {
			formatted += `:${secondStr}`
		}
		if (!use24Hours) {
			formatted += ` ${selectedPeriod}`
		}

		return formatted
	}

	// Generate time value in HH:mm:ss format
	function generateTimeValue(): string {
		let hour = selectedHour

		if (!use24Hours) {
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
			isOpen = !isOpen
		}
	}

	// Stop propagation to prevent closing when clicking inside popup
	function handlePopupClick(e: MouseEvent) {
		e.stopPropagation()
	}

	// Handle time selection
	function handleApply() {
		value = generateTimeValue()
		isOpen = false
		onValueChange?.(value)
	}

	// Handle clear
	function handleClear() {
		value = null
		isOpen = false
		onValueChange?.(null)
	}

	// Generate hour options
	const hours = $derived.by(() => {
		const max = use24Hours ? 23 : 12
		const start = use24Hours ? 0 : 1
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
		for (let i = 0; i < 60; i++) {
			result.push(i)
		}
		return result
	})
</script>

<div class="fluent-timepicker {className}" style={style}>
	{#if label}
		<label class="timepicker-label">
			{label}
			{#if required}<span class="required-indicator">*</span>{/if}
		</label>
	{/if}

	<div class="timepicker-wrapper" onclick={handleInputClick} style="cursor: pointer;">
		<TextField
			bind:this={textFieldElement}
			value={displayValue}
			{placeholder}
			{disabled}
			readonly={true}
			{required}
			{appearance}
			style="width: 100%;"
			{...restProps}
		>
			{#snippet end()}
				<!-- Clock icon -->
				<button
					type="button"
					class="clock-button"
					onclick={handleInputClick}
					disabled={disabled}
					aria-label="Open time picker"
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
			{/snippet}
		</TextField>

		{#if isOpen && textFieldElement}
			<PositioningRegion
				anchor={textFieldElement}
				visible={isOpen}
				style="z-index: 1000; background: var(--neutral-layer-1); border: 1px solid var(--neutral-stroke-rest); border-radius: 4px; padding: 1rem; box-shadow: 0 8px 16px rgba(0,0,0,0.14), 0 0 2px rgba(0,0,0,0.12); min-width: 280px;"
			>
				<div class="time-picker-panel" onclick={handlePopupClick}>
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
						{#if !use24Hours}
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
						<Button appearance="accent" onClick={handleApply} style="flex: 1;">
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

	.timepicker-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--neutral-foreground-rest);
	}

	.required-indicator {
		color: var(--error-foreground-rest, #d13438);
		margin-left: 0.25rem;
	}

	.timepicker-wrapper {
		position: relative;
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
