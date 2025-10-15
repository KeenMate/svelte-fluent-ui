import { writable } from 'svelte/store'

export type ThemeMode = 'system' | 'light' | 'dark'
export type Direction = 'ltr' | 'rtl'

export interface SiteSettings {
	themeMode: ThemeMode
	accentColor: string
	neutralColor: string
	direction: Direction
}

const defaultSettings: SiteSettings = {
	themeMode: 'system',
	accentColor: 'OneDrive',
	neutralColor: '#FAFAFA', // Light gray, close to white for light mode
	direction: 'ltr'
}

// Microsoft product colors matching FluentUI Blazor
export const accentColors = {
	Default: '#036ac4',
	Access: '#a4373a',
	Booking: '#00a99d',
	Exchange: '#0078d4',
	Excel: '#217346',
	GroupMe: '#00bcf2',
	Office: '#d83b01',
	OneDrive: '#0078d4',
	OneNote: '#7719aa',
	Outlook: '#0f6cbd',
	Planner: '#31752f',
	PowerApps: '#742774',
	PowerBI: '#f2c811',
	PowerPoint: '#b7472a',
	Project: '#31752f',
	Publisher: '#077568',
	SharePoint: '#0078d4',
	Skype: '#0078d4',
	Stream: '#bc1948',
	Sway: '#008272',
	Teams: '#6264a7',
	Visio: '#3955a3',
	Windows: '#0078d4',
	Word: '#2b579a',
	Yammer: '#106ebe'
}

function loadSettings(): SiteSettings {
	if (typeof window === 'undefined') return defaultSettings

	try {
		const stored = localStorage.getItem('site-settings')
		if (stored) {
			return { ...defaultSettings, ...JSON.parse(stored) }
		}
	} catch (e) {
		console.warn('Failed to load settings from localStorage:', e)
	}

	return defaultSettings
}

function saveSettings(settings: SiteSettings) {
	if (typeof window === 'undefined') return

	try {
		// Don't persist direction as per FluentUI Blazor behavior
		const { direction, ...persistentSettings } = settings
		localStorage.setItem('site-settings', JSON.stringify(persistentSettings))
	} catch (e) {
		console.warn('Failed to save settings to localStorage:', e)
	}
}

function createSettingsStore() {
	const { subscribe, set, update } = writable<SiteSettings>(loadSettings())

	return {
		subscribe,
		set: (value: SiteSettings) => {
			set(value)
			saveSettings(value)
		},
		update: (updater: (value: SiteSettings) => SiteSettings) => {
			update((current) => {
				const newValue = updater(current)
				saveSettings(newValue)
				return newValue
			})
		},
		reset: () => {
			const resetSettings = { ...defaultSettings }
			set(resetSettings)
			saveSettings(resetSettings)
		},
		setThemeMode: (mode: ThemeMode) => {
			update((current) => {
				const newValue = { ...current, themeMode: mode }
				saveSettings(newValue)
				return newValue
			})
		},
		setAccentColor: (color: string) => {
			update((current) => {
				const newValue = { ...current, accentColor: color }
				saveSettings(newValue)
				return newValue
			})
		},
		setNeutralColor: (color: string) => {
			update((current) => {
				const newValue = { ...current, neutralColor: color }
				saveSettings(newValue)
				return newValue
			})
		},
		setDirection: (direction: Direction) => {
			update((current) => ({ ...current, direction }))
		}
	}
}

export const settings = createSettingsStore()
