<script lang="ts">
	import { Combobox, Option, Stack, Grid, GridItem, Card, QuickGrid, Icon, Slider } from "svelte-fluentui";
	import {References, Meta} from "$lib/components";
	import { songs } from "$lib/demo-data/datasets";

	// Sample data - sizes
	const sizes = [
		{ value: "small", label: "Small" },
		{ value: "medium", label: "Medium" },
		{ value: "large", label: "Large" }
	]

	// Long list for scroll example
	const longList = Array.from({ length: 20 }, (_, i) => ({
		value: `item-${i + 1}`,
		label: `Item ${i + 1}`
	}))

	// People data for option template example
	const people = [
		{ value: "1", firstName: "Jean", lastName: "Martin" },
		{ value: "2", firstName: "António", lastName: "Langa" },
		{ value: "3", firstName: "Julie", lastName: "Smith" },
		{ value: "4", firstName: "Nur", lastName: "Sari" },
		{ value: "5", firstName: "Jose", lastName: "Hernandez" },
		{ value: "6", firstName: "Bert", lastName: "de Vries" },
		{ value: "7", firstName: "Jaques", lastName: "Martin" },
		{ value: "8", firstName: "Elizabeth", lastName: "Johnson" },
		{ value: "9", firstName: "Jakob", lastName: "Berger" }
	]

	// Names with diacritics for testing autocomplete
	const namesWithDiacritics = [
		{ value: "1", label: "José García" },
		{ value: "2", label: "François Müller" },
		{ value: "3", label: "Søren Østergård" },
		{ value: "4", label: "Jiří Dvořák" },
		{ value: "5", label: "Zoë Brontë" },
		{ value: "6", label: "Renée Lefèvre" },
		{ value: "7", label: "Håkon Ødegård" },
		{ value: "8", label: "Ñoño Peña" },
		{ value: "9", label: "Łukasz Wójcik" },
		{ value: "10", label: "Ágnes Németh" },
		{ value: "11", label: "Günther Größe" },
		{ value: "12", label: "Beyoncé Knowles" },
		{ value: "13", label: "Chloë Sevigny" },
		{ value: "14", label: "Fañch Le Hénaff" },
		{ value: "15", label: "Anaïs Dupont" }
	]

	// Grouped options (the `group` field sections them under headers). Long
	// enough that the dropdown scrolls, so PageUp/PageDown are demonstrable too.
	const groupedFoods = [
		{ value: "salt", label: "Salt" },   // ungrouped -> leading section
		{ value: "pepper", label: "Pepper", disabled: true },
		{ value: "apple", label: "Apple", group: "Fruit" },
		{ value: "apricot", label: "Apricot", group: "Fruit" },
		{ value: "banana", label: "Banana", group: "Fruit" },
		{ value: "blueberry", label: "Blueberry", group: "Fruit" },
		{ value: "cherry", label: "Cherry", group: "Fruit" },
		{ value: "grape", label: "Grape", group: "Fruit" },
		{ value: "mango", label: "Mango (out of season)", group: "Fruit", disabled: true },
		{ value: "carrot", label: "Carrot", group: "Vegetable" },
		{ value: "celery", label: "Celery", group: "Vegetable" },
		{ value: "potato", label: "Potato", group: "Vegetable" },
		{ value: "pumpkin", label: "Pumpkin (out of season)", group: "Vegetable", disabled: true },
		{ value: "spinach", label: "Spinach", group: "Vegetable" },
		{ value: "zucchini", label: "Zucchini", group: "Vegetable" },
		{ value: "tofu", label: "Tofu" }, // ungrouped, kept in place between groups
		{ value: "brie", label: "Brie", group: "Dairy" },
		{ value: "cheddar", label: "Cheddar", group: "Dairy" },
		{ value: "gouda", label: "Gouda", group: "Dairy" },
		{ value: "yogurt", label: "Yogurt", group: "Dairy" }
	]

	// State for each example
	let groupedValue = $state<string[]>([])
	let basicValue = $state<string[]>([])
	let preselectedValue = $state<string[]>(["3"])
	let placeholderValue = $state<string[]>([])
	let stringValue = $state<string[]>([])
	let intValue = $state<string[]>([])
	let disabledValue = $state<string[]>(["medium"])
	let disabledItemsValue = $state<string[]>([])
	let allDisabledValue = $state<string[]>(["small"])
	let filledValue = $state<string[]>([])
	let inlineValue = $state<string[]>([])
	let listValue = $state<string[]>([])
	let bothValue = $state<string[]>([])
	let longListValue = $state<string[]>([])
	let aboveValue = $state<string[]>([])
	let belowValue = $state<string[]>([])
	let templateValue = $state<string[]>([])
	let widthValue = $state<string[]>([])
	let maxHeightValue = $state<string[]>([])
	let maxHeightPx = $state(240)
	let dropdownWidthValue = $state<string[]>([])
	let dropdownWidthPx = $state(360)
	let callbackValue = $state<string[]>([])
	let callbackMessage = $state<string>("")
	let diacriticsValue = $state<string[]>([])
	let minSearchValue = $state<string[]>([])

	// Callback handler example
	function handleSelectionChange(value: string[]) {
		callbackMessage = `Selection changed to: ${value[0] || "None"}`
	}

	// --- Async search (onsearch) — parent owns the data ---
	let asyncValue = $state<string[]>([])
	let asyncOptions = $state<{ value: string; label: string }[]>([])
	let asyncLoading = $state(false)
	let asyncTimer: ReturnType<typeof setTimeout> | undefined
	function searchNames(query: string) {
		const q = query.trim().toLowerCase()
		if (asyncTimer) clearTimeout(asyncTimer)
		if (!q) {
			asyncLoading = false
			asyncOptions = []
			return
		}
		asyncLoading = true
		// Simulate a server round-trip.
		asyncTimer = setTimeout(() => {
			asyncOptions = namesWithDiacritics.filter((n) =>
				n.label.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").includes(q)
			)
			asyncLoading = false
		}, 700)
	}

	// --- Custom matcher (filter) — subsequence ("fuzzy") match on the label ---
	let fuzzyValue = $state<string[]>([])
	// Fold accents to plain ASCII. NFD strips combining marks (é → e), but some
	// Latin letters (ø, ł, æ, ß, …) don't decompose, so map those explicitly —
	// that's what lets "soren" match "Søren Østergård".
	function fold(s: string): string {
		return s
			.toLowerCase()
			.normalize("NFD")
			.replace(/\p{Diacritic}/gu, "")
			.replace(/ø/g, "o")
			.replace(/ł/g, "l")
			.replace(/đ/g, "d")
			.replace(/æ/g, "ae")
			.replace(/œ/g, "oe")
			.replace(/ß/g, "ss")
	}
	function fuzzyFilter(query: string, option: { label: string }): boolean {
		const q = fold(query).replace(/\s+/g, "")
		if (!q) return true
		const label = fold(option.label)
		let i = 0
		for (const ch of label) {
			if (ch === q[i]) i++
			if (i === q.length) return true
		}
		return false
	}

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "id", type: "string", default: "Required", description: "Unique identifier"},
		{name: "value", type: "string[]", default: "[]", description: "Selected value(s) (bindable)"},
		{name: "options", type: "OptionItem[]", default: "undefined", description: "Array of option items"},
		{name: "label", type: "string", default: "undefined", description: "Label text displayed above the combobox"},
		{name: "placeholder", type: "string", default: "undefined", description: "Placeholder text"},
		{name: "autocomplete", type: '"inline" | "list" | "both" | "none"', default: "undefined", description: "Autocomplete behavior"},
		{name: "minSearchLength", type: "number", default: "undefined", description: "Keep dropdown closed until the typed text reaches this length. Useful with large/async option sets to avoid opening on a single character."},
		{name: "noDataText", type: "string", default: '"No results found"', description: "Text shown inside the dropdown when the filter matches no options."},
		{name: "noDataTemplate", type: "Snippet", default: "undefined", description: "Custom content shown when the filter matches no options; overrides noDataText."},
		{name: "onsearch", type: "(query: string) => void", default: "undefined", description: "Debounced notification that the query changed. When set, update options with the results yourself; the component skips its own client-side filtering."},
		{name: "searchDelay", type: "number", default: "250", description: "Debounce in ms before onsearch fires. Ignored without onsearch."},
		{name: "filter", type: "(query, option) => boolean", default: "undefined", description: "Custom client-side matcher replacing the built-in substring match. Ignored when onsearch is set."},
		{name: "loading", type: "boolean", default: "undefined", description: "Parent-controlled loading flag for async onsearch; shows loadingText instead of the empty-state message while true."},
		{name: "loadingText", type: "string", default: '"Searching…"', description: "Text shown while loading is true."},
		{name: "position", type: '"above" | "below"', default: "undefined", description: "Dropdown position"},
		{name: "appearance", type: '"outline" | "filled"', default: "outline", description: "Visual style"},
		{name: "disabled", type: "boolean", default: "false", description: "Disable the combobox"},
		{name: "required", type: "boolean", default: "false", description: "Required field"},
		{name: "open", type: "boolean", default: "false", description: "Dropdown open state"},
		{name: "autofocus", type: "boolean", default: "false", description: "Auto focus on mount"},
		{name: "name", type: "string", default: "undefined", description: "Form field name"},
		{name: "ariaLabel", type: "string", default: "undefined", description: "Accessibility label (aria-label)"},
		{name: "title", type: "string", default: "undefined", description: "Tooltip text"},
		{name: "width", type: "string", default: "undefined", description: "Component width (e.g., '300px', '100%')"},
		{name: "height", type: "string", default: "undefined", description: "Component height"},
		{name: "maxDropdownHeight", type: "string", default: "undefined (280px cap)", description: "Cap the dropdown listbox height (e.g. '240px', '50vh'). Always also capped to the viewport-available space, whichever is smaller."},
		{name: "dropdownWidth", type: "string", default: "undefined (matches control)", description: "Width of the dropdown listbox (e.g. '360px'). When unset the list matches the control width; when set it uses this width instead."},
		{name: "class", type: "string", default: '""', description: "Additional CSS classes"},
		{name: "style", type: "string", default: '""', description: "Inline styles"}
	]

	const callbacks: Property[] = [
		{name: "onchange", type: "(value: string[]) => void", default: "undefined", description: "Called when selection changes"}
	]

	const slots: Property[] = [
		{name: "children", type: "Snippet", default: "undefined", description: "Option components (alternative to the options prop)"},
		{name: "labelTemplate", type: "Snippet", default: "undefined", description: "Custom label content rendered above the combobox"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<Meta
		title="Combobox"
		description="A Svelte wrapper for FluentUI's combobox web component — an input widget with a popup that lets users pick a value from a collection."
		keywords="svelte, fluentui, combobox, dropdown, autocomplete, select, form"
	/>

	<h1>Combobox</h1>

	<p>
		A combobox is an input widget with an associated popup that enables users to select a value from
		a collection of possible values.
	</p>

	<References links={[
		{label: "FluentUI Web Component", href: "https://storybooks.fluentui.dev/web-components/?path=/docs/components-combobox--docs"},
		{label: "FluentUI Blazor", href: "https://www.fluentui-blazor.net/Combobox"}
	]} />

	<Card>
		<h2>Examples</h2>

		<h3>Default examples</h3>
		<Grid columns={3} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<Combobox id="basic" bind:value={basicValue} options={songs} label="Select the best song" />
					<small>Selected: {basicValue[0] || "None"}</small>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<Combobox id="preselected" bind:value={preselectedValue} options={songs} label="Pre-selected option" />
					<small>Selected: {preselectedValue[0] || "None"}</small>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<Combobox id="placeholder" bind:value={placeholderValue} options={songs} label="With Placeholder" placeholder="Please select a song..." />
					<small>Selected: {placeholderValue[0] || "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>From a list of Option&lt;T&gt; items</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>From list of Option&lt;string&gt; items</strong>
					<Combobox id="string-options" bind:value={stringValue} options={songs} />
					<small>Selected Value: {stringValue[0] || "None"}</small>
					<small>Selected Item: {stringValue[0] ? songs.find(s => s.value === stringValue[0])?.label : "None"}</small>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>From list of Option&lt;int&gt; items</strong>
					<small style="color: var(--neutral-foreground-hint);">First item disabled. None initially selected.</small>
					<Combobox id="int-options" bind:value={intValue}>
						<Option value="1" disabled>Type 1</Option>
						<Option value="2">Type 2</Option>
						<Option value="3">Type 3</Option>
					</Combobox>
					<small>Selected Value: {intValue[0] || "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Disabled examples</h3>
		<Grid columns={3} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Disabled Combobox</strong>
					<Combobox id="disabled" bind:value={disabledValue} options={sizes} disabled />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>With disabled items</strong>
					<Combobox id="disabled-items" bind:value={disabledItemsValue}>
						<Option value="small">Small</Option>
						<Option value="medium" disabled>Medium</Option>
						<Option value="large">Large</Option>
					</Combobox>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>All items disabled</strong>
					<Combobox id="all-disabled" bind:value={allDisabledValue}>
						<Option value="small" disabled>Small</Option>
						<Option value="medium" disabled>Medium</Option>
						<Option value="large" disabled>Large</Option>
					</Combobox>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Appearance example</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Filled</strong>
					<Combobox id="filled" bind:value={filledValue} options={sizes} appearance="filled" />
					<small>Selected: {filledValue[0] || "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Autocomplete examples</h3>
		<Grid columns={3} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Inline Autocomplete</strong>
					<Combobox id="inline" bind:value={inlineValue} options={songs} autocomplete="inline" />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>List Autocomplete</strong>
					<Combobox id="list" bind:value={listValue} options={songs} autocomplete="list" />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Both Autocomplete</strong>
					<Combobox id="both" bind:value={bothValue} options={songs} autocomplete="both" />
				</Stack>
			</GridItem>
		</Grid>
		<Stack orientation="vertical" gap="0.5rem" style="margin-top: 1rem;">
			<strong>Diacritics Test</strong>
			<small style="color: var(--neutral-foreground-hint);">Try typing: jose, francois, soren, jiri, etc.</small>
			<Combobox id="diacritics" bind:value={diacriticsValue} options={namesWithDiacritics} autocomplete="list" width="300px" />
			<small>Selected: {diacriticsValue[0] ? namesWithDiacritics.find(n => n.value === diacriticsValue[0])?.label : "None"}</small>
		</Stack>

		<h3>Minimum search length</h3>
		<p>Use <code>minSearchLength</code> to keep the dropdown closed until the user has typed at least N characters. Useful against large or async option sets where opening on a single character would be wasteful.</p>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>minSearchLength={2}</strong>
					<small style="color: var(--neutral-foreground-hint);">Type one character — dropdown stays closed. Type a second — it opens.</small>
					<Combobox id="min-search" bind:value={minSearchValue} options={namesWithDiacritics} autocomplete="list" minSearchLength={2} width="300px" />
					<small>Selected: {minSearchValue[0] ? namesWithDiacritics.find(n => n.value === minSearchValue[0])?.label : "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Grouped options &amp; keyboard navigation</h3>
		<p>
			Add a <code>group</code> field to each item in the <code>options</code> array and the combobox sections
			them under non-interactive headers. Order is preserved exactly as authored — a new header starts
			wherever the <code>group</code> changes, and ungrouped items (e.g. Salt, Pepper at the top and Tofu
			between Vegetable and Dairy) stay right where you put them. As you type, a group's header
			disappears automatically once all of its options filter out. (For <code>&lt;Option&gt;</code> children,
			wrap them in <code>&lt;OptionGroup label="…"&gt;</code> instead.) Headers are inert — the keyboard
			(<kbd>↑</kbd>/<kbd>↓</kbd>, <kbd>PageUp</kbd>/<kbd>PageDown</kbd>, <kbd>Home</kbd>/<kbd>End</kbd>)
			skips straight over them from one option to the next.
		</p>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>options with <code>group</code></strong>
					<small style="color: var(--neutral-foreground-hint);">Type "yog" — only Dairy remains; the Fruit and Vegetable headers vanish. Or open and press PageDown to jump a page at a time.</small>
					<Combobox id="grouped" bind:value={groupedValue} options={groupedFoods} autocomplete="list" width="300px" />
					<small>Selected: {groupedValue[0] ? groupedFoods.find(f => f.value === groupedValue[0])?.label : "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Server-side search (<code>onsearch</code>)</h3>
		<p>
			With <code>onsearch</code> the parent owns the data: the component fires a <strong>debounced</strong>
			callback as you type, you fetch results and update <code>options</code>, and the component skips its
			own client-side filtering (the server already filtered). Pair it with <code>minSearchLength</code> to
			avoid firing on the first character and <code>loading</code> to show a "Searching…" state instead of the
			empty message while the request is in flight.
		</p>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Async, debounced, with loading state</strong>
					<small style="color: var(--neutral-foreground-hint);">Type ≥2 chars (e.g. "jo", "mul"); results arrive after ~700ms.</small>
					<Combobox
						id="async-search"
						bind:value={asyncValue}
						options={asyncOptions}
						onsearch={searchNames}
						loading={asyncLoading}
						minSearchLength={2}
						placeholder="Search names…"
						width="300px"
					/>
					<small>Selected: {asyncValue[0] ? namesWithDiacritics.find(n => n.value === asyncValue[0])?.label : "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Custom matcher (<code>filter</code>)</h3>
		<p>
			The <code>filter</code> prop replaces the built-in diacritic-insensitive substring match with your own
			predicate — here a subsequence ("fuzzy") match, so typing <code>jg</code> matches "<em>J</em>osé
			<em>G</em>arcía". It runs entirely client-side and is ignored when <code>onsearch</code> is set.
		</p>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Fuzzy subsequence match</strong>
					<small style="color: var(--neutral-foreground-hint);">Try: "jg", "fm", "zb" (fuzzy) — or "soren" / "lukasz" (accent-folded).</small>
					<Combobox
						id="fuzzy"
						bind:value={fuzzyValue}
						options={namesWithDiacritics}
						filter={fuzzyFilter}
						autocomplete="list"
						placeholder="Fuzzy search…"
						width="300px"
					/>
					<small>Selected: {fuzzyValue[0] ? namesWithDiacritics.find(n => n.value === fuzzyValue[0])?.label : "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>List examples</h3>
		<Grid columns={3} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>With long list</strong>
					<Combobox id="long-list" bind:value={longListValue} options={longList} />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Position above</strong>
					<Combobox id="above" bind:value={aboveValue} options={sizes} position="above" />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Position below</strong>
					<Combobox id="below" bind:value={belowValue} options={sizes} position="below" />
				</Stack>
			</GridItem>
		</Grid>

		<h3>Option template</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<Combobox id="template" bind:value={templateValue}>
						{#each people as person (person.value)}
							<Option value={person.value} label={`${person.firstName} (${person.lastName})`}>
								<span class="person-option">
									<Icon name="person" size={16} />
									<span>{person.firstName} ({person.lastName})</span>
								</span>
							</Option>
						{/each}
					</Combobox>
					<small>Selected: {templateValue[0] ? people.find(p => p.value === templateValue[0])?.firstName : "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Width and styling</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Custom width (200px)</strong>
					<Combobox id="width-small" bind:value={widthValue} options={sizes} width="200px" />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Full width (100%)</strong>
					<Combobox id="width-full" bind:value={widthValue} options={sizes} width="100%" />
				</Stack>
			</GridItem>
		</Grid>

		<h3>Dropdown max height</h3>
		<p>
			Use <code>maxDropdownHeight</code> to cap the dropdown listbox height (e.g. <code>"240px"</code>, <code>"50vh"</code>).
			The listbox is always <em>also</em> capped to the space available to the viewport edge, so this acts as an
			upper bound — whichever is smaller wins. Drag the slider to change it live, then open the dropdown.
		</p>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<Slider id="cb-maxheight" bind:value={maxHeightPx} min={100} max={400} step={20} label={`maxDropdownHeight: ${maxHeightPx}px`} />
					<Combobox id="maxheight" bind:value={maxHeightValue} options={longList} maxDropdownHeight={`${maxHeightPx}px`} autocomplete="list" width="300px" />
					<small>Open the dropdown — it scrolls once the 20 options exceed {maxHeightPx}px.</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Dropdown width</h3>
		<p>
			By default the dropdown matches the control width. Set <code>dropdownWidth</code> to give the listbox its
			own width — wider than the input (to show long labels) or narrower — independent of the control. Drag the
			slider to change it live, then open the dropdown.
		</p>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<Slider id="cb-ddwidth" bind:value={dropdownWidthPx} min={160} max={520} step={20} label={`dropdownWidth: ${dropdownWidthPx}px`} />
					<Combobox id="ddwidth" bind:value={dropdownWidthValue} options={songs} dropdownWidth={`${dropdownWidthPx}px`} width="220px" />
					<small>The control stays 220px wide; the dropdown is {dropdownWidthPx}px.</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Callback example</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>With onchange callback</strong>
					<Combobox
						id="callback"
						bind:value={callbackValue}
						options={songs}
						onchange={() => handleSelectionChange(callbackValue)}
					/>
					<small>{callbackMessage || "Make a selection to see the callback"}</small>
				</Stack>
			</GridItem>
		</Grid>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Properties</h2>
				<QuickGrid items={properties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Callbacks</h2>
				<QuickGrid items={callbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Slots</h2>
				<QuickGrid items={slots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2>Autocomplete Modes</h2>
		<table class="api-table">
			<thead>
				<tr>
					<th>Mode</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>inline</code></td>
					<td>Autocompletes text in the input field as you type</td>
				</tr>
				<tr>
					<td><code>list</code></td>
					<td>Filters the dropdown list to matching options</td>
				</tr>
				<tr>
					<td><code>both</code></td>
					<td>Combines inline autocomplete with list filtering</td>
				</tr>
			</tbody>
		</table>
	</Card>
</Stack>

<style>
	.person-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.api-table {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
	}

	.api-table th {
		text-align: left;
		padding: 0.75rem;
		background: var(--neutral-layer-3);
		font-weight: 600;
		border-bottom: 2px solid var(--neutral-stroke-rest);
	}

	.api-table td {
		padding: 0.75rem;
		border-bottom: 1px solid var(--neutral-stroke-rest);
	}

	.api-table code {
		background: var(--neutral-layer-3);
		padding: 0.125rem 0.375rem;
		border-radius: 3px;
		font-size: 0.875rem;
	}
</style>
