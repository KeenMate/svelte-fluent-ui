<script lang="ts">
	import {Autocomplete, Card, Stack} from "svelte-fluentui"

	// Sample data
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
		{ value: "kotlin", text: "Kotlin" },
		{ value: "php", text: "PHP" },
		{ value: "ruby", text: "Ruby" }
	]

	let selectedCountries = $state<string[]>(["us", "uk"])
	let selectedColors = $state<string[]>([])
	let selectedLanguages = $state<string[]>([])
	let customSearchResults = $state<string[]>([])
	let peopleResults = $state<string[]>([])

	// Simulate async search
	async function handleCustomSearch(searchText: string) {
		// Simulate API delay
		await new Promise(resolve => setTimeout(resolve, 300))

		// Filter based on search
		return countries.filter(c =>
			c.text.toLowerCase().includes(searchText.toLowerCase())
		)
	}

	// Simulate people search
	async function handlePeopleSearch(searchText: string) {
		await new Promise(resolve => setTimeout(resolve, 400))

		const people = [
			{ value: "1", text: "John Doe (john.doe@example.com)" },
			{ value: "2", text: "Jane Smith (jane.smith@example.com)" },
			{ value: "3", text: "Bob Johnson (bob.johnson@example.com)" },
			{ value: "4", text: "Alice Williams (alice.williams@example.com)" },
			{ value: "5", text: "Charlie Brown (charlie.brown@example.com)" }
		]

		return people.filter(p =>
			p.text.toLowerCase().includes(searchText.toLowerCase())
		)
	}
</script>

<h1>Autocomplete</h1>

<p>
	The Autocomplete component provides multiple selection with tag/chip display and custom filtering.
	Inspired by the FluentUI Blazor Autocomplete component.
</p>

<Card>
	<h3>Reference</h3>
	<p>
		<strong>FluentUI Web Components:</strong> N/A (custom implementation)<br/>
		<strong>FluentUI Blazor:</strong> <a href="https://www.fluentui-blazor.net/Autocomplete" target="_blank" rel="noopener noreferrer">FluentAutocomplete</a>
	</p>
</Card>

<h2>Examples</h2>

<!-- Basic Autocomplete -->
<Card>
	<h3>Basic Autocomplete</h3>
	<p>Select multiple countries. Uses default "contains" filtering.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem;">
		<Autocomplete
			bind:selectedOptions={selectedCountries}
			options={countries}
			label="Select countries"
			placeholder="Type to search countries..."
		/>
		<p style="margin: 0;">Selected: {selectedCountries.join(", ") || "None"}</p>
	</Stack>
</Card>

<!-- With Maximum Selections -->
<Card>
	<h3>With Maximum Selections</h3>
	<p>Limit selection to maximum 3 colors.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem;">
		<Autocomplete
			bind:selectedOptions={selectedColors}
			options={colors}
			label="Select up to 3 colors"
			placeholder="Type to search colors..."
			maxSelectedOptions={3}
		/>
		<p style="margin: 0;">
			Selected ({selectedColors.length}/3): {selectedColors.join(", ") || "None"}
		</p>
	</Stack>
</Card>

<!-- Keep Open After Selection -->
<Card>
	<h3>Keep Open After Selection</h3>
	<p>Dropdown stays open after selecting an item.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem;">
		<Autocomplete
			bind:selectedOptions={selectedLanguages}
			options={programmingLanguages}
			label="Programming languages"
			placeholder="Type to search..."
			keepOpen={true}
		/>
		<p style="margin: 0;">Selected: {selectedLanguages.join(", ") || "None"}</p>
	</Stack>
</Card>

<!-- Custom Async Search -->
<Card>
	<h3>Custom Async Search</h3>
	<p>Uses custom search function with simulated API delay. Shows loading indicator.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem;">
		<Autocomplete
			bind:selectedOptions={customSearchResults}
			onOptionsSearch={handleCustomSearch}
			label="Search countries (async)"
			placeholder="Type to search..."
			maxOptionsSearch={5}
		/>
		<p style="margin: 0;">Selected: {customSearchResults.join(", ") || "None"}</p>
	</Stack>
</Card>

<!-- People Picker Example -->
<Card>
	<h3>People Picker</h3>
	<p>Autocomplete styled as a people picker with email addresses.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem;">
		<Autocomplete
			bind:selectedOptions={peopleResults}
			onOptionsSearch={handlePeopleSearch}
			label="Add people"
			placeholder="Search by name or email..."
			maxSelectedOptions={3}
		/>
		<p style="margin: 0;">
			Selected: {peopleResults.length > 0 ? peopleResults.join(", ") : "None"}
		</p>
	</Stack>
</Card>

<!-- Different Appearances -->
<Card>
	<h3>Different Appearances</h3>
	<p>Autocomplete with different visual styles.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem;">
		<Autocomplete
			options={colors}
			label="Filled (default)"
			placeholder="Search colors..."
		/>

		<Autocomplete
			options={colors}
			label="Outline"
			placeholder="Search colors..."
			appearance="outline"
		/>
	</Stack>
</Card>

<!-- States -->
<Card>
	<h3>States</h3>
	<p>Autocomplete in different states.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem;">
		<Autocomplete
			options={countries}
			label="Normal"
			placeholder="Type to search..."
		/>

		<Autocomplete
			options={countries}
			label="Disabled"
			placeholder="Type to search..."
			disabled={true}
		/>

		<Autocomplete
			selectedOptions={["us"]}
			options={countries}
			label="Readonly"
			placeholder="Type to search..."
			readonly={true}
		/>

		<Autocomplete
			options={countries}
			label="Required"
			placeholder="Type to search..."
			required={true}
		/>
	</Stack>
</Card>

<!-- Custom Width -->
<Card>
	<h3>Custom Width</h3>
	<p>Autocomplete with custom width.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem;">
		<Autocomplete
			options={colors}
			label="Small width"
			placeholder="Search..."
			width="300px"
		/>

		<Autocomplete
			options={colors}
			label="Full width"
			placeholder="Search..."
			width="100%"
		/>
	</Stack>
</Card>

<h2>API</h2>

<Card>
	<h3>Properties</h3>
	<table class="api-table">
		<thead>
			<tr>
				<th>Property</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>selectedOptions</code></td>
				<td><code>T[]</code></td>
				<td><code>[]</code></td>
				<td>Array of selected option values (bindable)</td>
			</tr>
			<tr>
				<td><code>options</code></td>
				<td><code>OptionItem[]</code></td>
				<td><code>[]</code></td>
				<td>Available options for selection</td>
			</tr>
			<tr>
				<td><code>placeholder</code></td>
				<td><code>string</code></td>
				<td><code>"Type to search..."</code></td>
				<td>Placeholder text for search input</td>
			</tr>
			<tr>
				<td><code>label</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Label text for the component</td>
			</tr>
			<tr>
				<td><code>disabled</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Disable the component</td>
			</tr>
			<tr>
				<td><code>readonly</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Make component read-only</td>
			</tr>
			<tr>
				<td><code>required</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Mark field as required</td>
			</tr>
			<tr>
				<td><code>appearance</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Visual style (filled, outline)</td>
			</tr>
			<tr>
				<td><code>maxSelectedOptions</code></td>
				<td><code>number</code></td>
				<td><code>undefined</code></td>
				<td>Maximum number of selections allowed</td>
			</tr>
			<tr>
				<td><code>maxOptionsSearch</code></td>
				<td><code>number</code></td>
				<td><code>9</code></td>
				<td>Maximum options to display in dropdown</td>
			</tr>
			<tr>
				<td><code>showOverlayOnEmptyResults</code></td>
				<td><code>boolean</code></td>
				<td><code>true</code></td>
				<td>Show dropdown when no results found</td>
			</tr>
			<tr>
				<td><code>keepOpen</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Keep dropdown open after selection</td>
			</tr>
			<tr>
				<td><code>width</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>Custom width (e.g., "300px", "100%")</td>
			</tr>
			<tr>
				<td><code>onOptionsSearch</code></td>
				<td><code>Function</code></td>
				<td><code>undefined</code></td>
				<td>Custom search function (async supported)</td>
			</tr>
			<tr>
				<td><code>onSelectedOptionsChange</code></td>
				<td><code>Function</code></td>
				<td><code>undefined</code></td>
				<td>Called when selection changes</td>
			</tr>
		</tbody>
	</table>

	<h3>OptionItem Type</h3>
	<pre><code>{`type OptionItem<T = any> = {
  value: T          // Unique identifier
  text: string      // Display text
  disabled?: boolean // Optional disabled state
}`}</code></pre>

	<h3>Custom Search Function</h3>
	<pre><code>{`onOptionsSearch?: (searchText: string) => Promise<OptionItem[]> | OptionItem[]`}</code></pre>
	<p>
		Provide a custom function to filter or fetch options based on search text.
		Can return options synchronously or asynchronously (Promise).
		Results are automatically limited to <code>maxOptionsSearch</code>.
	</p>
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
	<pre><code>&lt;script lang="ts"&gt;
  async function searchItems(searchText: string) &#123;
    const response = await fetch(`/api/search?q=$&#123;searchText&#125;`)
    const data = await response.json()
    return data.map(item => (&#123;
      value: item.id,
      text: item.name
    &#125;))
  &#125;

  let selected = $state&lt;string[]&gt;([])
&lt;/script&gt;

&lt;Autocomplete
  bind:selectedOptions=&#123;selected&#125;
  onOptionsSearch=&#123;searchItems&#125;
  label="Search items"
  placeholder="Type to search..."
  maxOptionsSearch=&#123;10&#125;
/&gt;</code></pre>

	<h3>People Picker</h3>
	<pre><code>{`<Autocomplete
  bind:selectedOptions={selectedPeople}
  onOptionsSearch={searchPeople}
  label="Add team members"
  placeholder="Search by name or email..."
  maxSelectedOptions={5}
/>`}</code></pre>
</Card>

<style>
	h1 {
		font-size: 2rem;
		margin: 0 0 2rem 0;
		font-weight: 600;
	}

	h2 {
		font-size: 1.5rem;
		margin: 2rem 0 1rem 0;
		font-weight: 600;
	}

	h3 {
		font-size: 1.25rem;
		margin: 0 0 1rem 0;
		font-weight: 600;
	}

	p {
		margin: 0 0 0.5rem 0;
		line-height: 1.5;
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
</style>
