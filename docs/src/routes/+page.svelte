<script lang="ts">
	import {Grid, GridItem, Card, QuickGrid} from "svelte-fluentui"

	type Component = {
		name: string
		state: string
		comment: string
		href: string
	}

	const components: Component[] = [
		{name: "accordion", state: "Initial tests", comment: "", href: "/components/navigation-layout/accordion"},
		{name: "anchor", state: "", comment: "", href: "/components/anchor"},
		{name: "anchored-region", state: "", comment: "", href: ""},
		{name: "appbar", state: "Initial tests", comment: "Icons (active and \"rest\") need to have \"part\" attr manually specified to work properly", href: "/components/navigation-layout/appbar"},
		{name: "badge", state: "Initial tests", comment: "Now, only \"accent\" appearance works. Colors need CSS variables to be defined (--badge-color-[color])", href: "/components/badge"},
		{name: "body-content", state: "Initial tests", comment: "", href: "/components/navigation-layout/body-content"},
		{name: "breadcrumbs", state: "Initial tests", comment: "", href: "/components/breadcrumbs"},
		{name: "button", state: "Initial tests", comment: "", href: "/components/button"},
		{name: "calendar", state: "Initial tests", comment: "", href: "/components/forms/calendar"},
		{name: "card", state: "Initial tests", comment: "", href: "/components/card"},
		{name: "checkbox", state: "Initial tests", comment: "Intermediate state does not work", href: "/components/checkbox"},
		{name: "color", state: "", comment: "", href: ""},
		{name: "combobox", state: "Initial tests", comment: "", href: "/components/forms/combobox"},
		{name: "data-grid", state: "Not planned", comment: "Does not seem to be much flexible", href: ""},
		{name: "design-system-provider", state: "", comment: "", href: ""},
		{name: "dialog", state: "", comment: "", href: "/components/dialog"},
		{name: "divider", state: "", comment: "", href: ""},
		{name: "flipper", state: "", comment: "", href: ""},
		{name: "grid", state: "Initial tests", comment: "Responsive 12-column grid system with breakpoints", href: "/components/navigation-layout/grid"},
		{name: "horizontal-scroll", state: "", comment: "", href: ""},
		{name: "layout", state: "Initial tests", comment: "", href: "/components/navigation-layout/layout"},
		{name: "listbox", state: "Initial tests", comment: "", href: "/components/listbox"},
		{name: "listbox-option", state: "Initial tests", comment: "", href: "/components/option"},
		{name: "menu", state: "", comment: "", href: ""},
		{name: "menu-item", state: "", comment: "", href: ""},
		{name: "multi-splitter", state: "Initial tests", comment: "Resizable multi-panel splitter component", href: "/components/navigation-layout/multisplitter"},
		{name: "navigation", state: "Initial tests", comment: "Collapsed nav' child tree's floating nodes not implemented at the moment", href: "/components/navigation-layout/navigation"},
		{name: "number-field", state: "Initial tests", comment: "", href: "/components/forms/number-field"},
		{name: "progress", state: "", comment: "", href: ""},
		{name: "radio", state: "Initial tests", comment: "Wrapped radios have ugly missing spacing (cannot be added so far)", href: "/components/forms/radio"},
		{name: "radio-group", state: "Initial tests", comment: "Wrapped radios have ugly missing spacing (cannot be added so far)", href: "/components/forms/radio"},
		{name: "search", state: "Initial tests", comment: "", href: "/components/forms/search"},
		{name: "select", state: "Initial tests", comment: "", href: "/components/forms/select"},
		{name: "skeleton", state: "", comment: "", href: ""},
		{name: "slider", state: "", comment: "", href: ""},
		{name: "slider-label", state: "", comment: "", href: ""},
		{name: "spacer", state: "Initial tests", comment: "", href: "/components/navigation-layout/spacer"},
		{name: "stack", state: "Initial tests", comment: "", href: "/components/navigation-layout/stack"},
		{name: "styles", state: "", comment: "", href: ""},
		{name: "switch", state: "Initial tests", comment: "", href: "/components/forms/switch"},
		{name: "tabs", state: "Initial tests", comment: "", href: "/components/tabs/"},
		{name: "text-area", state: "Initial tests", comment: "", href: "/components/forms/text-area"},
		{name: "text-field", state: "Initial tests", comment: "", href: "/components/forms/text-field"},
		{name: "toast", state: "Initial tests", comment: "", href: "/components/toast"},
		{name: "toolbar", state: "Initial tests", comment: "", href: "/components/toolbar"},
		{name: "tooltip", state: "Initial tests", comment: "", href: "/components/tooltip"},
		{name: "tree-item", state: "", comment: "", href: ""},
		{name: "tree-view", state: "", comment: "", href: ""}
	]

	const componentColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "state", title: "State", sortable: true, filterable: true},
		{field: "comment", title: "Comment", filterable: true}
	]

</script>

<h1>List of components</h1>

<Grid spacing={4}>
	<GridItem xs={12} lg={10} xl={8}>
		<Card>
			<QuickGrid items={components} columns={componentColumns} sortable filterable striped />
		</Card>
	</GridItem>

	<GridItem xs={12} lg={2} xl={4}>
		<Card>
			<h3>Quick Links</h3>
			<div class="quick-links-container">
				<a href="/components/navigation-layout/grid">Grid Demo</a>
				<a href="/components/navigation-layout/multisplitter">MultiSplitter Demo</a>
			</div>
		</Card>
	</GridItem>
</Grid>

<style>
	.quick-links-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 1rem;
	}
</style>






