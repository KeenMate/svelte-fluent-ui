<script lang="ts">
	import {Grid, GridItem, Card, QuickGrid} from "svelte-fluentui"

	type Component = {
		group: string
		name: string
		description: string
		href: string
	}

	const components: Component[] = [
		// Forms & Inputs
		{group: "Forms & Inputs", name: "Autocomplete", description: "Multiple selection with tag/chip display and custom filtering", href: "/components/autocomplete"},
		{group: "Forms & Inputs", name: "Calendar", description: "Date selection calendar", href: "/components/forms/calendar"},
		{group: "Forms & Inputs", name: "Checkbox", description: "Checkbox input with indeterminate state support", href: "/components/checkbox"},
		{group: "Forms & Inputs", name: "Combobox", description: "Dropdown with autocomplete", href: "/components/forms/combobox"},
		{group: "Forms & Inputs", name: "DatePicker", description: "Date selection with calendar popup", href: "/components/datepicker"},
		{group: "Forms & Inputs", name: "InputFile", description: "File upload with drag-drop and validation", href: "/components/inputfile"},
		{group: "Forms & Inputs", name: "Listbox", description: "Scrollable list of selectable options", href: "/components/listbox"},
		{group: "Forms & Inputs", name: "NumberField", description: "Numeric input with step controls", href: "/components/forms/number-field"},
		{group: "Forms & Inputs", name: "Option", description: "Option item for listbox and select", href: "/components/option"},
		{group: "Forms & Inputs", name: "Radio", description: "Radio button for single selection", href: "/components/forms/radio"},
		{group: "Forms & Inputs", name: "RadioGroup", description: "Radio button group container", href: "/components/forms/radio"},
		{group: "Forms & Inputs", name: "Search", description: "Search input field", href: "/components/forms/search"},
		{group: "Forms & Inputs", name: "Select", description: "Dropdown select field", href: "/components/forms/select"},
		{group: "Forms & Inputs", name: "Switch", description: "Toggle switch", href: "/components/forms/switch"},
		{group: "Forms & Inputs", name: "TextArea", description: "Multi-line text input", href: "/components/forms/text-area"},
		{group: "Forms & Inputs", name: "TextField", description: "Single-line text input", href: "/components/forms/text-field"},
		{group: "Forms & Inputs", name: "TimePicker", description: "Time selection with hour/minute/second picker", href: "/components/timepicker"},

		// Buttons & Actions
		{group: "Buttons & Actions", name: "Anchor", description: "Styled link button", href: "/components/anchor"},
		{group: "Buttons & Actions", name: "Button", description: "Clickable button with multiple appearances", href: "/components/button"},

		// Layout
		{group: "Layout", name: "BodyContent", description: "Main content area wrapper", href: "/components/navigation-layout/body-content"},
		{group: "Layout", name: "Footer", description: "Page footer section", href: "/components/navigation-layout/layout"},
		{group: "Layout", name: "Grid", description: "Responsive 12-column grid system", href: "/components/navigation-layout/grid"},
		{group: "Layout", name: "GridItem", description: "Grid column item", href: "/components/navigation-layout/grid"},
		{group: "Layout", name: "Header", description: "Page header section", href: "/components/navigation-layout/layout"},
		{group: "Layout", name: "Layout", description: "Page layout wrapper", href: "/components/navigation-layout/layout"},
		{group: "Layout", name: "MultiSplitter", description: "Resizable multi-panel splitter", href: "/components/navigation-layout/multisplitter"},
		{group: "Layout", name: "MultiSplitterPane", description: "Splitter panel", href: "/components/navigation-layout/multisplitter"},
		{group: "Layout", name: "Spacer", description: "Flexible spacing utility", href: "/components/navigation-layout/spacer"},
		{group: "Layout", name: "Stack", description: "Flexbox layout container (vertical/horizontal)", href: "/components/navigation-layout/stack"},

		// Navigation
		{group: "Navigation", name: "Accordion", description: "Expandable/collapsible content sections", href: "/components/navigation-layout/accordion"},
		{group: "Navigation", name: "AccordionItem", description: "Individual accordion section", href: "/components/navigation-layout/accordion"},
		{group: "Navigation", name: "AppBar", description: "Application bar menu", href: "/components/navigation-layout/appbar"},
		{group: "Navigation", name: "AppBarItem", description: "Application bar menu item", href: "/components/navigation-layout/appbar"},
		{group: "Navigation", name: "Breadcrumb", description: "Breadcrumb navigation", href: "/components/breadcrumbs"},
		{group: "Navigation", name: "BreadcrumbItem", description: "Breadcrumb item", href: "/components/breadcrumbs"},
		{group: "Navigation", name: "NavMenu", description: "Navigation menu container", href: "/components/navigation-layout/navigation"},
		{group: "Navigation", name: "NavGroup", description: "Collapsible navigation group", href: "/components/navigation-layout/navigation"},
		{group: "Navigation", name: "NavLinkItem", description: "Navigation link item", href: "/components/navigation-layout/navigation"},
		{group: "Navigation", name: "Tab", description: "Tab navigation item", href: "/components/tabs"},
		{group: "Navigation", name: "TabPanel", description: "Tab content panel", href: "/components/tabs"},
		{group: "Navigation", name: "Tabs", description: "Tab navigation container", href: "/components/tabs"},

		// Display
		{group: "Display", name: "Badge", description: "Status indicator badge", href: "/components/badge"},
		{group: "Display", name: "Card", description: "Content container card", href: "/components/card"},
		{group: "Display", name: "Divider", description: "Visual separator line", href: "/components/divider"},

		// Feedback
		{group: "Feedback", name: "Dialog", description: "Modal dialog box", href: "/components/dialog"},
		{group: "Feedback", name: "Progress", description: "Progress indicator", href: "/components/progress"},
		{group: "Feedback", name: "Toast", description: "Declarative toast notification", href: "/components/toast"},
		{group: "Feedback", name: "Toast Service", description: "Programmatic toast notification system", href: "/components/toast-service"},
		{group: "Feedback", name: "Tooltip", description: "Hover tooltip", href: "/components/tooltip"},

		// Data Display
		{group: "Data Display", name: "DataGrid", description: "FluentUI data grid", href: "/components/datagrid"},
		{group: "Data Display", name: "DataGridRow", description: "Data grid row", href: "/components/datagrid"},
		{group: "Data Display", name: "DataGridCell", description: "Data grid cell", href: "/components/datagrid"},
		{group: "Data Display", name: "Paginator", description: "Pagination control", href: "/components/paginator"},
		{group: "Data Display", name: "QuickGrid", description: "Advanced data grid with sorting, filtering, and pagination", href: "/components/quickgrid"},
		{group: "Data Display", name: "Toolbar", description: "Toolbar container", href: "/components/toolbar"},
		{group: "Data Display", name: "Tree", description: "Hierarchical tree view", href: "/components/tree"},
		{group: "Data Display", name: "TreeItem", description: "Tree item node", href: "/components/tree"}
	]

	const componentColumns = [
		{field: "group", title: "Group", sortable: true, filterable: true},
		{
			field: "name",
			title: "Name",
			sortable: true,
			filterable: true,
			template: (row: Component) => `<a href="${row.href}" class="component-link">${row.name}</a>`
		} as any,
		{field: "description", title: "Description", filterable: true}
	]
</script>

<h1>Component Library</h1>

<Grid spacing={4}>
	<GridItem xs={12} lg={10} xl={8}>
		<Card>
			<QuickGrid
				items={components}
				columns={componentColumns}
				sortable
				filterable
				striped
			/>
		</Card>
	</GridItem>

	<GridItem xs={12} lg={2} xl={4}>
		<Card>
			<h3>Quick Links</h3>
			<div class="quick-links-container">
				<a href="/getting-started">Getting Started</a>
				<a href="/components">All Components</a>
				<a href="/theme/variables">CSS Variables</a>
				<a href="/components/navigation-layout/grid">Grid Demo</a>
				<a href="/components/navigation-layout/multisplitter">MultiSplitter Demo</a>
				<a href="/components/toast-service">Toast Service</a>
			</div>
		</Card>
	</GridItem>
</Grid>

<style>
	h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin: 0 0 2rem 0;
	}

	.quick-links-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.quick-links-container a {
		color: var(--accent-fill-rest, #0078d4);
		text-decoration: none;
		padding: 0.25rem 0;
	}

	.quick-links-container a:hover {
		text-decoration: underline;
	}

	:global(.component-link) {
		color: var(--accent-fill-rest, #0078d4);
		text-decoration: none;
		font-weight: 500;
	}

	:global(.component-link:hover) {
		text-decoration: underline;
	}
</style>
