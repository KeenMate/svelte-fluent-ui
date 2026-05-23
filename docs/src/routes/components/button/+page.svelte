<script lang="ts">
	import {Button, Stack, Card, Grid, GridItem, QuickGrid} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"

	let loading1 = $state(false)
	let loading2 = $state(false)

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "appearance", type: "string", default: "undefined", description: "Visual appearance of the button. Options: 'accent', 'lightweight', 'outline', 'stealth'."},
		{name: "autofocus", type: "boolean", default: "undefined", description: "Automatically focuses the button when the page loads."},
		{name: "disabled", type: "string", default: "undefined", description: "Disables the button when set."},
		{name: "form", type: "string", default: "undefined", description: "Associates the button with a form element by its id."},
		{name: "formaction", type: "string", default: "undefined", description: "URL to use for form submission when this button is used."},
		{name: "formenctype", type: "string", default: "undefined", description: "Encoding type to use for form submission."},
		{name: "formmethod", type: "string", default: "undefined", description: "HTTP method to use for form submission ('get' or 'post')."},
		{name: "formnovalidate", type: "string", default: "undefined", description: "Bypasses form validation when submitting via this button."},
		{name: "formtarget", type: "string", default: "undefined", description: "Browsing context in which to display the form submission response."},
		{name: "name", type: "string", default: "undefined", description: "Name of the button, submitted as part of form data."},
		{name: "type", type: "string", default: "undefined", description: "Button type: 'button', 'submit', or 'reset'."},
		{name: "value", type: "string", default: "undefined", description: "Value submitted with the form when the button is clicked."},
		{name: "style", type: "string", default: "\"\"", description: "Inline CSS styles to apply to the button element."},
	]

	const callbacks: Property[] = [
		{name: "onclick", type: "(ev: MouseEvent) => void", default: "undefined", description: "Called when the button is clicked."},
	]

	const slots: Property[] = [
		{name: "children", type: "Snippet", default: "undefined", description: "Default slot for button label or content."},
		{name: "start", type: "Snippet", default: "undefined", description: "Content rendered before the button label (e.g. an icon)."},
		{name: "end", type: "Snippet", default: "undefined", description: "Content rendered after the button label (e.g. an icon)."},
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]

	async function handleRefresh(loadingVar: 'loading1' | 'loading2') {
		if (loadingVar === 'loading1') {
			loading1 = true
			await new Promise(resolve => setTimeout(resolve, 2000))
			loading1 = false
		} else {
			loading2 = true
			await new Promise(resolve => setTimeout(resolve, 2000))
			loading2 = false
		}
	}

	// Globe icon SVG
	const globeIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 110 16 8 8 0 010-16zm0 1a7 7 0 00-5.985 10.938A7.967 7.967 0 0110 11a7.967 7.967 0 015.985 2.938A7 7 0 0010 3zm0 14c-1.567 0-3.02-.54-4.167-1.446A6.972 6.972 0 0110 12a6.972 6.972 0 014.167 3.554A6.972 6.972 0 0110 17zM7.5 7.5a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2z"/></svg>`

	// Refresh icon SVG
	const refreshIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3a7 7 0 00-7 7h2a5 5 0 015-5v2l3-3-3-3v2zm7 7a7 7 0 01-7 7v-2a5 5 0 005-5h-2l3-3 3 3h-2z"/></svg>`
</script>

<Stack orientation="vertical" gap="1rem">
	<Meta
		title="Button"
		description="A Svelte wrapper for FluentUI's button web component with multiple appearances, form integration, and start/end icon slots."
		keywords="svelte, fluentui, button, click, action, web components, form"
	/>

	<h1>Button</h1>

	<p>
		A clickable button that wraps the <code>&lt;fluent-button&gt;</code> element, supporting multiple
		appearances, form integration, and optional start/end icon slots.
	</p>

	<References links={[
		{label: "FluentUI Web Component", href: "https://storybooks.fluentui.dev/web-components/?path=/docs/components-button--docs"},
		{label: "FluentUI Blazor", href: "https://www.fluentui-blazor.net/Button"}
	]} />

	<Card>
		<h2>Examples</h2>

		<h3>Appearances</h3>
		<Stack orientation="horizontal" gap="0.5rem" style="flex-wrap: wrap;">
			<Button>Button</Button>
			<Button appearance="accent">Accent</Button>
			<Button appearance="lightweight">Lightweight</Button>
			<Button appearance="outline">Outline</Button>
			<Button appearance="stealth">Stealth</Button>
			<Button appearance="accent" style="--accent-fill-rest: #ffd800; --accent-fill-hover: #e6c200; --accent-fill-active: #ccad00; color: #000;">Colored</Button>
			<Button appearance="accent" disabled={loading1} onclick={() => handleRefresh('loading1')}>
				{loading1 ? 'Loading...' : 'Loading'}
			</Button>
		</Stack>

		<h3>With icon at Start or End</h3>
		<Stack orientation="horizontal" gap="0.5rem" style="flex-wrap: wrap;">
			<Button>
				{#snippet start()}
					<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
						<path d="M10 2a8 8 0 110 16 8 8 0 010-16zm0 1a7 7 0 00-5.985 10.938A7.967 7.967 0 0110 11a7.967 7.967 0 015.985 2.938A7 7 0 0010 3zm0 14c-1.567 0-3.02-.54-4.167-1.446A6.972 6.972 0 0110 12a6.972 6.972 0 014.167 3.554A6.972 6.972 0 0110 17zM7.5 7.5a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2z"/>
					</svg>
				{/snippet}
				Button
			</Button>

			<Button appearance="accent">
				{#snippet start()}
					<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
						<path d="M10 2a8 8 0 110 16 8 8 0 010-16zm0 1a7 7 0 00-5.985 10.938A7.967 7.967 0 0110 11a7.967 7.967 0 015.985 2.938A7 7 0 0010 3zm0 14c-1.567 0-3.02-.54-4.167-1.446A6.972 6.972 0 0110 12a6.972 6.972 0 014.167 3.554A6.972 6.972 0 0110 17zM7.5 7.5a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2z"/>
					</svg>
				{/snippet}
				Button
			</Button>

			<Button>
				Button
				{#snippet end()}
					<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
						<path d="M10 2a8 8 0 110 16 8 8 0 010-16zm0 1a7 7 0 00-5.985 10.938A7.967 7.967 0 0110 11a7.967 7.967 0 015.985 2.938A7 7 0 0010 3zm0 14c-1.567 0-3.02-.54-4.167-1.446A6.972 6.972 0 0110 12a6.972 6.972 0 014.167 3.554A6.972 6.972 0 0110 17zM7.5 7.5a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2z"/>
					</svg>
				{/snippet}
			</Button>

			<Button appearance="accent">
				Button
				{#snippet end()}
					<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
						<path d="M10 2a8 8 0 110 16 8 8 0 010-16zm0 1a7 7 0 00-5.985 10.938A7.967 7.967 0 0110 11a7.967 7.967 0 015.985 2.938A7 7 0 0010 3zm0 14c-1.567 0-3.02-.54-4.167-1.446A6.972 6.972 0 0110 12a6.972 6.972 0 014.167 3.554A6.972 6.972 0 0110 17zM7.5 7.5a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2z"/>
				</svg>
				{/snippet}
			</Button>
		</Stack>

		<h3>With icon in default slot</h3>
		<Button aria-label="Globe">
			<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
				<path d="M10 2a8 8 0 110 16 8 8 0 010-16zm0 1a7 7 0 00-5.985 10.938A7.967 7.967 0 0110 11a7.967 7.967 0 015.985 2.938A7 7 0 0010 3zm0 14c-1.567 0-3.02-.54-4.167-1.446A6.972 6.972 0 0110 12a6.972 6.972 0 014.167 3.554A6.972 6.972 0 0110 17zM7.5 7.5a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2z"/>
			</svg>
		</Button>

		<h3>With icon in the content (color control)</h3>
		<p>By doing it this way, it is possible to specify a <code>color</code> for the icon.</p>
		<Button>
			<span style="display: flex; align-items: center; gap: 8px;">
				<svg width="24" height="24" viewBox="0 0 20 20" fill="#c50f1f">
					<path d="M10 2a8 8 0 110 16 8 8 0 010-16zm0 1a7 7 0 00-5.985 10.938A7.967 7.967 0 0110 11a7.967 7.967 0 015.985 2.938A7 7 0 0010 3zm0 14c-1.567 0-3.02-.54-4.167-1.446A6.972 6.972 0 0710 12a6.972 6.972 0 014.167 3.554A6.972 6.972 0 0110 17zM7.5 7.5a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2z"/>
				</svg>
				<span>Button</span>
			</span>
		</Button>

		<h3>With icon and loading</h3>
		<Stack orientation="horizontal" gap="0.5rem" style="flex-wrap: wrap;">
			<Button disabled={loading2} onclick={() => handleRefresh('loading2')}>
				{#snippet start()}
					<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={loading2 ? 'animation: spin 1s linear infinite;' : ''}>
						<path d="M3.75 10a6.25 6.25 0 0 1 11.25-3.75h-2.5a.625.625 0 0 0 0 1.25h3.75a.625.625 0 0 0 .625-.625v-3.75a.625.625 0 0 0-1.25 0v1.91A7.49 7.49 0 0 0 2.5 10a7.5 7.5 0 0 0 14.98.68.625.625 0 0 0-1.25-.1A6.25 6.25 0 0 1 3.75 10Z"/>
					</svg>
				{/snippet}
				Refresh
			</Button>

			<Button appearance="accent" disabled={loading2} onclick={() => handleRefresh('loading2')}>
				{#snippet start()}
					<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={loading2 ? 'animation: spin 1s linear infinite;' : ''}>
						<path d="M3.75 10a6.25 6.25 0 0 1 11.25-3.75h-2.5a.625.625 0 0 0 0 1.25h3.75a.625.625 0 0 0 .625-.625v-3.75a.625.625 0 0 0-1.25 0v1.91A7.49 7.49 0 0 0 2.5 10a7.5 7.5 0 0 0 14.98.68.625.625 0 0 0-1.25-.1A6.25 6.25 0 0 1 3.75 10Z"/>
					</svg>
				{/snippet}
				Refresh
			</Button>
		</Stack>
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
</Stack>

<style>
	code {
		background-color: var(--neutral-layer-2);
		padding: 0.125rem 0.375rem;
		border-radius: 3px;
		font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
		font-size: 0.875em;
	}

	:global {
		@keyframes spin {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}
	}
</style>
