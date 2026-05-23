<script lang="ts">
	import {Grid, GridItem, Card} from "svelte-fluentui"
	import {Meta} from "$lib/components"

	const categories = [
		{
			title: "Forms & Inputs",
			description: "Text fields, checkboxes, selects, and other form controls",
			href: "/components/forms/text-field",
			components: ["TextField", "Checkbox", "Radio", "Select", "Combobox", "Calendar"]
		},
		{
			title: "Buttons & Actions",
			description: "Buttons and clickable elements",
			href: "/components/button",
			components: ["Button", "Anchor"]
		},
		{
			title: "Layout",
			description: "Layout primitives for organizing content",
			href: "/components/navigation-layout/grid",
			components: ["Grid", "Stack", "Layout", "Spacer", "MultiSplitter"]
		},
		{
			title: "Navigation",
			description: "Navigation menus, breadcrumbs, and tabs",
			href: "/components/navigation-layout/navigation",
			components: ["NavMenu", "AppBar", "Breadcrumbs", "Tabs", "Accordion"]
		},
		{
			title: "Display",
			description: "Cards, badges, and other display components",
			href: "/components/card",
			components: ["Card", "Badge"]
		},
		{
			title: "Feedback",
			description: "Dialogs, toasts, and tooltips for user feedback",
			href: "/components/dialog",
			components: ["Dialog", "Toast", "Tooltip"]
		},
		{
			title: "Data Display",
			description: "Tables, grids, and data visualization",
			href: "/components/datagrid",
			components: ["DataGrid", "QuickGrid", "Paginator", "Toolbar"]
		}
	]
</script>

<div>
	<Meta
		title="Components"
		description="Browse all Svelte FluentUI components organized by category — forms, buttons, layout, navigation, display, feedback, and data."
		keywords="svelte, fluentui, components, library, ui, web components, catalog"
	/>

	<h1>Components</h1>
	<p class="page-description">
		Browse all available components organized by category. Use the sidebar to navigate.
	</p>

	<Grid spacing={4}>
		{#each categories as category}
			<GridItem xs={12} md={6} lg={4}>
				<Card class="category-card">
					<h2 class="category-title">
						<a href={category.href} class="category-link">
							{category.title}
						</a>
					</h2>
					<p class="category-description">
						{category.description}
					</p>
					<div class="component-tags">
						{#each category.components as component}
							<span class="component-tag">
								{component}
							</span>
						{/each}
					</div>
				</Card>
			</GridItem>
		{/each}
	</Grid>
</div>

<style>
	.page-description {
		margin-bottom: 2rem;
		color: var(--neutral-foreground-rest, #605e5c);
	}

	.category-title {
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
	}

	.category-link {
		text-decoration: none;
		color: var(--accent-foreground-rest, #0078d4);
	}

	.category-description {
		margin: 0 0 1rem 0;
		color: var(--neutral-foreground-rest, #605e5c);
		font-size: 0.875rem;
	}

	.component-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.component-tag {
		padding: 0.25rem 0.5rem;
		background: var(--neutral-layer-3, #f3f2f1);
		border-radius: 4px;
		font-size: 0.75rem;
		font-family: monospace;
	}
</style>
