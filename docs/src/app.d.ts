// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// Vite-injected version from svelte-fluentui package.json
	const __SVELTE_FLUENTUI_VERSION__: string;
}

export {};
