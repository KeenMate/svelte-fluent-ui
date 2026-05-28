import {test, expect, type Page, type Locator} from "@playwright/test"

/**
 * Covers Autocomplete behavior: chip selection, search/filter, multi vs single,
 * backspace-removes-last-chip, initial options, async onoptionssearch,
 * maxSelectedOptions cap, minSearchLength gate, and disabled options.
 *
 * Fixture: docs/src/routes/test/autocomplete/+page.svelte
 *
 * Selectors target the wrapper DOM in the Autocomplete component
 * (`.fluent-autocomplete`, `.autocomplete-native-input`, `.option-item`,
 * `.inline-chip`, `.chip-remove`, `.clear-button`).
 */

const PAGE = "/test/autocomplete"

function wrapById(page: Page, id: string): Locator {
	return page.locator(`#${id}-wrap`)
}

function inputOf(wrap: Locator): Locator {
	return wrap.locator(".autocomplete-native-input")
}

function chipsOf(wrap: Locator): Locator {
	return wrap.locator(".inline-chip, .external-chip")
}

// The dropdown is portaled to document.body via PositioningRegion's use:portal,
// so it's NOT a descendant of the wrap. Only one dropdown is open at a time
// across the page, so a page-scoped locator is unambiguous.
function optionsList(page: Page): Locator {
	return page.locator(".options-list")
}

function optionItems(page: Page): Locator {
	return page.locator(".option-item")
}

function optionByText(page: Page, text: string): Locator {
	return page.locator(".option-item", {hasText: text})
}

async function open(page: Page, id: string): Promise<Locator> {
	const wrap = wrapById(page, id)
	const input = inputOf(wrap)
	// Ensure the component is mounted (the shared fixture page has 25+
	// components — SPA hydration can race with the click otherwise).
	await expect(input).toBeVisible()
	// Use focus() rather than click() — handleInputFocus is what opens the
	// dropdown for showInitialOptions, and click() races with hydration on
	// some browsers when the page is dense.
	await input.focus()
	return wrap
}

test.beforeEach(async ({page}) => {
	await page.goto(PAGE)
})

// =============================================================================
// single mode (maxSelectedOptions=1)
// =============================================================================

test.describe("single mode", () => {
	test("typing filters options; clicking one fills the input with the selection text", async ({page}) => {
		const wrap = await open(page, "single")

		await inputOf(wrap).fill("ban")
		await expect(optionsList(page)).toBeVisible()
		await optionByText(page, "Banana").click()

		// Single-select shows the selection in the input itself, not as a chip.
		await expect(chipsOf(wrap)).toHaveCount(0)
		await expect(inputOf(wrap)).toHaveValue("Banana")
		await expect(page.locator("#single-value")).toHaveAttribute("data-value", "banana")
	})

	test("picking a second option replaces the first (single-select semantics)", async ({page}) => {
		const wrap = await open(page, "single")

		await inputOf(wrap).fill("ban")
		await optionByText(page, "Banana").click()

		await inputOf(wrap).click()
		await inputOf(wrap).fill("che")
		await optionByText(page, "Cherry").click()

		await expect(chipsOf(wrap)).toHaveCount(0)
		await expect(inputOf(wrap)).toHaveValue("Cherry")
		await expect(page.locator("#single-value")).toHaveAttribute("data-value", "cherry")
	})
})

// =============================================================================
// multi mode (default)
// =============================================================================

test.describe("multi mode", () => {
	test("picking three options appends three chips and updates bound array", async ({page}) => {
		const wrap = await open(page, "multi")

		await inputOf(wrap).fill("a")
		await optionByText(page, "Apple").click()
		await inputOf(wrap).click()
		await inputOf(wrap).fill("b")
		await optionByText(page, "Banana").click()
		await inputOf(wrap).click()
		await inputOf(wrap).fill("c")
		await optionByText(page, "Cherry").click()

		await expect(chipsOf(wrap)).toHaveCount(3)
		await expect(page.locator("#multi-value")).toHaveAttribute("data-value", "apple,banana,cherry")
	})

	test("backspace on empty input removes the last chip", async ({page}) => {
		// Prefilled fixture starts with apple + banana — easier baseline for this test
		const wrap = wrapById(page, "prefilled")
		await expect(chipsOf(wrap)).toHaveCount(2)

		await inputOf(wrap).click()
		// Input is empty; backspace should remove the last chip (banana)
		await page.keyboard.press("Backspace")

		await expect(chipsOf(wrap)).toHaveCount(1)
		await expect(chipsOf(wrap).first()).toContainText("Apple")
		await expect(page.locator("#prefilled-value")).toHaveAttribute("data-value", "apple")
	})

	test("clicking a chip's remove button removes only that chip", async ({page}) => {
		const wrap = wrapById(page, "prefilled")
		await expect(chipsOf(wrap)).toHaveCount(2)

		// Remove the first chip (apple); banana should remain
		await chipsOf(wrap).first().locator(".chip-remove").click()

		await expect(chipsOf(wrap)).toHaveCount(1)
		await expect(chipsOf(wrap).first()).toContainText("Banana")
		await expect(page.locator("#prefilled-value")).toHaveAttribute("data-value", "banana")
	})
})

// =============================================================================
// initial options
// =============================================================================

test("initial options: focus shows top N before typing", async ({page}) => {
	await open(page, "initial")

	// initialOptionsCount=5 in fixture
	await expect(optionsList(page)).toBeVisible()
	await expect(optionItems(page)).toHaveCount(5)
})

// =============================================================================
// maxSelectedOptions cap
// =============================================================================

test("maxSelectedOptions: fourth selection is rejected", async ({page}) => {
	const wrap = await open(page, "max")

	for (const text of ["Apple", "Banana", "Cherry"]) {
		await inputOf(wrap).fill(text.slice(0, 3).toLowerCase())
		await optionByText(page, text).click()
		await inputOf(wrap).click()
	}
	await expect(chipsOf(wrap)).toHaveCount(3)

	// Attempt a fourth — the cap should close the dropdown after the 3rd pick,
	// so typing reopens it. The component guards selectOption() against exceeding
	// maxSelectedOptions, so the click is a no-op even if the option renders.
	await inputOf(wrap).fill("date")
	const dateOption = optionByText(page, "Date")
	if (await dateOption.count() > 0) {
		await dateOption.click()
	}

	await expect(chipsOf(wrap)).toHaveCount(3)
	await expect(page.locator("#max-value")).toHaveAttribute("data-value", "apple,banana,cherry")
})

// =============================================================================
// async onoptionssearch
// =============================================================================

test("async search: each keystroke (after gate) triggers the callback", async ({page}) => {
	const wrap = await open(page, "async")

	await inputOf(wrap).fill("ap")
	await expect(optionByText(page, "Apple")).toBeVisible()

	// The fixture renders #async-call-count with data-value reflecting the
	// number of invocations. We assert at least one call landed.
	const count = await page.locator("#async-call-count").getAttribute("data-value")
	expect(Number(count)).toBeGreaterThanOrEqual(1)
})

// =============================================================================
// minSearchLength gate
// =============================================================================

test("minSearchLength=3: dropdown stays closed for 1–2 characters", async ({page}) => {
	const wrap = wrapById(page, "minlen")

	await inputOf(wrap).click()
	await inputOf(wrap).fill("a")
	await expect(optionsList(page)).toBeHidden()

	await inputOf(wrap).fill("ap")
	await expect(optionsList(page)).toBeHidden()

	await inputOf(wrap).fill("app")
	await expect(optionsList(page)).toBeVisible()
	await expect(optionByText(page, "Apple")).toBeVisible()
})

// =============================================================================
// disabled option
// =============================================================================

test("disabled option: rendered with disabled attribute + class", async ({page}) => {
	const wrap = await open(page, "disabled-opt")

	await inputOf(wrap).fill("coco")
	const coconut = optionByText(page, "Coconut")
	await expect(coconut).toBeVisible()
	// We render `disabled={option.disabled}` on the <button>, plus a `disabled`
	// class. Asserting these is enough — the browser itself blocks the click,
	// which is not our code to test.
	await expect(coconut).toHaveAttribute("disabled", "")
	await expect(coconut).toHaveClass(/disabled/)
})

// =============================================================================
// disabled / readonly component
// =============================================================================

test.describe("disabled / readonly component", () => {
	test("disabled: input is disabled and clicking does not open the dropdown", async ({page}) => {
		const wrap = wrapById(page, "disabled-comp")
		await expect(inputOf(wrap)).toBeDisabled()

		await inputOf(wrap).click({force: true})
		await expect(optionsList(page)).toBeHidden()
	})

	test("readonly: input is readonly and clicking does not open the dropdown", async ({page}) => {
		const wrap = wrapById(page, "readonly-comp")
		await expect(inputOf(wrap)).toHaveAttribute("readonly", "")

		await inputOf(wrap).click()
		await expect(optionsList(page)).toBeHidden()
	})
})

// =============================================================================
// label / required / labelTemplate
// =============================================================================

test.describe("label rendering", () => {
	test("label + required: renders <label> text and a `*` indicator", async ({page}) => {
		const wrap = wrapById(page, "labeled")
		const label = wrap.locator("label.fluent-label")
		await expect(label).toBeVisible()
		await expect(label).toContainText("Fruit")
		await expect(label.locator(".required-indicator")).toHaveText("*")
	})

	test("labelTemplate: custom snippet renders in place of label text", async ({page}) => {
		const wrap = wrapById(page, "label-tpl")
		await expect(wrap.locator('[data-testid="custom-label"]')).toBeVisible()
		await expect(wrap.locator('[data-testid="custom-label"]')).toContainText("(custom)")
	})
})

// =============================================================================
// tagsPosition variants
// =============================================================================

test.describe("tagsPosition", () => {
	test("'above': selected-options block is the first child (above input)", async ({page}) => {
		const wrap = wrapById(page, "tags-above")
		// Two chips already prefilled. .selected-options should be a sibling
		// rendered before .autocomplete-input-container in the container.
		const container = wrap.locator(".autocomplete-container")
		const firstChild = container.locator("> :first-child")
		await expect(firstChild).toHaveClass(/selected-options/)
	})

	test("'below': selected-options block is the last child (below input)", async ({page}) => {
		const wrap = wrapById(page, "tags-below")
		const container = wrap.locator(".autocomplete-container")
		const lastChild = container.locator("> :last-child")
		await expect(lastChild).toHaveClass(/selected-options/)
	})
})

// =============================================================================
// keepOpen
// =============================================================================

test("keepOpen multi: dropdown stays open after picking an option via keyboard", async ({page}) => {
	// NOTE: `keepOpen` only works for keyboard-driven selection. Mouse clicks on
	// the (portaled) `.option-item` bubble to the document and trigger
	// `handleClickOutside` → `closeDropdown` before the `selectOption` keepOpen
	// branch matters. This is a known limitation, tracked in FINDINGS.md.
	const wrap = await open(page, "keepopen")

	await inputOf(wrap).fill("a")
	await inputOf(wrap).press("ArrowDown")
	await inputOf(wrap).press("Enter")

	await expect(chipsOf(wrap)).toHaveCount(1)
	await expect(optionsList(page)).toBeVisible()
})

// =============================================================================
// selectValueOnTab
// =============================================================================

test("selectValueOnTab=false: Tab does NOT pick the highlighted option", async ({page}) => {
	const wrap = await open(page, "no-tab")

	await inputOf(wrap).fill("ap")
	await expect(optionByText(page, "Apple")).toBeVisible()
	// ArrowDown highlights first option
	await inputOf(wrap).press("ArrowDown")
	// Tab should NOT pick when selectValueOnTab=false
	await inputOf(wrap).press("Tab")

	await expect(chipsOf(wrap)).toHaveCount(0)
})

// =============================================================================
// maxOptionsSearch
// =============================================================================

test("maxOptionsSearch=2: at most 2 options rendered even if more match", async ({page}) => {
	const wrap = await open(page, "limited")

	// Many fruits contain 'a' — apple, apricot, banana, blackberry, blueberry,
	// date, grape, mango. Without the cap we'd see ≥6. With cap=2, exactly 2.
	await inputOf(wrap).fill("a")
	await expect(optionItems(page)).toHaveCount(2)
})

// =============================================================================
// showOverlayOnEmptyResults
// =============================================================================

test("showOverlayOnEmptyResults=false: empty-result search keeps dropdown closed", async ({page}) => {
	const wrap = await open(page, "no-empty-overlay")

	await inputOf(wrap).fill("zzzz")
	await expect(optionsList(page)).toBeHidden()
})

test("showOverlayOnEmptyResults default (true): empty-result search shows 'No results found'", async ({page}) => {
	const wrap = await open(page, "multi")

	await inputOf(wrap).fill("zzzz")
	await expect(optionsList(page)).toBeVisible()
	await expect(page.locator(".no-results")).toContainText("No results found")
})

// =============================================================================
// immediateDelay (debounce)
// =============================================================================

test("immediateDelay=300: rapid typing collapses into a single callback after the delay", async ({page}) => {
	const wrap = wrapById(page, "debounced")

	await inputOf(wrap).click()
	// Type quickly — each keystroke schedules a fresh timer that supersedes the
	// previous one (filterOptions clears the pending debounceTimer first).
	await inputOf(wrap).pressSequentially("apple", {delay: 30})

	// Before the debounce fires, count should still be 0
	const midCount = await page.locator("#debounced-call-count").getAttribute("data-value")
	expect(Number(midCount)).toBe(0)

	// Wait for the debounce window to elapse and dropdown to appear
	await expect(optionByText(page, "Apple")).toBeVisible()
	const finalCount = await page.locator("#debounced-call-count").getAttribute("data-value")
	expect(Number(finalCount)).toBe(1)
})

// =============================================================================
// initialSearchQuery
// =============================================================================

test("initialSearchQuery: dropdown opens with the seeded query on mount", async ({page}) => {
	// initial-query lives on its own route (the $effect that opens the
	// dropdown would otherwise put a second portaled overlay on the shared
	// fixture page).
	await page.goto("/test/autocomplete/initial-query", {waitUntil: "networkidle"})

	// The $effect that seeds searchText and opens the dropdown runs after
	// mount. Wait for the input to render first.
	const input = page.locator(".autocomplete-native-input")
	await input.waitFor({state: "attached"})

	await expect(input).toHaveValue("ban")
	await expect(optionsList(page)).toBeVisible()
	await expect(optionByText(page, "Banana")).toBeVisible()
	// 'Cherry' / 'Mango' / 'Apple' don't match 'ban'
	await expect(optionByText(page, "Cherry")).toHaveCount(0)
})

// =============================================================================
// header / footer / option templates
// =============================================================================

test.describe("slot rendering", () => {
	test("headerContent + footerContent: rendered inside the options list", async ({page}) => {
		const wrap = wrapById(page, "slots")
		// pressSequentially simulates real keystrokes — Playwright's .fill()
		// occasionally doesn't fire the `input` event in a way Svelte 5 sees
		// on this codebase, so the dropdown wouldn't open. The slow path is
		// 30ms per character.
		await inputOf(wrap).click()
		await inputOf(wrap).pressSequentially("a", {delay: 30})

		await expect(optionsList(page)).toBeVisible()
		await expect(page.locator('[data-testid="header-slot"]')).toBeVisible()
		await expect(page.locator('[data-testid="footer-slot"]')).toBeVisible()
		const header = optionsList(page).locator('[data-testid="header-slot"]')
		const footer = optionsList(page).locator('[data-testid="footer-slot"]')
		await expect(header).toHaveCount(1)
		await expect(footer).toHaveCount(1)
	})

	test("optionTemplate: each option uses the custom snippet", async ({page}) => {
		const wrap = wrapById(page, "option-tpl")
		await inputOf(wrap).click()
		await inputOf(wrap).pressSequentially("a", {delay: 30})

		await expect(optionsList(page)).toBeVisible()
		const custom = page.locator('[data-testid="custom-option"]')
		await expect(custom.first()).toContainText("★")
		const optionCount = await optionItems(page).count()
		await expect(custom).toHaveCount(optionCount)
	})

	test("startIcon + endIcon: rendered inside the input container", async ({page}) => {
		const wrap = wrapById(page, "icons")
		await expect(wrap.locator('[data-testid="start-icon"]')).toBeVisible()
		await expect(wrap.locator('[data-testid="end-icon"]')).toBeVisible()
		await expect(wrap.locator(".input-start")).toContainText("🔍")
		await expect(wrap.locator(".input-end")).toContainText("▼")
	})
})

// =============================================================================
// keyboard navigation
// =============================================================================

test.describe("keyboard", () => {
	test("ArrowDown highlights first option; Enter picks it", async ({page}) => {
		const wrap = await open(page, "multi")

		await inputOf(wrap).fill("ap")
		await inputOf(wrap).press("ArrowDown")

		const firstOption = optionItems(page).first()
		await expect(firstOption).toHaveClass(/highlighted/)

		await inputOf(wrap).press("Enter")

		await expect(chipsOf(wrap)).toHaveCount(1)
		await expect(chipsOf(wrap).first()).toContainText("Apple")
	})

	test("Escape closes the dropdown and clears the search text", async ({page}) => {
		const wrap = await open(page, "multi")

		await inputOf(wrap).fill("apricot")
		await expect(optionsList(page)).toBeVisible()
		await inputOf(wrap).press("Escape")

		await expect(optionsList(page)).toBeHidden()
		await expect(inputOf(wrap)).toHaveValue("")
	})

	test("Ctrl+Space opens the dropdown with all (unselected) options", async ({page}) => {
		const wrap = wrapById(page, "multi")
		await inputOf(wrap).click()
		// Empty input + no showInitialOptions → no dropdown yet
		await expect(optionsList(page)).toBeHidden()

		await inputOf(wrap).press("Control+ ")
		await expect(optionsList(page)).toBeVisible()
		// maxOptionsSearch default is 9
		await expect(optionItems(page)).toHaveCount(9)
	})
})

// =============================================================================
// max-message + ondismissed + outside-click
// =============================================================================

test("max-message: renders when maxSelectedOptions cap is reached (multi mode)", async ({page}) => {
	const wrap = await open(page, "max")

	for (const text of ["Apple", "Banana", "Cherry"]) {
		await inputOf(wrap).fill(text.slice(0, 3).toLowerCase())
		await optionByText(page, text).click()
		await inputOf(wrap).click()
	}

	await expect(wrap.locator(".max-message")).toBeVisible()
	await expect(wrap.locator(".max-message")).toContainText("Maximum 3 selections")
})

test("outside-click closes the dropdown and fires ondismissed", async ({page}) => {
	const wrap = await open(page, "dismiss")

	await inputOf(wrap).fill("a")
	await expect(optionsList(page)).toBeVisible()
	const before = Number(await page.locator("#dismiss-count").getAttribute("data-value"))

	// Click on the H1 — definitely outside
	await page.locator("h1").click()

	await expect(optionsList(page)).toBeHidden()
	const after = Number(await page.locator("#dismiss-count").getAttribute("data-value"))
	expect(after).toBeGreaterThan(before)
})

// =============================================================================
// loading indicator (slow async)
// =============================================================================

test("loading indicator: visible while onoptionssearch promise is in flight", async ({page}) => {
	const wrap = wrapById(page, "slow-async")

	await inputOf(wrap).click()
	// pressSequentially so the input fires events progressively — the loading
	// indicator should appear during the 400ms callback.
	await inputOf(wrap).pressSequentially("ap", {delay: 30})

	// Race the indicator against the eventual options — we want to see it
	// while the promise is still pending.
	await expect(wrap.locator(".loading-indicator")).toBeVisible()
	// And eventually disappear once results arrive
	await expect(optionByText(page, "Apple")).toBeVisible()
	await expect(wrap.locator(".loading-indicator")).toBeHidden()
})

// =============================================================================
// clear button (single mode)
// =============================================================================

test("clear button (single mode): appears after pick; click clears the input", async ({page}) => {
	const wrap = await open(page, "single")

	await inputOf(wrap).fill("ban")
	await optionByText(page, "Banana").click()
	await expect(inputOf(wrap)).toHaveValue("Banana")

	const clear = wrap.locator(".clear-button")
	await expect(clear).toBeVisible()
	await clear.click()

	await expect(inputOf(wrap)).toHaveValue("")
	await expect(page.locator("#single-value")).toHaveAttribute("data-value", "")
})
