<script lang="ts">
	import { Search, Stack, Grid, GridItem, Card, QuickGrid, Icon, Button, Checkbox } from "svelte-fluentui";

	// US States data for interactive examples
	const states = [
		"Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
		"Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
		"Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
		"Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
		"New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
		"Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
		"Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
		"Wisconsin", "Wyoming"
	];

	// Interactive search state
	let interactiveQuery = $state("");
	let interactiveResults = $derived(
		interactiveQuery.length > 0
			? states.filter(s => s.toLowerCase().includes(interactiveQuery.toLowerCase()))
			: []
	);
	let lastSearchedQuery = $state("");

	// Interactive with debounce state
	let debounceQuery = $state("");
	let debounceResults = $state<string[]>([]);
	let debounceLastSearched = $state("");

	function handleDebounceSearch(value: string) {
		debounceLastSearched = value;
		debounceResults = value.length > 0
			? states.filter(s => s.toLowerCase().includes(value.toLowerCase()))
			: [];
	}

	// Immediate mode state
	let immediateDelayEnabled = $state(false);
	let immediateQuery = $state("");
	let immediateResults = $state<string[]>([]);
	let immediateLastSearched = $state("");

	function handleImmediateSearch(value: string) {
		immediateLastSearched = value;
		immediateResults = value.length > 0
			? states.filter(s => s.toLowerCase().includes(value.toLowerCase()))
			: [];
	}

	// Focus example
	let focusSearchRef: { focusAsync: (preventScroll?: boolean) => void };

	// Controlled example
	let controlledValue = $state("");

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "appearance", type: '"outline" | "filled"', default: "outline", description: "Gets or sets the visual appearance"},
		{name: "placeholder", type: "string", default: "undefined", description: "Gets or sets the text used on aria label attribute"},
		{name: "autocomplete", type: "string", default: '"off"', description: "Gets or sets whether a form or input field should have autocomplete 'on' or 'off'"},
		{name: "autofocus", type: "bool", default: "false", description: "Determines if the element should receive document focus on page load"},
		{name: "dataList", type: "string", default: "undefined", description: "Allows associating a datalist to the element by id"},
		{name: "disabled", type: "bool", default: "false", description: "Disables the form control, ensuring it doesn't participate in form submission"},
		{name: "displayName", type: "string", default: "undefined", description: "Gets or sets the display name for this field"},
		{name: "immediate", type: "bool", default: "false", description: "Gets or sets if the derived component is embedded in another component"},
		{name: "immediateDelay", type: "int", default: "0", description: "Gets or sets the delay, in milliseconds, before to read the FluentInputBase.ValueChanged event"},
		{name: "label", type: "string", default: "undefined", description: "Gets or sets the text to be used for the input"},
		{name: "labelTemplate", type: "RenderFragment", default: "undefined", description: "Gets or sets the content to be rendered inside the component"},
		{name: "maxlength", type: "int", default: "undefined", description: "Gets or sets the maximum number of characters a user can enter"},
		{name: "minlength", type: "int", default: "undefined", description: "Gets or sets the minimum number of characters a user can enter"},
		{name: "name", type: "string", default: "undefined", description: "Gets or sets the name of the element"},
		{name: "pattern", type: "string", default: "undefined", description: "Regular expression for validated form"},
		{name: "readonly", type: "bool", default: "false", description: "When true, the control will be immutable by user interaction"},
		{name: "required", type: "bool", default: "false", description: "Gets or sets a value indicating whether the element needs to have a value"},
		{name: "size", type: "int", default: "undefined", description: "Gets or sets the size of the text field"},
		{name: "spellcheck", type: "bool", default: "undefined", description: "Gets or sets if spellcheck should be used"},
		{name: "value", type: "string", default: '""', description: "Gets or sets the value of the input. This should be used with two-way binding"},
		{name: "width", type: "string", default: "undefined", description: "Gets or sets the width of the component"},
		{name: "height", type: "string", default: "undefined", description: "Gets or sets the height of the component"},
		{name: "title", type: "string", default: "undefined", description: "Gets or sets the title (tooltip) for the component"}
	]

	const callbacks: Property[] = [
		{name: "onchange", type: "EventCallback<string>", default: "undefined", description: "Gets or sets a callback that updates the bound value"},
		{name: "oninput", type: "EventCallback<string>", default: "undefined", description: "Gets or sets a callback that fires on every input"}
	]

	const methods: Property[] = [
		{name: "focusAsync", type: "void", default: "-", description: "Exposes the elements FocusAsync(bool preventScroll) method"},
		{name: "focusAsync(preventScroll)", type: "bool preventScroll", default: "-", description: "Exposes the elements FocusAsync method with preventScroll parameter"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]

	// Placeholder autofill prevention table
	const placeholderData = [
		{placeholder: "name, email, first, last, nick", prevents: "Personal name fields"},
		{placeholder: "tel, telephone, phone, call me", prevents: "Telephone fields"},
		{placeholder: "address, street, city, zip, postal", prevents: "Address and postal code fields"},
		{placeholder: "user, pin, pass, pwd, login, key, secret", prevents: "User name, PIN, Password and other auth"},
		{placeholder: "payment, card", prevents: "Payment fields"},
		{placeholder: "amount, price, total, sum, qty, cost", prevents: "Money amount, cost of items"},
		{placeholder: "cc, card number, credit, credit card", prevents: "Credit card fields"}
	]

	const placeholderColumns = [
		{field: "placeholder", title: "Placeholder", sortable: true},
		{field: "prevents", title: "Prevents", sortable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Search</h1>

	<p>
		An implementation of a <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input/search" target="_blank" rel="noopener noreferrer">search</a> component. The <code>fluent-search</code> supports two visual appearances, outline and filled, with the control defaulting to the outline appearance.
	</p>

	<p>
		<code>fluent-search</code> wraps the <code>&lt;input type=&quot;search&quot;&gt;</code> element, a web component implementation of a search element leveraging the Fluent UI design system.
	</p>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Not available in FluentUI Web Components Storybook">FluentUI Web Component (N/A)</span>
			|
			<a href="https://www.fluentui-blazor.net/Search" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<h2>Examples</h2>

	<!-- Basic Examples -->
	<Card>
		<h3>Basic</h3>
		<Grid columns={2} gap="1rem" style="margin-top: 1rem;">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Without a label</strong>
					<Search placeholder="Search..." />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>With a label</strong>
					<Search label="label" placeholder="Search..." />
				</Stack>
			</GridItem>
		</Grid>
	</Card>

	<!-- Interactive -->
	<Card>
		<h3>Interactive</h3>
		<Grid columns={1} gap="1rem" style="margin-top: 1rem;">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<Search
						label="Search for State"
						bind:value={interactiveQuery}
						oninput={(val) => { lastSearchedQuery = val; }}
						placeholder="Type a state name..."
					/>
					{#if interactiveResults.length > 0}
						<ul class="results-list">
							{#each interactiveResults.slice(0, 5) as state}
								<li>{state}</li>
							{/each}
						</ul>
					{:else if interactiveQuery.length > 0}
						<p class="no-results">No results</p>
					{/if}
					<p class="searched-text">You searched for: {lastSearchedQuery}</p>
				</Stack>
			</GridItem>
		</Grid>
	</Card>

	<!-- Interactive with Debounce -->
	<Card>
		<h3>Interactive with debounce</h3>
		<Grid columns={1} gap="1rem" style="margin-top: 1rem;">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<Search
						label="Search for name"
						bind:value={debounceQuery}
						immediate={true}
						immediateDelay={500}
						oninput={handleDebounceSearch}
						placeholder="Type to search (500ms debounce)..."
					/>
					{#if debounceResults.length > 0}
						<ul class="results-list">
							{#each debounceResults.slice(0, 5) as state}
								<li>{state}</li>
							{/each}
						</ul>
					{:else if debounceLastSearched.length > 0}
						<p class="no-results">No results</p>
					{/if}
					<p class="searched-text">You searched for: {debounceLastSearched}</p>
				</Stack>
			</GridItem>
		</Grid>
	</Card>

	<!-- Immediate (with and without debounce) -->
	<Card>
		<h3>Immediate (with and without debounce)</h3>
		<Grid columns={1} gap="1rem" style="margin-top: 1rem;">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<Checkbox bind:checked={immediateDelayEnabled}>Immediate Delay</Checkbox>
					<Search
						label="Search for State"
						bind:value={immediateQuery}
						immediate={true}
						immediateDelay={immediateDelayEnabled ? 300 : 0}
						oninput={handleImmediateSearch}
						placeholder="Type to search..."
					/>
					{#if immediateResults.length > 0}
						<ul class="results-list">
							{#each immediateResults.slice(0, 5) as state}
								<li>{state}</li>
							{/each}
						</ul>
					{:else if immediateLastSearched.length > 0}
						<p class="no-results">No results</p>
					{/if}
					<p class="searched-text">You searched for: {immediateLastSearched}</p>
				</Stack>
			</GridItem>
		</Grid>
	</Card>

	<!-- States -->
	<Card>
		<h3>States</h3>
		<Grid columns={3} gap="1rem" style="margin-top: 1rem;">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Full Width</strong>
					<Search width="100%" placeholder="Full width search..." />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Placeholder</strong>
					<Search label="Placeholder" placeholder="Placeholder" />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Required</strong>
					<Search label="Required" required placeholder="Required field..." />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Disabled</strong>
					<Search label="Disabled" disabled value="Cannot edit" />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Read only</strong>
					<Search label="label" readonly value="Some read-only text" />
				</Stack>
			</GridItem>
		</Grid>
	</Card>

	<!-- Icons -->
	<Card>
		<h3>Icons</h3>
		<Grid columns={2} gap="1rem" style="margin-top: 1rem;">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>With start</strong>
					<Search placeholder="Search...">
						{#snippet start()}
							<Icon name="Globe" />
						{/snippet}
					</Search>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>With end</strong>
					<Search placeholder="Search...">
						{#snippet end()}
							<Icon name="Globe" />
						{/snippet}
					</Search>
				</Stack>
			</GridItem>
		</Grid>
	</Card>

	<!-- Focus -->
	<Card>
		<h3>Focus</h3>
		<Grid columns={2} gap="1rem" style="margin-top: 1rem;">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Autofocus</strong>
					<p class="hint">Commented out to prevent page actually jumping to this location. See example code below for implementation.</p>
					<!-- <Search autofocus placeholder="Auto-focused on load..." /> -->
					<code>&lt;Search autofocus placeholder="..." /&gt;</code>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Focus Async</strong>
					<Stack orientation="horizontal" gap="0.5rem">
						<Button onclick={() => focusSearchRef?.focusAsync()}>FocusAsync</Button>
						<Search bind:this={focusSearchRef} placeholder="Click button to focus..." />
					</Stack>
				</Stack>
			</GridItem>
		</Grid>
	</Card>

	<!-- Filled Style -->
	<Card>
		<h3>Filled style</h3>
		<Grid columns={3} gap="1rem" style="margin-top: 1rem;">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Default</strong>
					<Search label="label" appearance="filled" />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Placeholder</strong>
					<Search label="Placeholder" appearance="filled" placeholder="Placeholder" />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Required</strong>
					<Search label="Required" appearance="filled" required />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Disabled</strong>
					<Search label="Disabled" appearance="filled" disabled value="Cannot edit" />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Read only</strong>
					<Search label="label" appearance="filled" readonly value="Read only text" />
				</Stack>
			</GridItem>
		</Grid>
	</Card>

	<!-- Miscellaneous -->
	<Card>
		<h3>Miscellaneous</h3>
		<Grid columns={2} gap="1rem" style="margin-top: 1rem;">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Minlength</strong>
					<small class="hint">Minlength</small>
					<Search minlength={3} placeholder="Min 3 characters..." />
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Maxlength</strong>
					<small class="hint">Maxlength</small>
					<Search maxlength={10} placeholder="Max 10 characters..." />
				</Stack>
			</GridItem>
		</Grid>
	</Card>

	<h2>Documentation</h2>

	<!-- FluentSearch Class -->
	<Card>
		<h3>FluentSearch Class</h3>
		<p class="hint">Inherits from <a href="https://www.fluentui-blazor.net/InputBase" target="_blank" rel="noopener noreferrer">FluentInputBase&lt;string&gt;</a></p>
		<p class="hint" style="margin-bottom: 1rem;">These might be parameters and/or methods shared from that component's base type but are not applicable to this component.</p>

		<h4>Parameters</h4>
		<QuickGrid items={properties} columns={propertyColumns} sortable filterable striped />
	</Card>

	<Card>
		<h4>Event Callbacks</h4>
		<QuickGrid items={callbacks} columns={propertyColumns} sortable filterable striped />
	</Card>

	<Card>
		<h4>Methods</h4>
		<QuickGrid items={methods} columns={propertyColumns} sortable filterable striped />
	</Card>

	<!-- Placeholders and Autofill -->
	<Card>
		<h3>Placeholders and autofill</h3>
		<p>The <code>placeholder</code> parameter is used to set the placeholder text for the input field. This is a short hint that describes the expected value of the input field, it is displayed when the input field is empty and not focused.</p>
		<p>The placeholder value affects the autofill suggestion feature in Microsoft Edge and Google Chrome. Even if you set the <code>autocomplete</code> parameter to off, the browser may still display autofill suggestions based on the placeholder value.</p>
		<p style="margin-bottom: 1rem;">Here are certain placeholder values which you should avoid to prevent the browser from showing autofill suggestions:</p>

		<QuickGrid items={placeholderData} columns={placeholderColumns} striped />

		<p class="hint" style="margin-top: 1rem;">If you still want to use these placeholder values, then you need to disable autofill in your browser settings completely.</p>
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
		margin: 1rem 0 0 0;
		font-weight: 600;
	}

	h3 {
		font-size: 1.25rem;
		margin: 0 0 0.5rem 0;
		font-weight: 600;
	}

	h4 {
		font-size: 1.1rem;
		margin: 1rem 0 0.5rem 0;
		font-weight: 600;
	}

	p {
		margin: 0 0 0.5rem 0;
		line-height: 1.5;
	}

	small {
		font-size: 0.875rem;
	}

	.hint {
		color: var(--neutral-foreground-hint);
		font-size: 0.875rem;
	}

	.results-list {
		list-style: none;
		padding: 0;
		margin: 0.5rem 0;
		border: 1px solid var(--neutral-stroke-rest);
		border-radius: 4px;
		max-height: 150px;
		overflow-y: auto;
	}

	.results-list li {
		padding: 0.5rem 1rem;
		border-bottom: 1px solid var(--neutral-stroke-rest);
	}

	.results-list li:last-child {
		border-bottom: none;
	}

	.results-list li:hover {
		background: var(--neutral-layer-3);
	}

	.no-results {
		color: var(--neutral-foreground-hint);
		font-style: italic;
		margin: 0.5rem 0;
	}

	.searched-text {
		color: var(--neutral-foreground-hint);
		font-size: 0.875rem;
		margin: 0.5rem 0 0 0;
	}

	code {
		background: var(--neutral-layer-3);
		padding: 0.125rem 0.375rem;
		border-radius: 3px;
		font-size: 0.875rem;
	}
</style>
