<script lang="ts">
	import {QuickGrid, Stack, Grid, GridItem, Card, Dialog, Button} from "svelte-fluentui"
	import {References} from "$lib/components"

	type PropertyRow = {
		name: string
		type: string
		default: string
		description: string
	}

	const propertyColumns = [
		{field: "name", title: "Property", width: "180px", sortable: true},
		{field: "type", title: "Type", width: "220px"},
		{field: "default", title: "Default", width: "100px"},
		{field: "description", title: "Description"}
	]

	const properties: PropertyRow[] = [
		{name: "contextMenu", type: "ContextMenuItem[]", default: "undefined", description: "Array of context menu item configurations shown on right-click"},
		{name: "oncontextmenuopen", type: "(context: ContextMenuContext) => void", default: "undefined", description: "Callback fired when the context menu opens, receives the click context"}
	]

	const callbacks: PropertyRow[] = [
		{name: "oncontextmenuopen", type: "(context: ContextMenuContext) => void", default: "—", description: "Fired when context menu opens. Receives row, rowIndex, colIndex, column, and cellValue"}
	]

	const slots: PropertyRow[] = [
		{name: "cellTemplate", type: "Snippet", default: "—", description: "Custom cell rendering snippet, available on the column definition via column.snippet"}
	]

	type ContextMenuItemRow = {
		name: string
		type: string
		required: string
		description: string
	}

	const contextMenuItemColumns = [
		{field: "name", title: "Property", width: "160px", sortable: true},
		{field: "type", title: "Type", width: "260px"},
		{field: "required", title: "Required", width: "90px", align: "center" as const},
		{field: "description", title: "Description"}
	]

	const contextMenuItems: ContextMenuItemRow[] = [
		{name: "id", type: "string", required: "yes", description: "Unique identifier for the menu item"},
		{name: "label", type: "string | (context) => string", required: "yes", description: "Display text — can be a static string or a function for dynamic labels based on context"},
		{name: "icon", type: "string", required: "no", description: "Optional icon displayed before the label (emoji or text)"},
		{name: "disabled", type: "boolean | (context) => boolean", required: "no", description: "Disables the item; accepts a static boolean or a function evaluated per-click"},
		{name: "visible", type: "boolean | (context) => boolean", required: "no", description: "Hides the item when false; accepts a static boolean or a function evaluated per-click"},
		{name: "danger", type: "boolean", required: "no", description: "Applies red/destructive styling to the item"},
		{name: "dividerBefore", type: "boolean", required: "no", description: "Renders a divider line above this item"},
		{name: "onclick", type: "(context) => void | Promise<void>", required: "no", description: "Click handler receiving the full ContextMenuContext"}
	]

	type ContextMenuContextRow = {
		name: string
		type: string
		description: string
	}

	const contextMenuContextColumns = [
		{field: "name", title: "Property", width: "140px", sortable: true},
		{field: "type", title: "Type", width: "160px"},
		{field: "description", title: "Description"}
	]

	const contextMenuContext: ContextMenuContextRow[] = [
		{name: "row", type: "T", description: "The full data object for the right-clicked row"},
		{name: "rowIndex", type: "number", description: "Zero-based index of the row in the currently displayed items"},
		{name: "colIndex", type: "number", description: "Zero-based index of the clicked column"},
		{name: "column", type: "Column<T>", description: "The column definition object for the clicked cell"},
		{name: "cellValue", type: "unknown", description: "The raw value of the clicked cell"}
	]

	type Product = {
		id: number
		name: string
		category: string
		price: number
		stock: number
		active: boolean
	}

	let products = $state<Product[]>([
		{id: 1, name: "Laptop Pro", category: "Electronics", price: 1299, stock: 15, active: true},
		{id: 2, name: "Wireless Mouse", category: "Electronics", price: 49, stock: 120, active: true},
		{id: 3, name: "Office Chair", category: "Furniture", price: 299, stock: 8, active: true},
		{id: 4, name: "Standing Desk", category: "Furniture", price: 599, stock: 3, active: false},
		{id: 5, name: "Monitor 27\"", category: "Electronics", price: 449, stock: 22, active: true},
		{id: 6, name: "Keyboard RGB", category: "Electronics", price: 89, stock: 65, active: true},
		{id: 7, name: "Desk Lamp", category: "Furniture", price: 45, stock: 0, active: false},
		{id: 8, name: "Webcam HD", category: "Electronics", price: 79, stock: 34, active: true}
	])

	// Message display
	let lastAction = $state<string>('')

	function showMessage(message: string) {
		lastAction = message
		setTimeout(() => { if (lastAction === message) lastAction = '' }, 3000)
	}

	// Currency conversion dialog
	let conversionDialogOpen = $state(false)
	let conversionData = $state<{productName: string, usd: number, eur: number} | null>(null)
	const USD_TO_EUR = 0.92  // Example rate

	function showConversionDialog(productName: string, priceUsd: number) {
		conversionData = {
			productName,
			usd: priceUsd,
			eur: priceUsd * USD_TO_EUR
		}
		conversionDialogOpen = true
	}

	const readOnlyColumns = [
		{field: "id", title: "ID", width: "80px", align: "center" as const},
		{field: "name", title: "Product Name", sortable: true},
		{field: "category", title: "Category", sortable: true},
		{field: "price", title: "Price", width: "120px", align: "right" as const, format: (v: number) => `$${v.toFixed(2)}`},
		{field: "stock", title: "Stock", width: "100px", align: "center" as const},
		{field: "active", title: "Status", width: "100px", align: "center" as const, format: (v: boolean) => v ? "✓" : "✗"}
	]

	// Read-only context menu
	const readOnlyContextMenu = [
		{
			id: 'view',
			label: 'View Details',
			icon: '👁️',
			onclick: (ctx: any) => {
				showMessage(`Viewing: ${ctx.row.name} (ID: ${ctx.row.id})`)
			}
		},
		{
			id: 'copy-cell',
			label: (ctx: any) => `Copy "${ctx.column.title}"`,
			icon: '📋',
			onclick: (ctx: any) => {
				navigator.clipboard.writeText(String(ctx.cellValue))
				showMessage(`Copied: ${ctx.cellValue}`)
			}
		},
		{
			id: 'copy-row',
			label: 'Copy Row as JSON',
			icon: '📄',
			onclick: (ctx: any) => {
				navigator.clipboard.writeText(JSON.stringify(ctx.row, null, 2))
				showMessage('Row copied as JSON')
			}
		},
		{
			id: 'convert-eur',
			label: 'Convert to Euro',
			icon: '💶',
			visible: (ctx: any) => ctx.column.field === 'price',
			onclick: (ctx: any) => {
				const eurPrice = (ctx.row.price * 0.92).toFixed(2)
				alert(`${ctx.row.name}\n\n$${ctx.row.price} USD = €${eurPrice} EUR`)
				showConversionDialog(ctx.row.name, ctx.row.price)
			}
		},
		{
			id: 'export',
			label: 'Export to CSV',
			icon: '📊',
			dividerBefore: true,
			onclick: (ctx: any) => {
				showMessage(`Would export: ${ctx.row.name}`)
			}
		}
	]

	// Editable grid columns
	const editableColumns = [
		{field: "id", title: "ID", width: "80px", align: "center" as const},
		{field: "name", title: "Product Name", sortable: true, isEditable: true, editor: "text" as const},
		{field: "category", title: "Category", sortable: true, isEditable: true, editor: "select" as const, editorOptions: {
			options: [
				{value: "Electronics", label: "Electronics"},
				{value: "Furniture", label: "Furniture"},
				{value: "Accessories", label: "Accessories"}
			]
		}},
		{field: "price", title: "Price", width: "120px", align: "right" as const, isEditable: true, editor: "number" as const, format: (v: number) => `$${v.toFixed(2)}`},
		{field: "stock", title: "Stock", width: "100px", align: "center" as const, isEditable: true, editor: "number" as const},
		{field: "active", title: "Active", width: "100px", align: "center" as const, isEditable: true, editor: "checkbox" as const}
	]

	// Editable context menu with conditional items
	const editableContextMenu = [
		{
			id: 'edit',
			label: 'Edit Cell',
			icon: '✏️',
			onclick: (ctx: any) => {
				showMessage(`Double-click the cell to edit "${ctx.column.title}"`)
			}
		},
		{
			id: 'duplicate',
			label: 'Duplicate Row',
			icon: '📑',
			onclick: (ctx: any) => {
				const newProduct = {...ctx.row, id: Math.max(...products.map(p => p.id)) + 1}
				products = [...products.slice(0, ctx.rowIndex + 1), newProduct, ...products.slice(ctx.rowIndex + 1)]
				showMessage(`Duplicated: ${ctx.row.name}`)
			}
		},
		{
			id: 'toggle-active',
			label: (ctx: any) => ctx.row.active ? 'Deactivate' : 'Activate',
			icon: '🔄',
			onclick: (ctx: any) => {
				products[ctx.rowIndex].active = !products[ctx.rowIndex].active
				showMessage(`${ctx.row.name} is now ${products[ctx.rowIndex].active ? 'active' : 'inactive'}`)
			}
		},
		{
			id: 'restock',
			label: 'Restock (+10)',
			icon: '📦',
			visible: (ctx: any) => ctx.row.stock < 20,
			onclick: (ctx: any) => {
				products[ctx.rowIndex].stock += 10
				showMessage(`${ctx.row.name} stock increased to ${products[ctx.rowIndex].stock}`)
			}
		},
		{
			id: 'delete',
			label: 'Delete',
			icon: '🗑️',
			danger: true,
			dividerBefore: true,
			disabled: (ctx: any) => ctx.row.active,
			onclick: (ctx: any) => {
				products = products.filter((_, i) => i !== ctx.rowIndex)
				showMessage(`Deleted: ${ctx.row.name}`)
			}
		}
	]

	function handleRowChange(detail: any) {
		if (detail.isValid) {
			products[detail.rowIndex] = {...products[detail.rowIndex], [detail.field]: detail.newValue}
		}
	}

	function handleContextMenuOpen(ctx: any) {
		console.log('Context menu opened:', ctx)
		console.log('Column field:', ctx.column.field)
		console.log('Is price column:', ctx.column.field === 'price')
	}
</script>

<!-- Currency Conversion Dialog -->
<Dialog
	bind:open={conversionDialogOpen}
	modal
	style="min-width: 320px;"
>
	{#snippet header()}
		<h3 style="margin: 0;">💶 Currency Conversion</h3>
	{/snippet}

	{#if conversionData}
		<div class="conversion-content">
			<p class="product-name">{conversionData.productName}</p>
			<div class="conversion-row">
				<span class="currency-label">USD</span>
				<span class="currency-value">${conversionData.usd.toFixed(2)}</span>
			</div>
			<div class="conversion-arrow">↓</div>
			<div class="conversion-row highlight">
				<span class="currency-label">EUR</span>
				<span class="currency-value">€{conversionData.eur.toFixed(2)}</span>
			</div>
			<p class="rate-info">Exchange rate: 1 USD = {USD_TO_EUR} EUR</p>
		</div>
	{/if}

	{#snippet footer()}
		<Button appearance="accent" onclick={() => conversionDialogOpen = false}>Close</Button>
	{/snippet}
</Dialog>

<Stack orientation="vertical" gap="1rem">
	<h1>QuickGrid Context Menu</h1>

	<p>
		QuickGrid supports right-click context menus that are cell and row aware. The context menu can be used
		in both read-only and editable grids, with support for dynamic labels, conditional visibility, and
		disabled states based on row/cell data.
	</p>

	<References links={[
		{label: "QuickGrid (Basic)", href: "/components/quickgrid"},
		{label: "QuickGrid Editable", href: "/components/quickgrid-editable"}
	]} />

	{#if lastAction}
		<div class="action-message">
			{lastAction}
		</div>
	{/if}



	<Card>
		<h2>Examples</h2>

		<h3>Read-Only Grid with Context Menu</h3>
		<p style="color: var(--neutral-foreground-hint);">
			Right-click any cell to see the context menu. Try "Copy Cell" to see dynamic labels based on column.
		</p>
		<QuickGrid
			items={products}
			columns={readOnlyColumns}
			sortable
			contextMenu={readOnlyContextMenu}
			oncontextmenuopen={handleContextMenuOpen}
		/>

		<h3>Editable Grid with Context Menu</h3>
		<p style="color: var(--neutral-foreground-hint);">
			Right-click to see context-aware options. Note: "Delete" is disabled for active products,
			"Restock" only appears for low-stock items (stock &lt; 20).
		</p>
		<QuickGrid
			items={products}
			columns={editableColumns}
			editable
			editTrigger="dblclick"
			contextMenu={editableContextMenu}
			onrowchange={handleRowChange}
		/>

		<h3>Example Usage</h3>
		<pre><code>{`<QuickGrid
  items={products}
  columns={columns}
  contextMenu={[
    {
      id: 'view',
      label: 'View Details',
      icon: '👁️',
      onclick: (ctx) => console.log('View:', ctx.row)
    },
    {
      id: 'copy',
      label: (ctx) => \`Copy "\${ctx.column.title}"\`,
      icon: '📋',
      onclick: (ctx) => navigator.clipboard.writeText(String(ctx.cellValue))
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: '🗑️',
      danger: true,
      dividerBefore: true,
      disabled: (ctx) => ctx.row.isProtected,
      visible: (ctx) => ctx.row.canDelete,
      onclick: (ctx) => deleteRow(ctx.rowIndex)
    }
  ]}
/>`}</code></pre>
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

	<Card>
		<h2>ContextMenuItem Properties</h2>
		<QuickGrid items={contextMenuItems} columns={contextMenuItemColumns} sortable filterable striped />
	</Card>

	<Card>
		<h2>ContextMenuContext Properties</h2>
		<QuickGrid items={contextMenuContext} columns={contextMenuContextColumns} sortable filterable striped />
	</Card>
</Stack>

<style>
	.action-message {
		padding: 12px 16px;
		background: var(--accent-fill-rest, #0078d4);
		color: white;
		border-radius: 4px;
		font-weight: 500;
		animation: fadeIn 0.2s ease;
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(-10px); }
		to { opacity: 1; transform: translateY(0); }
	}

	/* Conversion dialog styles */
	.conversion-content {
		text-align: center;
		padding: 1rem 0;
	}

	.product-name {
		font-weight: 600;
		font-size: 1.1rem;
		margin-bottom: 1.5rem;
		color: var(--neutral-foreground-rest);
	}

	.conversion-row {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		background: var(--neutral-layer-2, #f5f5f5);
	}

	.conversion-row.highlight {
		background: var(--accent-fill-rest, #0078d4);
		color: white;
	}

	.currency-label {
		font-weight: 600;
		font-size: 0.9rem;
		opacity: 0.8;
	}

	.currency-value {
		font-size: 1.5rem;
		font-weight: 700;
	}

	.conversion-arrow {
		font-size: 1.5rem;
		color: var(--neutral-foreground-hint);
		margin: 0.5rem 0;
	}

	.rate-info {
		margin-top: 1.5rem;
		font-size: 0.85rem;
		color: var(--neutral-foreground-hint);
	}

	[data-theme="dark"] .conversion-row:not(.highlight) {
		background: var(--neutral-layer-2, #2b2b2b);
	}


	pre {
		background: var(--neutral-layer-2, #f5f5f5);
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
	}

	pre code {
		background: none;
		padding: 0;
	}

	[data-theme="dark"] pre {
		background: var(--neutral-layer-2, #2b2b2b);
	}
</style>
