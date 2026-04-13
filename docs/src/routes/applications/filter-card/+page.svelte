<script lang="ts">
	import {
		Card,
		Stack,
		Grid,
		GridItem,
		TextField,
		Select,
		Option,
		Autocomplete,
		Button,
		Badge,
		QuickGrid,
		Icon
	} from "svelte-fluentui"

	type Product = {
		id: number
		name: string
		category: string
		tags: string[]
		price: number
		stock: number
	}

	const allProducts: Product[] = [
		{id: 1, name: "Aurora Wireless Headphones", category: "electronics", tags: ["audio", "wireless", "premium"], price: 249, stock: 34},
		{id: 2, name: "Nimbus Ergonomic Chair", category: "furniture", tags: ["office", "ergonomic"], price: 499, stock: 12},
		{id: 3, name: "Pulse Smart Watch", category: "electronics", tags: ["wearable", "fitness"], price: 329, stock: 58},
		{id: 4, name: "Glacier Water Bottle", category: "accessories", tags: ["outdoor", "eco"], price: 29, stock: 220},
		{id: 5, name: "Ember Desk Lamp", category: "furniture", tags: ["office", "lighting"], price: 79, stock: 41},
		{id: 6, name: "Orbit Mechanical Keyboard", category: "electronics", tags: ["office", "premium"], price: 159, stock: 19},
		{id: 7, name: "Cascade Running Shoes", category: "apparel", tags: ["fitness", "outdoor"], price: 139, stock: 77},
		{id: 8, name: "Terra Yoga Mat", category: "accessories", tags: ["fitness", "eco"], price: 49, stock: 134},
		{id: 9, name: "Solstice Bluetooth Speaker", category: "electronics", tags: ["audio", "wireless"], price: 119, stock: 63},
		{id: 10, name: "Meridian Travel Backpack", category: "accessories", tags: ["outdoor", "travel"], price: 189, stock: 27},
		{id: 11, name: "Zephyr Windbreaker Jacket", category: "apparel", tags: ["outdoor"], price: 99, stock: 52},
		{id: 12, name: "Halo Standing Desk", category: "furniture", tags: ["office", "ergonomic", "premium"], price: 699, stock: 8}
	]

	const categoryOptions = [
		{value: "", text: "All categories"},
		{value: "electronics", text: "Electronics"},
		{value: "furniture", text: "Furniture"},
		{value: "accessories", text: "Accessories"},
		{value: "apparel", text: "Apparel"}
	]

	const tagOptions = [
		{value: "audio", text: "Audio"},
		{value: "wireless", text: "Wireless"},
		{value: "premium", text: "Premium"},
		{value: "office", text: "Office"},
		{value: "ergonomic", text: "Ergonomic"},
		{value: "wearable", text: "Wearable"},
		{value: "fitness", text: "Fitness"},
		{value: "outdoor", text: "Outdoor"},
		{value: "eco", text: "Eco"},
		{value: "lighting", text: "Lighting"},
		{value: "travel", text: "Travel"}
	]

	let searchQuery = $state("")
	let categoryValue = $state("")
	let selectedTags = $state<string[]>([])

	const filtered = $derived(
		allProducts.filter((p) => {
			const q = searchQuery.trim().toLowerCase()
			const matchesQuery = !q || p.name.toLowerCase().includes(q)
			const matchesCategory = !categoryValue || p.category === categoryValue
			const matchesTags = selectedTags.length === 0 || selectedTags.every((t) => p.tags.includes(t))
			return matchesQuery && matchesCategory && matchesTags
		})
	)

	const columns = [
		{field: "name", title: "Product", sortable: true, filterable: true},
		{field: "category", title: "Category", sortable: true, filterable: true},
		{field: "tags", title: "Tags", render: (row: Product) => row.tags.join(", ")},
		{field: "price", title: "Price", sortable: true, align: "right" as const, render: (row: Product) => `$${row.price}`},
		{field: "stock", title: "Stock", sortable: true, align: "right" as const}
	]

	function resetFilters() {
		searchQuery = ""
		categoryValue = ""
		selectedTags = []
	}
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Filter Card</h1>

	<Card>
		<p>
			A common real-life pattern: a card holding a row of filters that narrow down
			a result set. This example combines a <strong>TextField</strong> for free-text
			search, a <strong>Select</strong> for a single-value category filter, and an
			<strong>Autocomplete</strong> for multi-tag selection — all on one line,
			with a <strong>QuickGrid</strong> reacting to the filters.
		</p>
	</Card>

	<Card>
		<Stack orientation="vertical" gap="1rem">
			<div class="filter-row">
				<div class="filter-item filter-item-search">
					<TextField
						label="Search"
						placeholder="Search products by name..."
						bind:value={searchQuery}
					/>
				</div>

				<div class="filter-item filter-item-select">
					<Select label="Category" bind:value={categoryValue}>
						{#snippet children()}
							{#each categoryOptions as opt}
								<Option value={opt.value}>{opt.text}</Option>
							{/each}
						{/snippet}
					</Select>
				</div>

				<div class="filter-item filter-item-tags">
					<Autocomplete
						label="Tags"
						placeholder="Filter by tags..."
						options={tagOptions}
						bind:selectedOptions={selectedTags}
					/>
				</div>

				<div class="filter-item filter-item-actions">
					<Button appearance="stealth" onclick={resetFilters}>
						<Icon name="dismiss" size={16} />
						Reset
					</Button>
				</div>
			</div>

			<div class="filter-summary">
				<Badge appearance="accent">{filtered.length} / {allProducts.length} results</Badge>
				{#if selectedTags.length > 0}
					{#each selectedTags as tag}
						<Badge appearance="neutral">{tag}</Badge>
					{/each}
				{/if}
			</div>
		</Stack>
	</Card>

	<Card>
		<QuickGrid items={filtered} {columns} sortable filterable striped />
	</Card>

	<Card>
		<h2>How it works</h2>
		<Grid spacing={3}>
			<GridItem xs={12} md={4}>
				<Stack orientation="vertical" gap="0.25rem">
					<strong>TextField</strong>
					<small>Case-insensitive substring match against product name, bound to <code>searchQuery</code>.</small>
				</Stack>
			</GridItem>
			<GridItem xs={12} md={4}>
				<Stack orientation="vertical" gap="0.25rem">
					<strong>Select</strong>
					<small>Single-value category dropdown bound to <code>categoryValue</code>. Empty string means "all".</small>
				</Stack>
			</GridItem>
			<GridItem xs={12} md={4}>
				<Stack orientation="vertical" gap="0.25rem">
					<strong>Autocomplete</strong>
					<small>Multi-tag picker bound to <code>selectedTags</code>. A product must contain <em>every</em> selected tag.</small>
				</Stack>
			</GridItem>
		</Grid>
	</Card>
</Stack>

<style>
	.filter-row {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: flex-end;
	}

	.filter-item {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.filter-item-search {
		flex: 2 1 240px;
	}

	.filter-item-select {
		flex: 1 1 180px;
	}

	.filter-item-tags {
		flex: 2 1 260px;
	}

	.filter-item-actions {
		flex: 0 0 auto;
		padding-bottom: 2px;
	}

	.filter-summary {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
	}

	@media (max-width: 768px) {
		.filter-row {
			flex-direction: column;
			align-items: stretch;
		}

		.filter-item {
			width: 100%;
		}
	}
</style>
