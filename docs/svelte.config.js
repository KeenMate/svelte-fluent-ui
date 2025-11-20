import adapter from "@sveltejs/adapter-static"
import {sveltePreprocess} from "svelte-preprocess"

/** @type {import("@sveltejs/kit").Config} */
const config = {
	preprocess: sveltePreprocess({
		scss: true
	}),

	kit: {
		adapter: adapter({
			fallback: "index.html"
		})
	}
}

export default config
