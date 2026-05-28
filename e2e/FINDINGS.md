# E2E findings — bugs, surprising behaviors, tooling quirks

Running notes captured while writing the e2e suite. Each entry says **what
the test discovered** and **why it surprised me** so we can decide later
whether to fix the component, change the docs, or accept the behavior.

## Component issues (worth a look)

1. **`keepOpen` doesn't work for click-driven selection (Autocomplete).** 🔧 WORKAROUND
   `handleClickOutside` in `Autocomplete.svelte:353` closes the dropdown on
   any document click that lands outside `containerElement`. The dropdown
   options live in a portal (`PositioningRegion` → `use:portal`), so a click
   on an `.option-item` is _not_ inside `containerElement` and triggers the
   close. The `keepOpen` branch inside `selectOption` (line 228) only matters
   for keyboard-driven selection (Enter on a highlighted option) — those don't
   dispatch a DOM click on the portaled button.
   **In tests:** the keepOpen test uses ArrowDown + Enter, not click.
   **Fix proposal:** make `handleClickOutside` exempt clicks where
   `event.target.closest('.options-list, .positioning-region')` matches, the
   same way `handleOutsideScroll` already does (line 370). Currently logged
   as a behavior limitation, not blocking.

## Tooling quirks (working around)

2. **Playwright `.fill()` doesn't reliably fire `input` events on Svelte 5
   inputs.** 🔧 WORKAROUND
   On some autocomplete instances (specifically ones with snippets in slots
   like `headerContent` / `optionTemplate`), `await input.fill("a")` set the
   DOM `.value` to `"a"` but no `input` event fired — neither Svelte's
   `oninput={handleInput}` nor a manually attached `addEventListener("input",
   ...)` ran. The dropdown stayed closed. `await input.pressSequentially("a",
   {delay: 30})` works because it simulates real keystrokes.
   **Why other tests passed with `.fill()`:** when followed immediately by
   `.click()` on `optionByText(...)`, Playwright's actionability auto-wait
   gives the dropdown time to appear — but it's still suspect that fill
   silently doesn't fire the event in some cases.
   **In tests:** use `.click()` + `.pressSequentially(...)` for any spec
   asserting on `oninput`-triggered state without a chained `.click()`.

3. **SvelteKit 2.48 doesn't honor `+layout@.svelte` reset for our setup.**
   🔧 WORKAROUND
   Putting `docs/src/routes/test/+layout@.svelte` should break the root
   layout chain so `/test/*` doesn't render the docs chrome (topnav,
   sidebar, footer). Generated `$types.d.ts` reflected the reset
   (`LayoutParentData = EnsureDefined<{}>`), but the chrome still rendered
   at runtime.
   **Workaround:** added a path check at the top of `docs/src/routes/+layout.svelte`:
   ```svelte
   {#if $page.url.pathname.startsWith("/test/")}
       {@render children()}
   {:else}
       <Layout>...docs chrome...</Layout>
   {/if}
   ```
   And kept the test layout as a regular `+layout.svelte` (not `@`).

4. **SPA hydration timing — `page.goto` can return before SvelteKit mounts.**
   🔧 WORKAROUND
   With `ssr=false` on `/test/*`, `page.goto()` returns once the static HTML
   shell loads, but the SvelteKit JS bundle still needs to load + hydrate.
   Tests relying on mount-time `$effect` (e.g. `initialSearchQuery`) can
   race the assertion. The component would render fine after ~500ms, but
   `expect(locator).toHaveValue(...)` polled the locator and timed out
   without ever matching.
   **In tests:** for routes with on-mount effects, use
   `page.goto(url, {waitUntil: "networkidle"})` + `locator.waitFor({state:
   "attached"})` before asserting.

## Architectural notes (not bugs — just patterns to keep in mind)

5. **Portal-rendered overlays don't descend from the wrap.** PositioningRegion's
   `use:portal` reparents the dropdown/menu/tooltip surface to `document.body`.
   Wrap-scoped locators (`wrap.locator(".options-list")`) won't find it. Use
   page-scoped locators (`page.locator(".options-list")`). Only one overlay
   is open at a time across the page, so there's no ambiguity — **except**
   for fixtures whose overlays open on mount via `$effect`. Those need to
   live on their own route so they don't double up with overlays from
   subsequent test interactions on a shared page.
   Affects: Autocomplete, DatePicker, TimePicker, Menu, ContextMenu, Tooltip,
   Dialog.
