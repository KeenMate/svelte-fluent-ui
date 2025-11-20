<script lang="ts" generics="T">
	import type {Snippet} from "svelte"
	import type {SlotType} from "../types/index.js"

	type Column<T> = {
		field: keyof T | string
		title: string
		sortable?: boolean
		filterable?: boolean
		width?: string
		align?: "left" | "center" | "right"
		format?: (value: any, row: T) => string
		template?: (row: T) => string
		snippet?: Snippet<[T]>
	}

	type Props<T> = {
		items: T[]
		columns: Column<T>[]
		sortable?: boolean
		filterable?: boolean
		pageable?: boolean
		pageSize?: number
		striped?: boolean
		hoverable?: boolean
		class?: string
		style?: string
		cellTemplate?: SlotType
	}

	let {
		items = [],
		columns = [],
		sortable = false,
		filterable = false,
		pageable = false,
		pageSize = 10,
		striped = true,
		hoverable = true,
		class: className = "",
		style = "",
		cellTemplate = undefined
	}: Props<T> = $props()

	// Sorting state
	let sortColumn = $state<string | null>(null)
	let sortDirection = $state<"asc" | "desc">("asc")

	// Filtering state
	let filters = $state<Record<string, string>>({})

	// Pagination state
	let currentPage = $state(1)

	// Computed: filtered items
	let filteredItems = $derived.by(() => {
		if (!filterable || Object.keys(filters).length === 0) return items

		return items.filter((item) => {
			return Object.entries(filters).every(([field, filterValue]) => {
				if (!filterValue) return true
				const cellValue = String(item[field as keyof T] ?? "").toLowerCase()
				return cellValue.includes(filterValue.toLowerCase())
			})
		})
	})

	// Computed: sorted items
	let sortedItems = $derived.by(() => {
		if (!sortColumn) return filteredItems

		return [...filteredItems].sort((a, b) => {
			const aVal = a[sortColumn as keyof T]
			const bVal = b[sortColumn as keyof T]

			if (aVal === bVal) return 0

			let comparison = 0
			if (typeof aVal === "string" && typeof bVal === "string") {
				comparison = aVal.localeCompare(bVal)
			} else if (typeof aVal === "number" && typeof bVal === "number") {
				comparison = aVal - bVal
			} else {
				comparison = String(aVal).localeCompare(String(bVal))
			}

			return sortDirection === "asc" ? comparison : -comparison
		})
	})

	// Computed: paginated items
	let paginatedItems = $derived.by(() => {
		if (!pageable) return sortedItems

		const start = (currentPage - 1) * pageSize
		const end = start + pageSize
		return sortedItems.slice(start, end)
	})

	// Computed: total pages
	let totalPages = $derived(Math.ceil(sortedItems.length / pageSize))

	// Display items (final result)
	let displayItems = $derived(paginatedItems)

	function handleSort(column: Column<T>) {
		if (!sortable || !column.sortable) return

		const field = String(column.field)
		if (sortColumn === field) {
			sortDirection = sortDirection === "asc" ? "desc" : "asc"
		} else {
			sortColumn = field
			sortDirection = "asc"
		}
	}

	function handleFilter(field: string, value: string) {
		filters[field] = value
		currentPage = 1 // Reset to first page when filtering
	}

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page
		}
	}

	function getCellValue(item: T, column: Column<T>): string {
		if (column.template) {
			return column.template(item)
		}
		const value = item[column.field as keyof T]
		if (column.format) {
			return column.format(value, item)
		}
		return String(value ?? "")
	}

	function hasTemplate(column: Column<T>): boolean {
		return !!column.template
	}

	function hasSnippet(column: Column<T>): boolean {
		return !!column.snippet
	}

	let computedClass = $derived(`quickgrid ${striped ? "striped" : ""} ${hoverable ? "hoverable" : ""} ${className}`.trim())
</script>

<div class="quickgrid-container" {style} >
	<table class={computedClass}>
		<thead>
			{#if filterable}
				<tr class="filter-row">
					{#each columns as column}
						<th style={column.width ? `width: ${column.width}` : ""}>
							{#if column.filterable !== false}
								<input
									type="text"
									class="filter-input"
									placeholder="Filter..."
									value={filters[String(column.field)] || ""}
									oninput={(e) => handleFilter(String(column.field), e.currentTarget.value)}
								/>
							{/if}
						</th>
					{/each}
				</tr>
			{/if}
			<tr>
				{#each columns as column}
					<th
						class={`column-header ${column.sortable !== false && sortable ? "sortable" : ""} ${
							sortColumn === String(column.field) ? `sorted sorted-${sortDirection}` : ""
						}`}
						style={column.width ? `width: ${column.width}; text-align: ${column.align || "left"}` : `text-align: ${column.align || "left"}`}
						onclick={() => handleSort(column)}
					>
						<div class="column-header-content">
							<span>{column.title}</span>
							{#if column.sortable !== false && sortable}
								<span class="sort-indicator">
									{#if sortColumn === String(column.field)}
										{sortDirection === "asc" ? "▲" : "▼"}
									{:else}
										<span class="sort-placeholder">⬍</span>
									{/if}
								</span>
							{/if}
						</div>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#if displayItems.length === 0}
				<tr>
					<td colspan={columns.length} class="empty-message">
						No items to display
					</td>
				</tr>
			{:else}
				{#each displayItems as item, rowIndex}
					<tr>
						{#each columns as column}
							<td style={`text-align: ${column.align || "left"}`}>
								{#if hasSnippet(column)}
									{@render column.snippet?.(item)}
								{:else if hasTemplate(column)}
									{@html getCellValue(item, column)}
								{:else}
									{getCellValue(item, column)}
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>

	{#if pageable && totalPages > 1}
		<div class="pagination">
			<button
				class="pagination-btn"
				disabled={currentPage === 1}
				onclick={() => goToPage(currentPage - 1)}
			>
				Previous
			</button>

			<div class="pagination-info">
				Page {currentPage} of {totalPages}
				<span class="item-count">
					({sortedItems.length} item{sortedItems.length !== 1 ? "s" : ""})
				</span>
			</div>

			<button
				class="pagination-btn"
				disabled={currentPage === totalPages}
				onclick={() => goToPage(currentPage + 1)}
			>
				Next
			</button>
		</div>
	{/if}
</div>

<style>
	.quickgrid-container {
		width: 100%;
		overflow-x: auto;
	}

	.quickgrid {
		width: 100%;
		border-collapse: collapse;
		border: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		background: var(--neutral-layer-1, #ffffff);
		font-size: var(--type-ramp-base-font-size, 14px);
		line-height: var(--type-ramp-base-line-height, 20px);
	}

	.column-header {
		background: var(--neutral-layer-2, #f5f5f5);
		color: var(--neutral-foreground-rest, #242424);
		font-weight: var(--font-weight-semibold, 600);
		padding: calc(var(--design-unit) * 2px) calc(var(--design-unit) * 3px);
		border-bottom: 2px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		text-align: left;
		user-select: none;
	}

	.column-header.sortable {
		cursor: pointer;
	}

	.column-header.sortable:hover {
		background: var(--neutral-layer-3, #ebebeb);
	}

	.column-header-content {
		display: flex;
		align-items: center;
		gap: 4px;
		justify-content: space-between;
	}

	.sort-indicator {
		font-size: 10px;
		opacity: 0.8;
		min-width: 12px;
		text-align: center;
	}

	.sort-placeholder {
		opacity: 0.3;
	}

	.column-header.sorted {
		background: var(--neutral-layer-3, #ebebeb);
	}

	.filter-row th {
		padding: calc(var(--design-unit) * 1px) calc(var(--design-unit) * 2px);
		background: var(--neutral-layer-1, #ffffff);
		border-bottom: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
	}

	.filter-input {
		width: 100%;
		padding: 4px 8px;
		border: 1px solid var(--neutral-stroke-input-rest, #d1d1d1);
		border-radius: var(--control-corner-radius, 4px);
		background: var(--neutral-layer-1, #ffffff);
		color: var(--neutral-foreground-rest, #242424);
		font-size: 12px;
		box-sizing: border-box;
	}

	.filter-input:focus {
		outline: none;
		border-color: var(--accent-fill-rest, #0078d4);
		box-shadow: 0 0 0 1px var(--accent-fill-rest, #0078d4);
	}

	tbody tr {
		border-bottom: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
	}

	tbody td {
		padding: calc(var(--design-unit) * 2px) calc(var(--design-unit) * 3px);
		color: var(--neutral-foreground-rest, #242424);
	}

	.quickgrid.striped tbody tr:nth-child(even) {
		background: var(--neutral-layer-2, #fafafa);
	}

	.quickgrid.hoverable tbody tr:hover {
		background: var(--neutral-layer-3, #f0f0f0);
	}

	.empty-message {
		text-align: center;
		padding: calc(var(--design-unit) * 6px);
		color: var(--neutral-foreground-hint, #707070);
		font-style: italic;
	}

	.pagination {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		padding: calc(var(--design-unit) * 3px);
		border-top: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		background: var(--neutral-layer-1, #ffffff);
	}

	.pagination-btn {
		padding: 6px 16px;
		background: var(--neutral-layer-1, #ffffff);
		border: 1px solid var(--neutral-stroke-input-rest, #d1d1d1);
		border-radius: var(--control-corner-radius, 4px);
		color: var(--neutral-foreground-rest, #242424);
		font-size: var(--type-ramp-base-font-size, 14px);
		cursor: pointer;
		transition: all 0.1s ease;
	}

	.pagination-btn:hover:not(:disabled) {
		background: var(--neutral-layer-2, #f5f5f5);
		border-color: var(--neutral-stroke-input-hover, #a0a0a0);
	}

	.pagination-btn:active:not(:disabled) {
		background: var(--neutral-layer-3, #ebebeb);
	}

	.pagination-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.pagination-info {
		font-size: var(--type-ramp-base-font-size, 14px);
		color: var(--neutral-foreground-rest, #242424);
	}

	.item-count {
		font-size: 12px;
		color: var(--neutral-foreground-hint, #707070);
		margin-left: 4px;
	}

	/* Dark mode support */
	[data-theme="dark"] .quickgrid {
		background: var(--neutral-layer-1, #1f1f1f);
		border-color: var(--neutral-stroke-layer-rest, #3d3d3d);
	}

	[data-theme="dark"] .column-header {
		background: var(--neutral-layer-2, #2b2b2b);
		color: var(--neutral-foreground-rest, #e0e0e0);
	}

	[data-theme="dark"] tbody td {
		color: var(--neutral-foreground-rest, #e0e0e0);
	}

	[data-theme="dark"] .quickgrid.striped tbody tr:nth-child(even) {
		background: var(--neutral-layer-2, #262626);
	}

	[data-theme="dark"] .quickgrid.hoverable tbody tr:hover {
		background: var(--neutral-layer-3, #333333);
	}
</style>
