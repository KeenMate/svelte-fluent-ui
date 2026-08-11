<script lang="ts">
	import {Select, Option, OptionGroup, Stack, Grid, GridItem, Card, QuickGrid, Slider, Icon} from "svelte-fluentui";
	import {References, Meta} from "$lib/components";

	// Two-way binding example
	let selectedFruit = $state("apple");

	// Icons-in-options example
	let selectedStatus = $state("available");

	// Readonly examples
	let readonlySingle = $state("apple");
	let readonlyMulti = $state<string[]>(["apple", "cherry"]);

	// Trailing-icon example
	let selectedUser = $state("jean");
	const users = [
		{ id: "jean",      name: "Jean (Martin)" },
		{ id: "antonio",   name: "António (Langa)" },
		{ id: "julie",     name: "Julie (Smith)" },
		{ id: "nur",       name: "Nur (Sari)" },
		{ id: "jose",      name: "Jose (Hernandez)" },
		{ id: "bert",      name: "Bert (de Vries)" },
		{ id: "jaques",    name: "Jaques (Martin)" },
		{ id: "elizabeth", name: "Elizabeth (Johnson)" },
		{ id: "jakob",     name: "Jakob (Berger)" }
	];

	// Data binding example
	type Language = {
		id: number;
		name: string;
		code: string;
		native: string;
	};

	// Bigger list with shared first letters so type-ahead (e.g. pressing "s"
	// multiple times) has something to cycle through.
	const languages: Language[] = [
		{ id: 1,  name: "Arabic",     code: "ar", native: "العربية" },
		{ id: 2,  name: "Bengali",    code: "bn", native: "বাংলা" },
		{ id: 3,  name: "Catalan",    code: "ca", native: "Català" },
		{ id: 4,  name: "Chinese",    code: "zh", native: "中文" },
		{ id: 5,  name: "Croatian",   code: "hr", native: "Hrvatski" },
		{ id: 6,  name: "Czech",      code: "cs", native: "Čeština" },
		{ id: 7,  name: "Danish",     code: "da", native: "Dansk" },
		{ id: 8,  name: "Dutch",      code: "nl", native: "Nederlands" },
		{ id: 9,  name: "English",    code: "en", native: "English" },
		{ id: 10, name: "Estonian",   code: "et", native: "Eesti" },
		{ id: 11, name: "Finnish",    code: "fi", native: "Suomi" },
		{ id: 12, name: "French",     code: "fr", native: "Français" },
		{ id: 13, name: "German",     code: "de", native: "Deutsch" },
		{ id: 14, name: "Greek",      code: "el", native: "Ελληνικά" },
		{ id: 15, name: "Hebrew",     code: "he", native: "עברית" },
		{ id: 16, name: "Hindi",      code: "hi", native: "हिन्दी" },
		{ id: 17, name: "Hungarian",  code: "hu", native: "Magyar" },
		{ id: 18, name: "Italian",    code: "it", native: "Italiano" },
		{ id: 19, name: "Japanese",   code: "ja", native: "日本語" },
		{ id: 20, name: "Korean",     code: "ko", native: "한국어" },
		{ id: 21, name: "Norwegian",  code: "no", native: "Norsk" },
		{ id: 22, name: "Polish",     code: "pl", native: "Polski" },
		{ id: 23, name: "Portuguese", code: "pt", native: "Português" },
		{ id: 24, name: "Romanian",   code: "ro", native: "Română" },
		{ id: 25, name: "Russian",    code: "ru", native: "Русский" },
		{ id: 26, name: "Serbian",    code: "sr", native: "Српски" },
		{ id: 27, name: "Slovak",     code: "sk", native: "Slovenčina" },
		{ id: 28, name: "Slovenian",  code: "sl", native: "Slovenščina" },
		{ id: 29, name: "Spanish",    code: "es", native: "Español" },
		{ id: 30, name: "Swedish",    code: "sv", native: "Svenska" },
		{ id: 31, name: "Turkish",    code: "tr", native: "Türkçe" },
		{ id: 32, name: "Ukrainian",  code: "uk", native: "Українська" },
		{ id: 33, name: "Vietnamese", code: "vi", native: "Tiếng Việt" }
	];

	let selectedLanguageValue = $state("1");
	let selectedLanguage: Language | undefined = $state(languages[0]);

	// Dropdown max-height demo (single-select mode)
	let selectMaxHeightPx = $state(240);
	let maxHeightLanguage = $state("");

	// Dropdown width demo (single-select mode)
	let selectDropdownWidthPx = $state(360);
	let dropdownWidthLanguage = $state("");

	function handleLanguageChange(detail: { value: string, data?: Record<string, unknown> }) {
		selectedLanguageValue = detail.value;
		selectedLanguage = detail.data as Language | undefined;
	}

	// Properties documentation
	type Property = {
		name: string;
		type: string;
		default: string;
		description: string;
	};

	const selectProperties: Property[] = [
		{name: "appearance", type: '"outline" | "filled"', default: "undefined", description: "Visual appearance style"},
		{name: "ariaLabel", type: "string", default: "undefined", description: "Accessibility label"},
		{name: "autofocus", type: "boolean", default: "undefined", description: "Focus on first render"},
		{name: "class", type: "string", default: '""', description: "CSS class(es)"},
		{name: "disabled", type: "boolean", default: "undefined", description: "Disables the select"},
		{name: "readonly", type: "boolean", default: "false", description: "Non-editable: the value shows but can't be changed (dropdown won't open, options can't be toggled). Unlike disabled, it stays focusable and un-dimmed."},
		{name: "height", type: "string", default: "undefined", description: "Height (e.g., '200px')"},
		{name: "id", type: "string", default: "undefined", description: "Element ID"},
		{name: "label", type: "string", default: "undefined", description: "Visible label"},
		{name: "maxDropdownHeight", type: "string", default: "undefined (280px cap)", description: "Single mode: cap the dropdown listbox height (e.g. '240px', '50vh'). Always also capped to the viewport-available space, whichever is smaller."},
		{name: "dropdownWidth", type: "string", default: "undefined (matches control)", description: "Single mode: width of the dropdown listbox (e.g. '360px'). When unset the list matches the control width; when set it uses this width instead."},
		{name: "maxVisibleOptions", type: "number", default: "undefined", description: "Limits visible options in multiple select, enables scrolling"},
		{name: "multiple", type: "boolean", default: "false", description: "Allow multiple selections"},
		{name: "name", type: "string", default: "undefined", description: "Form field name"},
		{name: "open", type: "boolean", default: "undefined", description: "Controls dropdown open state"},
		{name: "position", type: '"above" | "below"', default: "undefined", description: "Forces dropdown position"},
		{name: "required", type: "boolean", default: "undefined", description: "Required for form validation"},
		{name: "style", type: "string", default: '""', description: "Inline styles"},
		{name: "title", type: "string", default: "undefined", description: "Tooltip text"},
		{name: "value", type: "string", default: "undefined", description: "Selected value (bindable)"},
		{name: "width", type: "string", default: "undefined", description: "Width (e.g., '200px', '100%')"}
	];

	const optionProperties: Property[] = [
		{name: "value", type: "string", default: "required", description: "Option value"},
		{name: "class", type: "string", default: "undefined", description: "CSS class(es)"},
		{name: "data", type: "Record<string, unknown>", default: "undefined", description: "Arbitrary data returned in onchange"},
		{name: "disabled", type: "boolean", default: "false", description: "Disables the option"},
		{name: "label", type: "string", default: "undefined", description: "Accessibility label"},
		{name: "selected", type: "boolean", default: "undefined", description: "Pre-select this option"},
		{name: "style", type: "string", default: "undefined", description: "Inline styles"}
	];

	const callbacks: Property[] = [
		{name: "onchange", type: "(detail: { value, selectedOption?, data? }) => void", default: "undefined", description: "Triggered when selection changes"}
	];

	const slots: Property[] = [
		{name: "children", type: "Snippet", default: "undefined", description: "Option components"},
		{name: "indicatorTemplate", type: "Snippet", default: "undefined", description: "Custom dropdown indicator"},
		{name: "labelTemplate", type: "Snippet", default: "undefined", description: "Custom label template"}
	];

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	];
</script>

<Stack orientation="vertical" gap="1rem">
	<Meta
		title="Select"
		description="A Svelte wrapper for FluentUI's select web component — a dropdown select field for choosing one value from a list, with form integration."
		keywords="svelte, fluentui, select, dropdown, form, input, web components"
	/>

	<h1>Select</h1>

	<p>
		An implementation of an <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select" target="_blank" rel="noopener noreferrer">HTML select element</a> as a component supporting the Fluent UI design system.
	</p>

	<References links={[
		{label: "FluentUI Web Component", href: "https://storybooks.fluentui.dev/web-components/?path=/docs/components-select--docs"},
		{label: "FluentUI Blazor", href: "https://www.fluentui-blazor.net/Select"}
	]} />

	<Card>
		<h2>Examples</h2>

		<h3>Multiple (all visible)</h3>
		<p>Default behavior: all options shown, height auto-calculated to fit all.</p>
		<Select label="Items" multiple>
			{#snippet children()}
				<Option value="apple">Apple</Option>
				<Option value="grape">Grape</Option>
				<Option value="strawberry">Strawberry</Option>
				<Option value="cherry">Cherry</Option>
				<Option value="banana">Banana</Option>
			{/snippet}
		</Select>

		<h3>Multiple with maxVisibleOptions</h3>
		<p>Use <code>maxVisibleOptions={4}</code> to limit visible items and enable scrolling.</p>
		<Select label="Items" multiple maxVisibleOptions={4}>
			{#snippet children()}
				<Option value="apple">Apple</Option>
				<Option value="grape">Grape</Option>
				<Option value="strawberry">Strawberry</Option>
				<Option value="cherry">Cherry</Option>
				<Option value="banana">Banana</Option>
				<Option value="watermelon">Watermelon</Option>
				<Option value="persimmon">Persimmon</Option>
				<Option value="grapefruit">Grapefruit</Option>
			{/snippet}
		</Select>

		<h3>Multiple with selected/disabled</h3>
		<p>Options can be pre-selected or disabled.</p>
		<Select label="Items" multiple>
			{#snippet children()}
				<Option value="option1" selected>Selected 1</Option>
				<Option value="option2" selected>Selected 2</Option>
				<Option value="disabled1" disabled>Disabled 1</Option>
				<Option value="disabled2" disabled>Disabled 2</Option>
				<Option value="option3">Option 3</Option>
				<Option value="option4">Option 4</Option>
			{/snippet}
		</Select>

		<h3>Grouped options</h3>
		<p>Wrap <code>&lt;Option&gt;</code> rows in <code>&lt;OptionGroup label="…"&gt;</code> to section the list under non-interactive headers.</p>
		<Select label="Choose a food" id="grouped-select">
			{#snippet children()}
				<Option value="">Select...</Option>
				<OptionGroup label="Fruit">
					<Option value="apple">Apple</Option>
					<Option value="banana">Banana</Option>
					<Option value="cherry" disabled>Cherry (sold out)</Option>
				</OptionGroup>
				<OptionGroup label="Vegetable">
					<Option value="carrot">Carrot</Option>
					<Option value="potato" disabled>Potato (sold out)</Option>
				</OptionGroup>
				<OptionGroup label="Dairy">
					<Option value="cheddar">Cheddar</Option>
					<Option value="yogurt">Yogurt</Option>
				</OptionGroup>
			{/snippet}
		</Select>

		<h3>Icons in options</h3>
		<p>
			Each <code>&lt;Option&gt;</code> accepts an <code>icon</code> snippet, rendered before the label.
			Pair it with the <code>&lt;Icon&gt;</code> component for FluentUI glyphs — here the presence icons
			are coloured via <code>color</code> (<code>success</code> / <code>warning</code> / <code>error</code> / <code>neutral</code>).
		</p>
		<Select label="Status" bind:value={selectedStatus} width="260px">
			{#snippet children()}
				<Option value="available">
					{#snippet icon()}<Icon name="presence_available" size={16} variant="filled" color="success" />{/snippet}
					Available
				</Option>
				<Option value="busy">
					{#snippet icon()}<Icon name="presence_busy" size={16} variant="filled" color="error" />{/snippet}
					Busy
				</Option>
				<Option value="dnd">
					{#snippet icon()}<Icon name="presence_dnd" size={16} variant="filled" color="error" />{/snippet}
					Do not disturb
				</Option>
				<Option value="away">
					{#snippet icon()}<Icon name="presence_away" size={16} variant="filled" color="warning" />{/snippet}
					Away
				</Option>
				<Option value="offline">
					{#snippet icon()}<Icon name="presence_offline" size={16} variant="regular" color="neutral" />{/snippet}
					Offline
				</Option>
			{/snippet}
		</Select>
		<p>Selected: <code>{selectedStatus}</code></p>

		<h3>Trailing icon in options</h3>
		<p>
			The <code>icon</code> snippet is at the <em>start</em> (before the label). For an <strong>end</strong>-side icon,
			just place it in the option's content after the text — <code>&lt;Option&gt;</code> children are arbitrary markup
			and the row is a flex container, so the glyph sits inline after the label. Add <code>margin-inline-start:auto</code>
			to the icon to push it to the end edge instead.
		</p>
		<Select label="User" bind:value={selectedUser} width="260px">
			{#snippet children()}
				{#each users as u}
					<Option value={u.id}>
						{u.name} <Icon name="person" size={16} variant="regular" color="accent" />
					</Option>
				{/each}
			{/snippet}
		</Select>
		<p>Selected: <code>{selectedUser}</code></p>

		<h3>Single select (default)</h3>
		<p>Standard dropdown select. Open it and press a letter repeatedly to cycle type-ahead (e.g. <code>b</code> → Banana → Blackberry → Blueberry).</p>
		<Select label="Choose a fruit">
			{#snippet children()}
				<Option value="">Select...</Option>
				<Option value="apple">Apple</Option>
				<Option value="apricot">Apricot</Option>
				<Option value="avocado">Avocado</Option>
				<Option value="banana">Banana</Option>
				<Option value="blackberry">Blackberry</Option>
				<Option value="blueberry">Blueberry</Option>
				<Option value="cherry">Cherry</Option>
				<Option value="coconut">Coconut</Option>
				<Option value="cranberry">Cranberry</Option>
				<Option value="fig">Fig</Option>
				<Option value="grape">Grape</Option>
				<Option value="grapefruit">Grapefruit</Option>
				<Option value="kiwi">Kiwi</Option>
				<Option value="lemon">Lemon</Option>
				<Option value="lime">Lime</Option>
				<Option value="mango">Mango</Option>
				<Option value="melon">Melon</Option>
				<Option value="orange">Orange</Option>
				<Option value="papaya">Papaya</Option>
				<Option value="peach">Peach</Option>
				<Option value="pear">Pear</Option>
				<Option value="pineapple">Pineapple</Option>
				<Option value="plum">Plum</Option>
				<Option value="raspberry">Raspberry</Option>
				<Option value="strawberry">Strawberry</Option>
				<Option value="starfruit">Starfruit</Option>
				<Option value="watermelon">Watermelon</Option>
			{/snippet}
		</Select>

		<h3>Appearances</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Outline</strong>
					<Select appearance="outline">
						{#snippet children()}
							<Option value="1">Option 1</Option>
							<Option value="2">Option 2</Option>
						{/snippet}
					</Select>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Filled</strong>
					<Select appearance="filled">
						{#snippet children()}
							<Option value="1">Option 1</Option>
							<Option value="2">Option 2</Option>
						{/snippet}
					</Select>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Disabled states</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Disabled Select</strong>
					<Select label="Items" disabled>
						{#snippet children()}
							<Option value="1">Cannot interact</Option>
						{/snippet}
					</Select>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Disabled Option</strong>
					<Select label="Items">
						{#snippet children()}
							<Option value="1">Enabled</Option>
							<Option value="2" disabled>Disabled option</Option>
							<Option value="3">Enabled</Option>
						{/snippet}
					</Select>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Readonly states</h3>
		<p><code>readonly</code> shows the value but won't open and can't be changed. Unlike <code>disabled</code> it stays focusable and un-dimmed.</p>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Readonly (single)</strong>
					<Select label="Fruit" bind:value={readonlySingle} readonly>
						{#snippet children()}
							<Option value="apple">Apple</Option>
							<Option value="banana">Banana</Option>
							<Option value="cherry">Cherry</Option>
						{/snippet}
					</Select>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Readonly (multiple)</strong>
					<Select label="Fruits" multiple readonly bind:value={readonlyMulti}>
						{#snippet children()}
							<Option value="apple">Apple</Option>
							<Option value="banana">Banana</Option>
							<Option value="cherry">Cherry</Option>
						{/snippet}
					</Select>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Forced position</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Position above</strong>
					<Select label="Items" position="above">
						{#snippet children()}
							<Option value="1">Opens above</Option>
							<Option value="2">Option 2</Option>
							<Option value="3">Option 3</Option>
						{/snippet}
					</Select>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Position below</strong>
					<Select label="Items" position="below">
						{#snippet children()}
							<Option value="1">Opens below</Option>
							<Option value="2">Option 2</Option>
							<Option value="3">Option 3</Option>
						{/snippet}
					</Select>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Width control</h3>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Full width</strong>
					<Select label="Full width" width="100%">
						{#snippet children()}
							<Option value="1">Full width select</Option>
							<Option value="2">Option 2</Option>
						{/snippet}
					</Select>
				</Stack>
			</GridItem>
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<strong>Fixed width</strong>
					<Select label="Fixed width" width="150px">
						{#snippet children()}
							<Option value="1">150px width</Option>
							<Option value="2">Option 2</Option>
						{/snippet}
					</Select>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Dropdown max height</h3>
		<p>
			In single-select mode, use <code>maxDropdownHeight</code> to cap the dropdown listbox height (e.g.
			<code>"240px"</code>, <code>"50vh"</code>). The listbox is always <em>also</em> capped to the space
			available to the viewport edge, so this acts as an upper bound — whichever is smaller wins. Drag the
			slider to change it live, then open the dropdown. (Multi mode uses <code>maxVisibleOptions</code> instead.)
		</p>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<Slider id="select-maxheight" bind:value={selectMaxHeightPx} min={100} max={400} step={20} label={`maxDropdownHeight: ${selectMaxHeightPx}px`} />
					<Select label="Language" bind:value={maxHeightLanguage} maxDropdownHeight={`${selectMaxHeightPx}px`} width="300px">
						{#snippet children()}
							<Option value="">Select a language...</Option>
							{#each languages as lang}
								<Option value={String(lang.id)}>{lang.name} ({lang.native})</Option>
							{/each}
						{/snippet}
					</Select>
					<small>Open the dropdown — the 33 options scroll once they exceed {selectMaxHeightPx}px.</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Dropdown width</h3>
		<p>
			By default the dropdown matches the control width. In single-select mode, set <code>dropdownWidth</code>
			to give the listbox its own width — wider than the trigger (to show long labels) or narrower — independent
			of the control. Drag the slider to change it live, then open the dropdown.
		</p>
		<Grid columns={2} gap="1rem">
			<GridItem>
				<Stack orientation="vertical" gap="0.5rem">
					<Slider id="select-ddwidth" bind:value={selectDropdownWidthPx} min={160} max={520} step={20} label={`dropdownWidth: ${selectDropdownWidthPx}px`} />
					<Select label="Language" bind:value={dropdownWidthLanguage} dropdownWidth={`${selectDropdownWidthPx}px`} width="220px">
						{#snippet children()}
							<Option value="">Select a language...</Option>
							{#each languages as lang}
								<Option value={String(lang.id)}>{lang.name} ({lang.native})</Option>
							{/each}
						{/snippet}
					</Select>
					<small>The control stays 220px wide; the dropdown is {selectDropdownWidthPx}px.</small>
				</Stack>
			</GridItem>
		</Grid>

		<h3>Long list</h3>
		<p>FluentUI handles long lists with built-in scrolling.</p>
		<Select label="Countries">
			{#snippet children()}
				<Option value="">Select a country...</Option>
				<Option value="us">United States</Option>
				<Option value="uk">United Kingdom</Option>
				<Option value="ca">Canada</Option>
				<Option value="au">Australia</Option>
				<Option value="de">Germany</Option>
				<Option value="fr">France</Option>
				<Option value="jp">Japan</Option>
				<Option value="cn">China</Option>
				<Option value="in">India</Option>
				<Option value="br">Brazil</Option>
			{/snippet}
		</Select>

		<h3>Two-way binding</h3>
		<p>Use <code>bind:value</code> for reactive binding.</p>
		<Select label="Fruit" bind:value={selectedFruit}>
			{#snippet children()}
				<Option value="apple">Apple</Option>
				<Option value="banana">Banana</Option>
				<Option value="cherry">Cherry</Option>
			{/snippet}
		</Select>
		<p>Selected: <code>{selectedFruit}</code></p>

		<h3>Data binding</h3>
		<p>Use <code>data</code> prop on Option to pass object data.</p>
		<Select label="Language" value={selectedLanguageValue} onchange={handleLanguageChange}>
			{#snippet children()}
				{#each languages as lang}
					<Option value={String(lang.id)} data={lang}>{lang.name} ({lang.native})</Option>
				{/each}
			{/snippet}
		</Select>
		<p>Value: <code>{selectedLanguageValue}</code></p>
		<p>Data: <code>{selectedLanguage?.name}</code></p>

		<h3>From array</h3>
		<p>Generate options from an array using <code>#each</code>.</p>
		<Select label="Numbers">
			{#snippet children()}
				{#each Array.from({length: 5}, (_, i) => i + 1) as num}
					<Option value={String(num)}>Option {num}</Option>
				{/each}
			{/snippet}
		</Select>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Properties</h2>
				<QuickGrid items={selectProperties} columns={propertyColumns} sortable filterable striped />
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
		<h2>Option Properties</h2>
		<p>Props on the <code>&lt;Option&gt;</code> child component.</p>
		<QuickGrid items={optionProperties} columns={propertyColumns} sortable filterable striped />
	</Card>
</Stack>
