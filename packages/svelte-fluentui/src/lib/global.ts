// Registers a small global API on `window.components['svelte-fluentui']` so
// non-Svelte / runtime code can introspect the package (e.g. read the version
// from the browser console). Mirrors the pattern used by sister packages like
// `web-multiselect`.
//
// Side-effect import: `index.ts` imports this file purely for the registration.

import {VERSION} from "./version.js"

export interface SvelteFluentUIGlobalAPI {
	version: () => string
}

declare global {
	interface Window {
		components?: {
			"svelte-fluentui"?: SvelteFluentUIGlobalAPI
			[key: string]: unknown
		}
	}
}

if (typeof window !== "undefined") {
	window.components = window.components || {}
	window.components["svelte-fluentui"] = {
		version: () => VERSION
	}
}
