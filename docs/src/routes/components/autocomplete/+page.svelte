<script lang="ts">
	import { Autocomplete, Stack, Grid, GridItem, Card, QuickGrid, Icon } from "svelte-fluentui"
	import { countries } from "$lib/demo-data/datasets"

	const colors = [
		{ value: "red", text: "Red" },
		{ value: "blue", text: "Blue" },
		{ value: "green", text: "Green" },
		{ value: "yellow", text: "Yellow" },
		{ value: "purple", text: "Purple" },
		{ value: "orange", text: "Orange" },
		{ value: "pink", text: "Pink" },
		{ value: "brown", text: "Brown" },
		{ value: "black", text: "Black" },
		{ value: "white", text: "White" }
	]

	const programmingLanguages = [
		{ value: "js", text: "JavaScript" },
		{ value: "ts", text: "TypeScript" },
		{ value: "py", text: "Python" },
		{ value: "java", text: "Java" },
		{ value: "cs", text: "C#" },
		{ value: "cpp", text: "C++" },
		{ value: "go", text: "Go" },
		{ value: "rust", text: "Rust" },
		{ value: "swift", text: "Swift" },
		{ value: "kotlin", text: "Kotlin" }
	]

	// People data with icons
	const people = [
		{ value: "1", text: "John Doe", email: "john.doe@example.com", icon: "Person" },
		{ value: "2", text: "Jane Smith", email: "jane.smith@example.com", icon: "Person" },
		{ value: "3", text: "Bob Johnson", email: "bob.johnson@example.com", icon: "Person" },
		{ value: "4", text: "Alice Williams", email: "alice.williams@example.com", icon: "Person" },
		{ value: "5", text: "Charlie Brown", email: "charlie.brown@example.com", icon: "Person" }
	]

	// Popular countries for initial options
	const popularCountries = [
		{ value: "us", text: "United States" },
		{ value: "uk", text: "United Kingdom" },
		{ value: "ca", text: "Canada" },
		{ value: "de", text: "Germany" },
		{ value: "fr", text: "France" }
	]

	// State for examples
	let basicValue = $state<string[]>([])
	let preselectedValue = $state<string[]>(["us", "uk"])
	let singleSelectValue = $state<string[]>([])
	let maxSelectValue = $state<string[]>([])
	let keepOpenValue = $state<string[]>([])
	let asyncValue = $state<string[]>([])
	let initialOptionsValue = $state<string[]>([])
	let debounceValue = $state<string[]>([])
	let minSearchLengthValue = $state<string[]>([])
	let minSearchLengthCalls = $state<number>(0)
	let disabledValue = $state<string[]>(["us"])
	let readonlyValue = $state<string[]>(["uk", "ca"])
	let requiredValue = $state<string[]>([])
	let filledValue = $state<string[]>([])
	let outlineValue = $state<string[]>([])
	let widthValue = $state<string[]>([])
	let templateValue = $state<string[]>([])
	let headerFooterValue = $state<string[]>([])
	let iconValue = $state<string[]>([])
	let endIconValue = $state<string[]>([])
	let callbackValue = $state<string[]>([])
	let callbackMessage = $state<string>("")
	let dismissedMessage = $state<string>("")
	let selectOnTabValue = $state<string[]>([])
	let tagsInlineValue = $state<string[]>(["us", "uk"])
	let tagsAboveValue = $state<string[]>(["red", "blue"])
	let tagsBelowValue = $state<string[]>(["js", "ts"])

	async function handleAsyncSearch(searchText: string) {
		await new Promise(resolve => setTimeout(resolve, 500))
		return countries.filter(c =>
			c.text.toLowerCase().includes(searchText.toLowerCase())
		)
	}

	// Alias kept for the "initial options" example — now just hits the full list
	const handleCountrySearch = handleAsyncSearch

	// Search used by the minSearchLength demo — counts calls so we can show
	// that the function is NOT invoked for sub-threshold queries.
	async function handleMinSearchLengthSearch(searchText: string) {
		minSearchLengthCalls += 1
		await new Promise(resolve => setTimeout(resolve, 300))
		return countries.filter(c =>
			c.text.toLowerCase().includes(searchText.toLowerCase())
		)
	}

	async function handlePeopleSearch(searchText: string) {
		await new Promise(resolve => setTimeout(resolve, 400))
		return people.filter(p =>
			p.text.toLowerCase().includes(searchText.toLowerCase()) ||
			p.email.toLowerCase().includes(searchText.toLowerCase())
		)
	}

	function handleSelectionChange(selected: string[]) {
		callbackMessage = `Selection changed: ${selected.length > 0 ? selected.join(", ") : "None"}`
	}

	function handleDismissed() {
		dismissedMessage = `Dropdown closed at ${new Date().toLocaleTimeString()}`
	}

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "selectedOptions", type: "T[]", default: "[]", description: "Array of selected values (bindable)"},
		{name: "options", type: "OptionItem[]", default: "[]", description: "Available options for selection"},
		{name: "placeholder", type: "string", default: '"Type to search..."', description: "Placeholder text for input"},
		{name: "label", type: "string", default: "undefined", description: "Label text above component"},
		{name: "disabled", type: "boolean", default: "false", description: "Disable the component"},
		{name: "readonly", type: "boolean", default: "false", description: "Read-only mode"},
		{name: "required", type: "boolean", default: "false", description: "Mark field as required"},
		{name: "autofocus", type: "boolean", default: "undefined", description: "Auto focus on mount"},
		{name: "appearance", type: "string", default: "undefined", description: "Visual style (filled, outline)"},
		{name: "autocomplete", type: "string", default: "undefined", description: "Browser autocomplete behavior"},
		{name: "multiple", type: "boolean", default: "undefined", description: "Explicitly enable multi-select mode"},
		{name: "maxSelectedOptions", type: "number", default: "undefined", description: "Max selections allowed (1 = single-select)"},
		{name: "maxOptionsSearch", type: "number", default: "9", description: "Max options shown in dropdown"},
		{name: "minSearchLength", type: "number", default: "undefined", description: "Minimum typed characters before search runs. Below the threshold, onoptionssearch is NOT called and the dropdown stays closed."},
		{name: "showOverlayOnEmptyResults", type: "boolean", default: "true", description: "Show dropdown on no results"},
		{name: "showInitialOptions", type: "boolean", default: "false", description: "Show options on focus when empty"},
		{name: "initialOptionsCount", type: "number", default: "maxOptionsSearch", description: "Initial options count limit"},
		{name: "keepOpen", type: "boolean", default: "false", description: "Keep dropdown open after selection"},
		{name: "selectValueOnTab", type: "boolean", default: "true", description: "Select highlighted option on Tab key"},
		{name: "tagsPosition", type: '"inline" | "above" | "below"', default: '"inline"', description: "Position of selected tags: inside input (inline), above input, or below input"},
		{name: "immediateDelay", type: "number", default: "0", description: "Debounce delay in ms before search"},
		{name: "loading", type: "boolean", default: "undefined", description: "External loading state control"},
		{name: "id", type: "string", default: "undefined", description: "Element ID"},
		{name: "title", type: "string", default: "undefined", description: "Tooltip text"},
		{name: "ariaLabel", type: "string", default: "undefined", description: "Accessibility label"},
		{name: "width", type: "string", default: "undefined", description: "Component width"},
		{name: "height", type: "string", default: "undefined", description: "Component height"},
		{name: "class", type: "string", default: '""', description: "Additional CSS classes"},
		{name: "style", type: "string", default: '""', description: "Inline styles"}
	]

	const callbacks: Property[] = [
		{name: "onoptionssearch", type: "(searchText: string) => Promise<OptionItem[]> | OptionItem[]", default: "undefined", description: "Called when user types to search. Return filtered options (sync or async). If omitted, built-in case-insensitive contains filter is used."},
		{name: "onselectedoptionschange", type: "(selected: T[]) => void", default: "undefined", description: "Called when the selected options array changes (item added or removed)."},
		{name: "ondismissed", type: "() => void", default: "undefined", description: "Called when the dropdown closes."}
	]

	const slots: Property[] = [
		{name: "labelTemplate", type: "Snippet", default: "undefined", description: "Custom label content rendered above the input. Replaces the plain text label prop when provided."},
		{name: "optionTemplate", type: "Snippet<[OptionItem]>", default: "undefined", description: "Custom rendering for each option in the dropdown list. Receives the OptionItem as a parameter."},
		{name: "headerContent", type: "Snippet", default: "undefined", description: "Custom content rendered at the top of the dropdown overlay, above the option list."},
		{name: "footerContent", type: "Snippet", default: "undefined", description: "Custom content rendered at the bottom of the dropdown overlay, below the option list."},
		{name: "startIcon", type: "Snippet", default: "undefined", description: "Decorative content (typically an icon) rendered at the start (left) of the input."},
		{name: "endIcon", type: "Snippet", default: "undefined", description: "Decorative content rendered at the end (right) of the input. The auto-rendered clear button and loading spinner take precedence — endIcon shows only when neither is active."}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Autocomplete</h1>

	<p>
		The Autocomplete component provides multiple selection with tag/chip display and custom filtering.
		Inspired by the FluentUI Blazor Autocomplete component.
	</p>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Not available in FluentUI Web Components">FluentUI Web Component (N/A)</span>
			|
			<a href="https://www.fluentui-blazor.net/Autocomplete" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
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
		<h2>OptionItem Type</h2>
		<pre><code>{`type OptionItem<T = any> = {
  value: T          // Unique identifier
  text: string      // Display text
  disabled?: boolean // Optional disabled state
}`}</code></pre>
	</Card>

	<Card>
		<h2>Examples</h2>

		<h3>Default</h3>
		<Grid columns={3} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Basic</strong>
					<Autocomplete
						bind:selectedOptions={basicValue}
						options={countries}
						label="Select countries"
						placeholder="Type to search..."
					/>
					<small>Selected: {basicValue.join(", ") || "None"}</small>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Pre-selected</strong>
					<Autocomplete
						bind:selectedOptions={preselectedValue}
						options={countries}
						label="Countries"
					/>
					<small>Selected: {preselectedValue.join(", ") || "None"}</small>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Single-select (maxSelectedOptions=1)</strong>
					<Autocomplete
						bind:selectedOptions={singleSelectValue}
						options={colors}
						maxSelectedOptions={1}
						label="Select a color"
						placeholder="Choose one..."
					/>
					<small>Selected: {singleSelectValue[0] || "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Tags Position</h3>
		<p>Control where selected tags appear using the <code>tagsPosition</code> prop. Default is <code>"inline"</code> (inside the input field, like FluentUI Blazor).</p>
		<Grid columns={3} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Inline (default)</strong>
					<small style="color: var(--neutral-foreground-hint);">Tags appear inside the input field</small>
					<Autocomplete
						bind:selectedOptions={tagsInlineValue}
						options={countries}
						tagsPosition="inline"
						label="Countries"
						placeholder="Search..."
					/>
					<small>Selected: {tagsInlineValue.join(", ") || "None"}</small>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Above</strong>
					<small style="color: var(--neutral-foreground-hint);">Tags appear above the input field</small>
					<Autocomplete
						bind:selectedOptions={tagsAboveValue}
						options={colors}
						tagsPosition="above"
						label="Colors"
						placeholder="Search..."
					/>
					<small>Selected: {tagsAboveValue.join(", ") || "None"}</small>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Below</strong>
					<small style="color: var(--neutral-foreground-hint);">Tags appear below the input field</small>
					<Autocomplete
						bind:selectedOptions={tagsBelowValue}
						options={programmingLanguages}
						tagsPosition="below"
						label="Languages"
						placeholder="Search..."
					/>
					<small>Selected: {tagsBelowValue.join(", ") || "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Multiple = false</h3>
		<p>When the <code>multiple</code> prop is explicitly set to <code>false</code>, it behaves like a single-select autocomplete.</p>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Explicit single-select</strong>
					<Autocomplete
						bind:selectedOptions={singleSelectValue}
						options={colors}
						multiple={false}
						label="Select a color"
						placeholder="Choose one..."
					/>
					<small>Selected: {singleSelectValue[0] || "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Many Items</h3>
		<p>Use <code>maxOptionsSearch</code> to control the dropdown display and limit results.</p>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Max 5 options shown</strong>
					<Autocomplete
						bind:selectedOptions={asyncValue}
						onoptionssearch={handleAsyncSearch}
						maxOptionsSearch={5}
						label="Search countries"
						placeholder="Type to search..."
					/>
					<small>Selected: {asyncValue.join(", ") || "None"}</small>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>With max selections</strong>
					<Autocomplete
						bind:selectedOptions={maxSelectValue}
						options={colors}
						maxSelectedOptions={3}
						label="Select up to 3 colors"
					/>
					<small>Selected ({maxSelectValue.length}/3): {maxSelectValue.join(", ") || "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Close via code</h3>
		<p>Use <code>keepOpen</code> to control whether the dropdown closes after selection.</p>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>keepOpen = true</strong>
					<Autocomplete
						bind:selectedOptions={keepOpenValue}
						options={programmingLanguages}
						keepOpen={true}
						label="Programming languages"
						placeholder="Type to search..."
					/>
					<small>Selected: {keepOpenValue.join(", ") || "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Different object instances from search results</h3>
		<p>Show initial options before user types, then use async search for full dataset.</p>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Initial popular options</strong>
					<Autocomplete
						bind:selectedOptions={initialOptionsValue}
						options={popularCountries}
						onoptionssearch={handleCountrySearch}
						showInitialOptions={true}
						initialOptionsCount={5}
						label="Select country"
						placeholder="Select from popular or search all..."
					/>
					<small>Selected: {initialOptionsValue.join(", ") || "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>States</h3>
		<Grid columns={3} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Disabled</strong>
					<Autocomplete
						bind:selectedOptions={disabledValue}
						options={countries}
						disabled={true}
						label="Disabled"
					/>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Readonly</strong>
					<Autocomplete
						bind:selectedOptions={readonlyValue}
						options={countries}
						readonly={true}
						label="Readonly"
					/>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Required</strong>
					<Autocomplete
						bind:selectedOptions={requiredValue}
						options={countries}
						required={true}
						label="Required"
					/>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Appearance</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Outline (default)</strong>
					<Autocomplete
						bind:selectedOptions={outlineValue}
						options={colors}
						appearance="outline"
						label="Outline appearance"
					/>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Filled</strong>
					<Autocomplete
						bind:selectedOptions={filledValue}
						options={colors}
						appearance="filled"
						label="Filled appearance"
					/>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Width</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Custom width (300px)</strong>
					<Autocomplete
						bind:selectedOptions={widthValue}
						options={colors}
						width="300px"
						label="Fixed width"
					/>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Full width (100%)</strong>
					<Autocomplete
						options={colors}
						width="100%"
						label="Full width"
					/>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Debounce (immediateDelay)</h3>
		<p>Use <code>immediateDelay</code> to add a debounce delay before triggering search.</p>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>300ms delay</strong>
					<Autocomplete
						bind:selectedOptions={debounceValue}
						onoptionssearch={handleAsyncSearch}
						immediateDelay={300}
						label="Search with debounce"
						placeholder="Type to search (300ms delay)..."
					/>
					<small>Selected: {debounceValue.join(", ") || "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Minimum search length</h3>
		<p>Use <code>minSearchLength</code> to skip the search entirely until the user has typed enough characters. Below the threshold, <code>onoptionssearch</code> is never invoked — essential when searching against large/expensive backends.</p>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>minSearchLength={3}</strong>
					<small style="color: var(--neutral-foreground-hint);">The call counter stays at 0 until you type 3 characters.</small>
					<Autocomplete
						bind:selectedOptions={minSearchLengthValue}
						onoptionssearch={handleMinSearchLengthSearch}
						minSearchLength={3}
						immediateDelay={200}
						label="Search countries"
						placeholder="Type at least 3 characters..."
					/>
					<small>Search calls fired: <strong>{minSearchLengthCalls}</strong></small>
					<small>Selected: {minSearchLengthValue.join(", ") || "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Option Template</h3>
		<p>Use <code>optionTemplate</code> snippet to customize how options are rendered.</p>
		<Grid columns={1} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<Autocomplete
						bind:selectedOptions={templateValue}
						onoptionssearch={handlePeopleSearch}
						label="Search people"
						placeholder="Search by name or email..."
					>
						{#snippet optionTemplate(option)}
							<div style="display: flex; align-items: center; gap: 0.5rem;">
								<Icon name="person" size={16} />
								<div>
									<div>{option.text}</div>
									<small style="color: var(--neutral-foreground-hint);">{(option as any).email}</small>
								</div>
							</div>
						{/snippet}
					</Autocomplete>
					<small>Selected: {templateValue.join(", ") || "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Header and Footer Content</h3>
		<p>Use <code>headerContent</code> and <code>footerContent</code> snippets for custom dropdown sections.</p>
		<Grid columns={1} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<Autocomplete
						bind:selectedOptions={headerFooterValue}
						options={colors}
						showInitialOptions={true}
						label="Select colors"
					>
						{#snippet headerContent()}
							<div style="font-weight: 600; color: var(--accent-fill-rest);">
								Popular choices
							</div>
						{/snippet}
						{#snippet footerContent()}
							<div style="font-size: 0.75rem; color: var(--neutral-foreground-hint);">
								{colors.length} options available
							</div>
						{/snippet}
					</Autocomplete>
					<small>Selected: {headerFooterValue.join(", ") || "None"}</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Start &amp; End Icons</h3>
		<p>
			Use the <code>startIcon</code> and <code>endIcon</code> snippets to render decorative content (typically icons) inside the input.
			The auto-rendered clear button and loading spinner take precedence over <code>endIcon</code>, so a search icon yields to a clear button when something is selected.
		</p>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Search icon (startIcon)</strong>
					<Autocomplete
						bind:selectedOptions={iconValue}
						options={colors}
						showInitialOptions={true}
						label="Search colors"
						placeholder="Type to search..."
					>
						{#snippet startIcon()}
							<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
								<path d="M11.5 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm-.82 4.74a6 6 0 1 1 1.06-1.06l3.04 3.03a.75.75 0 1 1-1.06 1.06l-3.04-3.03Z" />
							</svg>
						{/snippet}
					</Autocomplete>
					<small>Selected: {iconValue.join(", ") || "None"}</small>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Filter icon (endIcon)</strong>
					<Autocomplete
						bind:selectedOptions={endIconValue}
						options={colors}
						showInitialOptions={true}
						label="Filter colors"
						placeholder="Filter..."
					>
						{#snippet endIcon()}
							<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
								<path d="M2.5 3a.5.5 0 0 0-.4.8l4.4 5.87V13a.5.5 0 0 0 .29.45l2 .92A.5.5 0 0 0 9.5 14V9.67l4.4-5.87A.5.5 0 0 0 13.5 3h-11Z" />
							</svg>
						{/snippet}
					</Autocomplete>
					<small>Selected: {endIconValue.join(", ") || "None"} &nbsp;<em style="color: var(--neutral-foreground-hint);">(pick a value — clear button replaces the filter icon)</em></small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Select Value on Tab</h3>
		<p>Control whether Tab key selects the highlighted option with <code>selectValueOnTab</code>.</p>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>selectValueOnTab = true (default)</strong>
					<Autocomplete
						bind:selectedOptions={selectOnTabValue}
						options={colors}
						selectValueOnTab={true}
						label="Tab to select"
						placeholder="Use arrow keys then Tab..."
					/>
					<small>Selected: {selectOnTabValue.join(", ") || "None"}</small>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>selectValueOnTab = false</strong>
					<Autocomplete
						options={colors}
						selectValueOnTab={false}
						label="Tab moves focus"
						placeholder="Tab will move to next field..."
					/>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Callbacks</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>onselectedoptionschange</strong>
					<Autocomplete
						bind:selectedOptions={callbackValue}
						options={colors}
						onselectedoptionschange={handleSelectionChange}
						label="Select colors"
					/>
					<small>{callbackMessage || "Make a selection..."}</small>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>ondismissed</strong>
					<Autocomplete
						options={colors}
						ondismissed={handleDismissed}
						showInitialOptions={true}
						label="Open then close dropdown"
					/>
					<small>{dismissedMessage || "Close the dropdown..."}</small>
				</Stack>
			</GridItem>
		</Grid>
	</Card>

	<Card>
		<h2>Usage Examples</h2>

		<h3>Basic Usage</h3>
		<pre><code>{`<script lang="ts">
  import { Autocomplete } from "svelte-fluentui"

  const options = [
    { value: "1", text: "Option 1" },
    { value: "2", text: "Option 2" },
    { value: "3", text: "Option 3" }
  ]

  let selected = $state<string[]>([])
</script>

<Autocomplete
  bind:selectedOptions={selected}
  options={options}
  label="Select options"
  placeholder="Type to search..."
/>`}</code></pre>

		<h3>With Async Search</h3>
		<pre><code>{`<script lang="ts">
  async function searchItems(searchText: string) {
    const response = await fetch(\`/api/search?q=\${searchText}\`)
    const data = await response.json()
    return data.map(item => ({
      value: item.id,
      text: item.name
    }))
  }

  let selected = $state<string[]>([])
</script>

<Autocomplete
  bind:selectedOptions={selected}
  onoptionssearch={searchItems}
  label="Search items"
  immediateDelay={300}
/>`}</code></pre>

		<h3>Custom Option Template</h3>
		<pre><code>{`<Autocomplete
  bind:selectedOptions={selected}
  options={people}
  label="Select person"
>
  {#snippet optionTemplate(option)}
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <Icon name="person" size={16} />
      <span>{option.text}</span>
    </div>
  {/snippet}
</Autocomplete>`}</code></pre>
	</Card>
</Stack>

<style>
	pre {
		background: var(--neutral-layer-3);
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		margin: 1rem 0;
	}

	pre code {
		background: none;
		padding: 0;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	code {
		background: var(--neutral-layer-3);
		padding: 0.125rem 0.375rem;
		border-radius: 3px;
		font-size: 0.875rem;
	}
</style>
