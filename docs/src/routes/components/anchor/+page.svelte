<script lang="ts">
	import { Anchor, QuickGrid, Stack, Grid, GridItem, Card } from "svelte-fluentui";
	import {References, Meta} from "$lib/components";

	function handleAnchorClick(event: MouseEvent) {
		alert("Anchor clicked!");
	}

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "id", type: "string", default: "undefined", description: "Element ID"},
		{name: "class", type: "string", default: '""', description: "Custom CSS classes"},
		{name: "style", type: "string", default: '""', description: "Inline styles"},
		{name: "download", type: "string", default: "undefined", description: "Download attribute for files"},
		{name: "href", type: "string", default: "undefined", description: "URL the link points to"},
		{name: "hreflang", type: "string", default: "undefined", description: "Language of the linked resource"},
		{name: "ping", type: "string", default: "undefined", description: "URLs to notify on follow"},
		{name: "referrerpolicy", type: "string", default: "undefined", description: "Referrer policy for the link"},
		{name: "rel", type: "string", default: "undefined", description: "Relationship between the document and the target"},
		{name: "target", type: "string", default: "undefined", description: "Where to open the linked document"},
		{name: "type", type: "string", default: "undefined", description: "Hint of the linked resource's MIME type"},
		{name: "appearance", type: '"neutral" | "accent" | "hypertext" | "stealth" | "transparent"', default: "undefined", description: "Visual style variant"},
		{name: "preventDefault", type: "boolean", default: "false", description: "Prevent default navigation behavior"},
		{name: "use", type: "(node: HTMLAnchorElement) => any", default: "undefined", description: "Svelte action applied to the anchor element"}
	]

	const callbacks: Property[] = [
		{name: "onClick", type: "(event: MouseEvent) => void", default: "undefined", description: "Fires when the anchor is clicked"}
	]

	const slots: Property[] = [
		{name: "children", type: "SlotType", default: "undefined", description: "Content inside the anchor"},
		{name: "iconStart", type: "SlotType", default: "undefined", description: "Element displayed before children"},
		{name: "iconEnd", type: "SlotType", default: "undefined", description: "Element displayed after children"}
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
		title="Anchor"
		description="A Svelte wrapper for FluentUI's anchor web component — a styled hyperlink with multiple appearances and start/end icon slots."
		keywords="svelte, fluentui, anchor, link, hyperlink, navigation, web components"
	/>

	<h1>Anchor</h1>

	<p>
		A styled hyperlink that wraps the <code>&lt;fluent-anchor&gt;</code> element, supporting multiple visual
		appearances and optional start/end icon slots while behaving like a standard anchor.
	</p>

	<References links={[
		{label: "FluentUI Web Component", href: "https://storybooks.fluentui.dev/web-components/?path=/docs/components-button-anchor--docs"},
		{label: "FluentUI Blazor", href: "https://www.fluentui-blazor.net/Anchor"}
	]} />

	<Card>
		<h2 class="content-subhead">Examples</h2>

		<h3>Basic Anchor</h3>
		<Anchor href="#">example</Anchor>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Properties</h2>
				<QuickGrid items={properties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Stack orientation="vertical" gap="1rem">
				<Card>
					<h2>Callbacks</h2>
					<QuickGrid items={callbacks} columns={propertyColumns} sortable filterable striped />
				</Card>
			</Stack>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Slots</h2>
				<QuickGrid items={slots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>
</Stack>
