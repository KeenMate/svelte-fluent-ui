<script lang="ts">
	import { Autocomplete, Stack, Grid, GridItem, Card, QuickGrid, Icon } from "svelte-fluentui"

	// Sample data - countries
	const countries = [
		{ value: "us", text: "United States" },
		{ value: "uk", text: "United Kingdom" },
		{ value: "ca", text: "Canada" },
		{ value: "au", text: "Australia" },
		{ value: "de", text: "Germany" },
		{ value: "fr", text: "France" },
		{ value: "it", text: "Italy" },
		{ value: "es", text: "Spain" },
		{ value: "jp", text: "Japan" },
		{ value: "cn", text: "China" },
		{ value: "in", text: "India" },
		{ value: "br", text: "Brazil" },
		{ value: "mx", text: "Mexico" },
		{ value: "ru", text: "Russia" },
		{ value: "za", text: "South Africa" }
	]

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
	let disabledValue = $state<string[]>(["us"])
	let readonlyValue = $state<string[]>(["uk", "ca"])
	let requiredValue = $state<string[]>([])
	let filledValue = $state<string[]>([])
	let outlineValue = $state<string[]>([])
	let widthValue = $state<string[]>([])
	let templateValue = $state<string[]>([])
	let headerFooterValue = $state<string[]>([])
	let callbackValue = $state<string[]>([])
	let callbackMessage = $state<string>("")
	let dismissedMessage = $state<string>("")
	let selectOnTabValue = $state<string[]>([])
	let tagsInlineValue = $state<string[]>(["us", "uk"])
	let tagsAboveValue = $state<string[]>(["red", "blue"])
	let tagsBelowValue = $state<string[]>(["js", "ts"])

	// Async search handler
	async function handleAsyncSearch(searchText: string) {
		await new Promise(resolve => setTimeout(resolve, 500))
		return countries.filter(c =>
			c.text.toLowerCase().includes(searchText.toLowerCase())
		)
	}

	// Full country search (for initial options example)
	async function handleCountrySearch(searchText: string) {
		await new Promise(resolve => setTimeout(resolve, 300))
		const allCountries = [
			...countries,
			{ value: "ar", text: "Argentina" },
			{ value: "eg", text: "Egypt" },
			{ value: "gr", text: "Greece" },
			{ value: "id", text: "Indonesia" },
			{ value: "ie", text: "Ireland" },
			{ value: "kr", text: "South Korea" },
			{ value: "nl", text: "Netherlands" },
			{ value: "no", text: "Norway" },
			{ value: "nz", text: "New Zealand" },
			{ value: "pl", text: "Poland" }
		]
		return allCountries.filter(c =>
			c.text.toLowerCase().includes(searchText.toLowerCase())
		)
	}

	// People search
	async function handlePeopleSearch(searchText: string) {
		await new Promise(resolve => setTimeout(resolve, 400))
		return people.filter(p =>
			p.text.toLowerCase().includes(searchText.toLowerCase()) ||
			p.email.toLowerCase().includes(searchText.toLowerCase())
		)
	}

	// Callback handlers
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
		{name: "labelTemplate", type: "Snippet", default: "undefined", description: "Custom label content"},
		{name: "disabled", type: "boolean", default: "false", description: "Disable the component"},
		{name: "readonly", type: "boolean", default: "false", description: "Read-only mode"},
		{name: "required", type: "boolean", default: "false", description: "Mark field as required"},
		{name: "autofocus", type: "boolean", default: "undefined", description: "Auto focus on mount"},
		{name: "appearance", type: "string", default: "undefined", description: "Visual style (filled, outline)"},
		{name: "autocomplete", type: "string", default: "undefined", description: "Browser autocomplete behavior"},
		{name: "multiple", type: "boolean", default: "undefined", description: "Explicitly enable multi-select mode"},
		{name: "maxSelectedOptions", type: "number", default: "undefined", description: "Max selections allowed (1 = single-select)"},
		{name: "maxOptionsSearch", type: "number", default: "9", description: "Max options shown in dropdown"},
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
		{name: "style", type: "string", default: '""', description: "Inline styles"},
		{name: "headerContent", type: "Snippet", default: "undefined", description: "Custom header in dropdown"},
		{name: "footerContent", type: "Snippet", default: "undefined", description: "Custom footer in dropdown"},
		{name: "optionTemplate", type: "Snippet<[OptionItem]>", default: "undefined", description: "Custom option rendering"},
		{name: "onoptionssearch", type: "Function", default: "undefined", description: "Custom search function"},
		{name: "onselectedoptionschange", type: "Function", default: "undefined", description: "Called when selection changes"},
		{name: "ondismissed", type: "Function", default: "undefined", description: "Called when dropdown closes"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]

	type Callback = {
		name: string
		signature: string
		description: string
	}

	const callbacks: Callback[] = [
		{name: "onoptionssearch", signature: "(searchText: string) => Promise<OptionItem[]> | OptionItem[]", description: "Called when user types to search. Return filtered options (sync or async). If omitted, built-in case-insensitive contains filter is used."},
		{name: "onselectedoptionschange", signature: "(selected: T[]) => void", description: "Called when the selected options array changes (item added or removed)."},
		{name: "ondismissed", signature: "() => void", description: "Called when the dropdown closes."}
	]

	const callbackColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "signature", title: "Signature", sortable: false, filterable: false},
		{field: "description", title: "Description", filterable: true}
	]

	type SlotItem = {
		name: string
		type: string
		description: string
	}

	const slots: SlotItem[] = [
		{name: "labelTemplate", type: "Snippet", description: "Custom label content rendered above the input. Replaces the plain text label prop when provided."},
		{name: "optionTemplate", type: "Snippet<[OptionItem]>", description: "Custom rendering for each option in the dropdown list. Receives the OptionItem as a parameter."},
		{name: "headerContent", type: "Snippet", description: "Custom content rendered at the top of the dropdown overlay, above the option list."},
		{name: "footerContent", type: "Snippet", description: "Custom content rendered at the bottom of the dropdown overlay, below the option list."}
	]

	const slotColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
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
			N/A (custom implementation)
			|
			<a href="https://www.fluentui-blazor.net/Autocomplete" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<h2>API</h2>

	<Grid columns={1} gap="1rem">
		<GridItem>
			<Card>
				<h3>Properties</h3>
				<QuickGrid items={properties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem>
			<Card>
				<h3>Callbacks</h3>
				<QuickGrid items={callbacks} columns={callbackColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem>
			<Card>
				<h3>Slots</h3>
				<QuickGrid items={slots} columns={slotColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h3>OptionItem Type</h3>
		<pre><code>{`type OptionItem<T = any> = {
  value: T          // Unique identifier
  text: string      // Display text
  disabled?: boolean // Optional disabled state
}`}</code></pre>
	</Card>

	<h2>Examples</h2>

	<!-- Default Examples -->
	<Card>
		<h3>Default</h3>
		<Grid columns={3} gap="1rem" style="margin-top: 1rem;">
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
	</Card>

	<!-- Tags Position -->
	<Card>
		<h3>Tags Position</h3>
		<p>Control where selected tags appear using the <code>tagsPosition</code> prop. Default is <code>"inline"</code> (inside the input field, like FluentUI Blazor).</p>
		<Grid columns={3} gap="1rem" style="margin-top: 1rem;">
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
	</Card>

	<!-- Multiple = false -->
	<Card>
		<h3>Multiple = false</h3>
		<p>When the <code>multiple</code> prop is explicitly set to <code>false</code>, it behaves like a single-select autocomplete.</p>
		<Grid columns={2} gap="1rem" style="margin-top: 1rem;">
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
	</Card>

	<!-- Many Items -->
	<Card>
		<h3>Many Items</h3>
		<p>Use <code>maxOptionsSearch</code> to control the dropdown display and limit results.</p>
		<Grid columns={2} gap="1rem" style="margin-top: 1rem;">
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
	</Card>

	<!-- Close via code -->
	<Card>
		<h3>Close via code</h3>
		<p>Use <code>keepOpen</code> to control whether the dropdown closes after selection.</p>
		<Grid columns={2} gap="1rem" style="margin-top: 1rem;">
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
	</Card>

	<!-- Initial Options -->
	<Card>
		<h3>Different object instances from search results</h3>
		<p>Show initial options before user types, then use async search for full dataset.</p>
		<Grid columns={2} gap="1rem" style="margin-top: 1rem;">
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
	</Card>

	<!-- Disabled States -->
	<Card>
		<h3>States</h3>
		<Grid columns={3} gap="1rem" style="margin-top: 1rem;">
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
	</Card>

	<!-- Appearance -->
	<Card>
		<h3>Appearance</h3>
		<Grid columns={2} gap="1rem" style="margin-top: 1rem;">
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
	</Card>

	<!-- Width -->
	<Card>
		<h3>Width</h3>
		<Grid columns={2} gap="1rem" style="margin-top: 1rem;">
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
	</Card>

	<!-- Debounce / Immediate Delay -->
	<Card>
		<h3>Debounce (immediateDelay)</h3>
		<p>Use <code>immediateDelay</code> to add a debounce delay before triggering search.</p>
		<Grid columns={2} gap="1rem" style="margin-top: 1rem;">
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
	</Card>

	<!-- Option Template -->
	<Card>
		<h3>Option Template</h3>
		<p>Use <code>optionTemplate</code> snippet to customize how options are rendered.</p>
		<Grid columns={1} gap="1rem" style="margin-top: 1rem;">
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
	</Card>

	<!-- Header/Footer Content -->
	<Card>
		<h3>Header and Footer Content</h3>
		<p>Use <code>headerContent</code> and <code>footerContent</code> snippets for custom dropdown sections.</p>
		<Grid columns={1} gap="1rem" style="margin-top: 1rem;">
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
	</Card>

	<!-- Select on Tab -->
	<Card>
		<h3>Select Value on Tab</h3>
		<p>Control whether Tab key selects the highlighted option with <code>selectValueOnTab</code>.</p>
		<Grid columns={2} gap="1rem" style="margin-top: 1rem;">
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
	</Card>

	<!-- Callbacks -->
	<Card>
		<h3>Callbacks</h3>
		<Grid columns={2} gap="1rem" style="margin-top: 1rem;">
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

	<h2>Usage Examples</h2>

	<Card>
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
	h1 {
		font-size: 2rem;
		margin: 0;
		font-weight: 600;
	}

	h2 {
		font-size: 1.5rem;
		margin: 1.5rem 0 0 0;
		font-weight: 600;
	}

	h3 {
		font-size: 1.25rem;
		margin: 0 0 0.5rem 0;
		font-weight: 600;
	}

	p {
		margin: 0 0 0.5rem 0;
		line-height: 1.5;
	}

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
