import {defineConfig, devices} from "@playwright/test"

/**
 * Playwright config for end-to-end tests.
 *
 * Specs live in e2e/ and target dedicated fixture pages under
 * docs/src/routes/test/<feature>/+page.svelte. Those fixture pages are
 * intentionally separate from the docs/showcase pages so they stay minimal
 * and stable under the spec selectors.
 *
 * Commands:
 *   npm run test:e2e:install   # one-time: download chromium browser binary
 *   npm run test:e2e           # headless run
 *   npm run test:e2e:ui        # Playwright Test UI (debugging)
 *   npm run test:e2e:headed    # watch the browser do its thing
 */
export default defineConfig({
	testDir: "./e2e",
	timeout: 30_000,
	expect: {timeout: 5_000},

	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,

	reporter: process.env.CI ? "github" : "list",

	use: {
		baseURL: "http://localhost:12900",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
		video: "retain-on-failure"
	},

	projects: [
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
				viewport: {width: 1440, height: 1024}
			}
		}
	],

	webServer: {
		command: "npm run dev",
		url: "http://localhost:12900",
		reuseExistingServer: !process.env.CI,
		timeout: 60_000,
		stdout: "ignore",
		stderr: "pipe"
	}
})
