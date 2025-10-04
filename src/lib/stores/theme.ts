import {writable} from "svelte/store"
import {browser} from "$app/environment"
import {baseLayerLuminance, StandardLuminance} from "@fluentui/web-components"

export type Theme = "light" | "dark"

function createThemeStore() {
	const getInitialTheme = (): Theme => {
		if (!browser) return "light"
		const stored = localStorage.getItem("theme")
		return (stored === "light" || stored === "dark") ? stored : "light"
	}

	const initialTheme = getInitialTheme()
	const {subscribe, set, update} = writable<Theme>(initialTheme)

	function updateFluentUITheme(theme: Theme) {
		if (!browser) return
		baseLayerLuminance.setValueFor(
			document.body,
			theme === "dark" ? StandardLuminance.DarkMode : StandardLuminance.LightMode
		)
	}

	return {
		subscribe,
		toggle: () =>
			update((current) => {
				const newTheme = current === "light" ? "dark" : "light"
				if (browser) {
					localStorage.setItem("theme", newTheme)
					document.documentElement.setAttribute("data-theme", newTheme)
					updateFluentUITheme(newTheme)
				}
				return newTheme
			}),
		set: (theme: Theme) => {
			if (browser) {
				localStorage.setItem("theme", theme)
				document.documentElement.setAttribute("data-theme", theme)
				updateFluentUITheme(theme)
			}
			set(theme)
		},
		init: () => {
			if (browser) {
				document.documentElement.setAttribute("data-theme", initialTheme)
				updateFluentUITheme(initialTheme)
			}
		}
	}
}

export const theme = createThemeStore()
