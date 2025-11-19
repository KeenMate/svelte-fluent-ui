import { writable } from 'svelte/store'

// Browser detection for non-SvelteKit environments
const browser = typeof window !== 'undefined'

const STORAGE_KEY = 'svelte-fluentui-nav-state'

type NavState = {
	[groupTitle: string]: boolean // title -> expanded state
}

function createNavigationStore() {
	// Load initial state from localStorage
	const getInitialState = (): NavState => {
		if (!browser) return {}

		try {
			const stored = localStorage.getItem(STORAGE_KEY)
			return stored ? JSON.parse(stored) : {}
		} catch (e) {
			console.warn('Failed to load navigation state from localStorage:', e)
			return {}
		}
	}

	const { subscribe, set, update } = writable<NavState>(getInitialState())

	return {
		subscribe,
		setGroupExpanded: (groupTitle: string, expanded: boolean) => {
			update(state => {
				const newState = { ...state, [groupTitle]: expanded }

				// Persist to localStorage
				if (browser) {
					try {
						localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
					} catch (e) {
						console.warn('Failed to save navigation state to localStorage:', e)
					}
				}

				return newState
			})
		},
		getGroupExpanded: (groupTitle: string, defaultExpanded: boolean = false): boolean => {
			let result = defaultExpanded
			subscribe(state => {
				result = state[groupTitle] ?? defaultExpanded
			})()
			return result
		},
		reset: () => {
			set({})
			if (browser) {
				localStorage.removeItem(STORAGE_KEY)
			}
		}
	}
}

export const navigationStore = createNavigationStore()
