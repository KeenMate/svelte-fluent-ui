<script lang="ts">
	import {Paginator, QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"

	let currentPage = 0
	let lastPage = 9
	let totalItems = 250

	function goFirst() {
		currentPage = 0
	}

	function goPrevious() {
		if (currentPage > 0) currentPage -= 1
	}

	function goNext() {
		if (currentPage < lastPage) currentPage += 1
	}

	function goLast() {
		currentPage = lastPage
	}

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "class", type: "string", default: '""', description: "Custom CSS classes"},
		{name: "style", type: "string", default: '""', description: "Custom inline styles"},
		{name: "disabled", type: "boolean", default: "false", description: "Disables the paginator"},
		{name: "totalItemCount", type: "number", default: "undefined", description: "Total items"},
		{name: "currentPageIndex", type: "number", default: "0", description: "Current page (0-based)"},
		{name: "lastPageIndex", type: "number", default: "0", description: "Last page (0-based)"},
		{name: "canGoBack", type: "boolean", default: "true", description: "Allow navigating backwards"},
		{name: "canGoForwards", type: "boolean", default: "true", description: "Allow navigating forwards"}
	]

	const callbacks: Property[] = [
		{name: "onFirst", type: "function", default: "undefined", description: 'Fires when "go first" is clicked'},
		{name: "onPrevious", type: "function", default: "undefined", description: 'Fires when "go previous" is clicked'},
		{name: "onNext", type: "function", default: "undefined", description: 'Fires when "go next" is clicked'},
		{name: "onLast", type: "function", default: "undefined", description: 'Fires when "go last" is clicked'}
	]

	const slots: Property[] = [
		{name: "summaryTemplate", type: "SlotType", default: "undefined", description: "Custom summary markup"},
		{name: "paginationTextTemplate", type: "SlotType", default: "undefined", description: "Custom page info markup"}
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
		title="Paginator"
		description="A standalone Svelte pagination control with first, previous, next, and last buttons plus customizable summary templates. Inspired by FluentUI Blazor."
		keywords="svelte, fluentui, paginator, pagination, pager, navigation"
	/>

	<h1>Paginator</h1>

	<p>
		A standalone pagination control with first/previous/next/last buttons and customizable summary
		templates. Inspired by the FluentUI Blazor Paginator component.
	</p>

	<References links={[
		{label: "Paginator", custom: true},
		{label: "FluentUI Blazor", href: "https://www.fluentui-blazor.net/Paginator"}
	]} />

	<Card>
		<h2>Examples</h2>

		<h3>Basic paginator</h3>
		<Paginator
			totalItemCount={totalItems}
			currentPageIndex={currentPage}
			lastPageIndex={lastPage}
			canGoBack={currentPage > 0}
			canGoForwards={currentPage < lastPage}
			onFirst={goFirst}
			onPrevious={goPrevious}
			onNext={goNext}
			onLast={goLast}
		/>

		<h3>Disabled paginator</h3>
		<Paginator
			totalItemCount={totalItems}
			currentPageIndex={currentPage}
			lastPageIndex={lastPage}
			disabled={true}
		/>
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
