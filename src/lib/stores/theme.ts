import {writable} from "svelte/store"
import {BROWSER} from "esm-env"
import {baseLayerLuminance, StandardLuminance} from "@fluentui/web-components"

export type Theme = "light" | "dark"

function createThemeStore() {
	const getInitialTheme = (): Theme => {
		if (!BROWSER) return "light"
		const stored = localStorage.getItem("theme")
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

	return {
		subscribe,
		toggle: () =>
			update((current) => {
				const newTheme = current === "light" ? "dark" : "light"
				if (BROWSER) {
					localStorage.setItem("theme", newTheme)
					document.documentElement.setAttribute("data-theme", newTheme)
					updateFluentUITheme(newTheme)
				}
				return newTheme
			}),
		set: (theme: Theme) => {
			if (BROWSER) {
				localStorage.setItem("theme", theme)
				document.documentElement.setAttribute("data-theme", theme)
				updateFluentUITheme(theme)
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
