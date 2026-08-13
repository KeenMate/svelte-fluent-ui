import {writable} from "svelte/store"
import {BROWSER} from "esm-env"
import {baseLayerLuminance, StandardLuminance} from "@fluentui/web-components"

export type Theme = "light" | "dark"

function createThemeStore() {
	const getInitialTheme = (): Theme => {
		if (!BROWSER) return "light"
		const stored = localStorage.getItem("fluent-theme")
		console.log('[Svelte FluentUI Theme Store] getInitialTheme:', stored || 'light (default)')
		return (stored === "light" || stored === "dark") ? stored : "light"
	}

	const initialTheme = getInitialTheme()
	const {subscribe, set, update} = writable<Theme>(initialTheme)

	function updateFluentUITheme(theme: Theme) {
		if (!BROWSER) return
		console.log('[Svelte FluentUI Theme Store] updateFluentUITheme called with:', theme)
		baseLayerLuminance.setValueFor(
			document.body,
			theme === "dark" ? StandardLuminance.DarkMode : StandardLuminance.LightMode
		)
		console.log('[Svelte FluentUI Theme Store] baseLayerLuminance.setValueFor() completed - this will regenerate --neutral-layer-* colors!')
	}

	// Swap the palette without letting interactive-feedback transitions animate the
	// change. Our custom controls (Combobox, Autocomplete, Select, InputFile,
	// CommandPaletteTrigger, …) and the Fluent switch track carry short
	// background/border transitions for hover/focus; those otherwise fire when the
	// theme tokens change, producing a lagging colour fade that reads as a glitch.
	// `.fluent-theme-switching` (see theme.scss) disables every transition; we apply
	// the theme, force a synchronous reflow so the new colours paint immediately,
	// then re-enable transitions after two frames.
	function applyTheme(theme: Theme) {
		if (!BROWSER) return
		const root = document.documentElement
		root.classList.add("fluent-theme-switching")
		root.setAttribute("data-theme", theme)
		updateFluentUITheme(theme)
		void root.offsetHeight
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				root.classList.remove("fluent-theme-switching")
			})
		})
	}

	return {
		subscribe,
		toggle: () =>
			update((current) => {
				const newTheme = current === "light" ? "dark" : "light"
				if (BROWSER) {
					localStorage.setItem("fluent-theme", newTheme)
					applyTheme(newTheme)
				}
				return newTheme
			}),
		set: (theme: Theme) => {
			if (BROWSER) {
				localStorage.setItem("fluent-theme", theme)
				applyTheme(theme)
			}
			set(theme)
		},
		init: () => {
			if (BROWSER) {
				document.documentElement.setAttribute("data-theme", initialTheme)
				updateFluentUITheme(initialTheme)
			}
		}
	}
}

export const theme = createThemeStore()
