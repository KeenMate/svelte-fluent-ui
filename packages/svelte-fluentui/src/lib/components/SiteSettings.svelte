<script lang="ts">
	import {Dialog, Select, Option, Switch, Button, Divider, TextField, Stack} from "../index.js"
	import {settings, accentColors, type ThemeMode} from "../stores/settings.js"
	import type {SlotType} from "../types/index.js"

	type Props = {
		open?: boolean
		onClose?: () => void
		children?: SlotType
	}

	let {
		    open = false,
		    onClose,
		    children
	    }: Props = $props()

	let localSettings = $derived($settings)

	function handleThemeChange(event: Event) {
		const target = event.target as HTMLSelectElement
		settings.setThemeMode(target.value as ThemeMode)
	}

	function handleAccentColorChange(event: Event) {
		const target = event.target as HTMLSelectElement
		settings.setAccentColor(target.value)
	}

	function handleNeutralColorChange(event: Event) {
		const target = event.target as HTMLInputElement
		settings.setNeutralColor(target.value)
	}

	function handleDirectionChange(event: Event) {
		const target = event.target as HTMLInputElement
		settings.setDirection(target.checked ? 'ltr' : 'rtl')
	}

	function handleReset() {
		settings.reset()
	}
</script>

<Dialog visible={open} modal={true} onClose={onClose} size="small">
	<h4 style="margin: 0 0 1.5rem 0;">Site settings</h4>

	<Stack orientation="vertical" gap="1rem">
		<!-- Theme Selection -->
		<div>
			<label for="theme-select" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
				Theme
			</label>
			<Select
				id="theme-select"
				value={localSettings.themeMode}
				style="width: 100%; margin-bottom: 1.5rem;"
				onchange={handleThemeChange}
			>
				<Option value="system">System</Option>
				<Option value="light">Light</Option>
				<Option value="dark">Dark</Option>
			</Select>
		</div>

		<!-- Accent Color Selection -->
		<div>
			<label for="color-select" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
				Color
			</label>
			<Select
				id="color-select"
				value={localSettings.accentColor}
				style="width: 100%; margin-bottom: 1.5rem;"
				onchange={handleAccentColorChange}
			>
				{#each Object.entries(accentColors) as [name, color]}
					<Option value={name}>
						<div style="display: flex; align-items: center; gap: 0.75rem;">
							<svg style="width: 20px; fill: {color};" viewBox="0 0 20 20">
								<path d="M5 4a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H5Z"></path>
							</svg>
							<span>{name}</span>
						</div>
					</Option>
				{/each}
			</Select>
		</div>

		<!-- Neutral Base Color -->
		<div>
			<label for="neutral-color" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
				Neutral base color
			</label>
			<div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
				<TextField
					id="neutral-color"
					type="color"
					value={localSettings.neutralColor}
					style="width: 150px;"
					oninput={handleNeutralColorChange}
				/>
				<svg style="width: 24px; fill: var(--accent-fill-rest);" viewBox="0 0 24 24">
					<path
						d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm0 7c.41 0 .75.34.75.75v5a.75.75 0 0 1-1.5 0v-5c0-.41.34-.75.75-.75ZM12 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
					></path>
				</svg>
			</div>
		</div>

		<!-- Direction Toggle -->
		<div style="margin-bottom: 1.5rem;">
			<Switch
				checked={localSettings.direction === 'ltr'}
				onchange={handleDirectionChange}
			>
				Direction
				{#snippet checkedMessage()}
					Left to Right
				{/snippet}
				{#snippet uncheckedMessage()}
					Right to Left
				{/snippet}
			</Switch>
		</div>

		<!-- Info Text -->
		<p style="margin: 0; font-size: 0.875rem; line-height: 1.5; color: var(--neutral-foreground-rest);">
			These values (except for Direction) are persisted in the LocalStorage and will be recovered
			during your next visits.
			<br /><br />
			Use the 'Reset settings' button below to go back to the system theme and default color.
		</p>

		<Divider />

		<!-- Reset Button -->
		<div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
			<Button appearance="neutral" onClick={handleReset} style="width: 150px;">
				Reset settings
			</Button>
			<svg style="width: 24px; fill: var(--accent-fill-rest);" viewBox="0 0 24 24">
				<path
					d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm0 7c.41 0 .75.34.75.75v5a.75.75 0 0 1-1.5 0v-5c0-.41.34-.75.75-.75ZM12 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
				></path>
			</svg>
		</div>

		<!-- OK Button -->
		<div style="display: flex; justify-content: flex-end;">
			<Button appearance="accent" onClick={onClose}>OK</Button>
		</div>
	</Stack>
</Dialog>
