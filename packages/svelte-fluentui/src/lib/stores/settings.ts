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

// Pick black or white text for best contrast against `hex`. Uses the simple
// W3C luminance threshold; good enough for the accent-on-text decision.
// Returns '#ffffff' for any non-hex input so the caller can blindly forward
// whatever it has (named colors, malformed localStorage, etc.).
function contrastForeground(hex: unknown): string {
	if (typeof hex !== 'string') return '#ffffff'
	const h = hex.trim().replace(/^#/, '')
	const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
	if (full.length !== 6) return '#ffffff'
	const r = parseInt(full.slice(0, 2), 16) / 255
	const g = parseInt(full.slice(2, 4), 16) / 255
	const b = parseInt(full.slice(4, 6), 16) / 255
	if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return '#ffffff'
	const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
	return luminance > 0.6 ? '#000000' : '#ffffff'
}

function applySettings(s: SiteSettings) {
	if (typeof document === 'undefined') return
	const root = document.documentElement

	// Theme mode → data-theme attribute. 'system' resolves via matchMedia.
	const effectiveMode: 'light' | 'dark' =
		s.themeMode === 'system'
			? (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
			: s.themeMode
	root.setAttribute('data-theme', effectiveMode)

	// Accent color: resolve named color from accentColors map, fall back to raw hex/css value.
	// We override --accent-fill-* (used as accent backgrounds) and recompute
	// --foreground-on-accent-rest for proper contrast on accent buttons —
	// without that recompute, white-on-yellow / white-on-light accents are unreadable.
	// We do NOT override --accent-foreground-rest here because some FluentUI
	// internals route accent button labels through it.
	const accentRaw = (accentColors as Record<string, string>)[s.accentColor] ?? s.accentColor
	const accentHex = typeof accentRaw === 'string' ? accentRaw : '#0078d4'
	root.style.setProperty('--accent-fill-rest', accentHex)
	root.style.setProperty('--accent-fill-hover', accentHex)
	root.style.setProperty('--accent-fill-active', accentHex)
	const accentForeground = contrastForeground(accentHex)
	root.style.setProperty('--foreground-on-accent-rest', accentForeground)
	root.style.setProperty('--foreground-on-accent-hover', accentForeground)
	root.style.setProperty('--foreground-on-accent-active', accentForeground)
	root.style.setProperty('--foreground-on-accent-focus', accentForeground)
	root.style.setProperty('--fluent-accent-primary', accentHex)
	root.style.setProperty('--fluent-accent-hover', accentHex)
	root.style.setProperty('--fluent-accent-active', accentHex)

	// Neutral base color → primary surface
	const neutralColor = typeof s.neutralColor === 'string' ? s.neutralColor : '#FAFAFA'
	root.style.setProperty('--neutral-layer-1', neutralColor)
	root.style.setProperty('--fluent-bg-primary', neutralColor)

	// Direction
	root.setAttribute('dir', s.direction)
}

function createSettingsStore() {
	const initial = loadSettings()
	const { subscribe, set, update } = writable<SiteSettings>(initial)

	// Browser-only: apply settings to the document on every change, and react
	// to OS-level light/dark changes when themeMode is 'system'.
	if (typeof document !== 'undefined') {
		let current: SiteSettings = initial
		subscribe((s) => {
			current = s
			applySettings(s)
		})
		if (typeof window !== 'undefined' && window.matchMedia) {
			const mq = window.matchMedia('(prefers-color-scheme: dark)')
			mq.addEventListener('change', () => {
				if (current.themeMode === 'system') applySettings(current)
			})
		}
	}

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
