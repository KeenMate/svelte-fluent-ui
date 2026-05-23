<script lang="ts">
	import {QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "items", type: "T[]", default: "[]", description: "Array of data items to display"},
		{name: "columns", type: "Column<T>[]", default: "[]", description: "Column definitions"},
		{name: "sortable", type: "boolean", default: "false", description: "Enable sorting globally for all columns"},
		{name: "filterable", type: "boolean", default: "false", description: "Enable filtering globally for all columns"},
		{name: "pageable", type: "boolean", default: "false", description: "Enable pagination"},
		{name: "pageSize", type: "number", default: "10", description: "Number of items per page"},
		{name: "striped", type: "boolean", default: "true", description: "Alternate row background colors"},
		{name: "hoverable", type: "boolean", default: "true", description: "Highlight rows on mouse hover"},
		{name: "fillerColumn", type: "boolean", default: "false", description: "Append an empty trailing column that absorbs leftover horizontal space, so preceding columns keep their defined widths instead of stretching to justify"},
		{name: "editable", type: "boolean", default: "false", description: "Enable inline cell editing"},
		{name: "editTrigger", type: '"click" | "dblclick" | "button" | "always" | "navigate"', default: '"dblclick"', description: "How to trigger cell editing"},
		{name: "dropdownShowOnFocus", type: "boolean", default: "true", description: "Auto-show dropdown editor when cell is focused (navigate mode)"},
		{name: "checkboxAlwaysEditable", type: "boolean", default: "false", description: "Make checkbox cells always interactive regardless of edit trigger"},
		{name: "invalidCells", type: "CellValidationState[]", default: "[]", description: "Bindable array of cells with validation errors"},
		{name: "showRowToolbar", type: "boolean", default: "false", description: "Show floating row toolbar with action buttons"},
		{name: "rowToolbar", type: "RowToolbarConfig<T>[]", default: "undefined", description: 'Toolbar items — predefined strings ("add", "delete", "duplicate", "moveUp", "moveDown") or custom objects'},
		{name: "toolbarAlign", type: '"center" | "top"', default: '"center"', description: "Vertical alignment of the row toolbar"},
		{name: "toolbarTrigger", type: '"hover" | "click" | "button"', default: '"hover"', description: "How to reveal the row toolbar"},
		{name: "contextMenu", type: "ContextMenuItem<T>[]", default: "undefined", description: "Context menu items shown on right-click"},
		{name: "class", type: "string", default: '""', description: "Additional CSS class applied to the grid wrapper"},
		{name: "style", type: "string", default: '""', description: "Inline CSS style applied to the grid wrapper"}
	]

	const callbacks: Property[] = [
		{name: "onrowchange", type: "(detail: RowChangeDetail<T>) => void", default: "undefined", description: "Fired when a cell value is committed during inline editing. Detail includes row, draftRow, rowIndex, field, oldValue, newValue, isValid, validationError"},
		{name: "onroweditstart", type: "(detail: { row, rowIndex, field }) => void", default: "undefined", description: "Fired when a cell enters edit mode"},
		{name: "onroweditcancel", type: "(detail: { row, rowIndex, field }) => void", default: "undefined", description: "Fired when editing is cancelled (e.g. Escape key)"},
		{name: "onvalidationerror", type: "(detail: { row, rowIndex, field, error }) => void", default: "undefined", description: "Fired when a commit is blocked by a validation error"},
		{name: "ontoolbarclick", type: "(detail: ToolbarClickDetail<T>) => void", default: "undefined", description: "Fired when a row toolbar button is clicked. Detail includes item, rowIndex, row"},
		{name: "oncontextmenuopen", type: "(context: ContextMenuContext<T>) => void", default: "undefined", description: "Fired when the context menu is opened. Receives row, rowIndex, colIndex, column, cellValue"}
	]

	const slots: Property[] = [
		{name: "cellTemplate", type: "Snippet", default: "undefined", description: "Custom cell content snippet. Replaces default cell rendering for all cells. Receives the current row as argument via Column.snippet per column"}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]

	type Person = {
		id: number
		name: string
		email: string
		age: number
		city: string
		active: boolean
	}

	const sampleData: Person[] = [
		{id: 1, name: "Alice Johnson", email: "alice@example.com", age: 28, city: "New York", active: true},
		{id: 2, name: "Bob Smith", email: "bob@example.com", age: 34, city: "Los Angeles", active: true},
		{id: 3, name: "Carol White", email: "carol@example.com", age: 26, city: "Chicago", active: false},
		{id: 4, name: "David Brown", email: "david@example.com", age: 42, city: "Houston", active: true},
		{id: 5, name: "Eve Davis", email: "eve@example.com", age: 31, city: "Phoenix", active: true},
		{id: 6, name: "Frank Miller", email: "frank@example.com", age: 29, city: "Philadelphia", active: false},
		{id: 7, name: "Grace Lee", email: "grace@example.com", age: 37, city: "San Antonio", active: true},
		{id: 8, name: "Henry Wilson", email: "henry@example.com", age: 25, city: "San Diego", active: true},
		{id: 9, name: "Iris Moore", email: "iris@example.com", age: 33, city: "Dallas", active: false},
		{id: 10, name: "Jack Taylor", email: "jack@example.com", age: 39, city: "San Jose", active: true},
		{id: 11, name: "Karen Anderson", email: "karen@example.com", age: 27, city: "Austin", active: true},
		{id: 12, name: "Leo Thomas", email: "leo@example.com", age: 36, city: "Jacksonville", active: false},
		{id: 13, name: "Mary Martinez", email: "mary@example.com", age: 30, city: "Fort Worth", active: true},
		{id: 14, name: "Nancy Garcia", email: "nancy@example.com", age: 32, city: "Columbus", active: true},
		{id: 15, name: "Oscar Rodriguez", email: "oscar@example.com", age: 41, city: "Charlotte", active: false}
	]

	const basicColumns = [
		{field: "id", title: "ID", width: "80px"},
		{field: "name", title: "Name"},
		{field: "email", title: "Email"},
		{field: "city", title: "City"}
	]

	const sortableColumns = [
		{field: "id", title: "ID", width: "80px", sortable: true},
		{field: "name", title: "Name", sortable: true},
		{field: "age", title: "Age", width: "100px", sortable: true, align: "center" as const},
		{field: "city", title: "City", sortable: true}
	]

	const filterableColumns = [
		{field: "name", title: "Name", filterable: true},
		{field: "email", title: "Email", filterable: true},
		{field: "city", title: "City", filterable: true}
	]

	const formattedColumns = [
		{field: "id", title: "ID", width: "80px"},
		{field: "name", title: "Name"},
		{field: "age", title: "Age", width: "100px", align: "center" as const},
		{
			field: "active",
			title: "Status",
			width: "120px",
			align: "center" as const,
			format: (value: boolean) => (value ? "✓ Active" : "✗ Inactive")
		}
	]

	// Sample data extended with long bios for the nowrap demo. Bios are deliberately long
	// enough to wrap by default so the difference between wrap / nowrap / nowrap+maxWidth is obvious.
	type PersonWithBio = Person & {bio: string}
	const sampleDataWithBios: PersonWithBio[] = sampleData.slice(0, 6).map((p, i) => ({
		...p,
		bio: [
			"Senior staff engineer with over a decade of distributed-systems experience and a long history of speaking at conferences",
			"Product manager focused on developer tools, growth platforms, and quietly making the documentation better than anyone asked for",
			"Designer turned half-engineer who spends weekends restoring vintage synths and rewriting CSS at 2am",
			"Researcher in human-computer interaction whose papers nobody reads but whose talks accidentally pack rooms",
			"Operations lead who keeps the lights on, the runbooks current, and the on-call rotation merciful",
			"Founding engineer with a deep hatred of YAML and a deeper love of Postgres"
		][i]
	}))

	const nowrapColumns = [
		{field: "id", title: "ID", width: "60px", align: "center" as const},
		{field: "name", title: "Name", autoWidth: true, nowrap: true},
		{field: "city", title: "City", autoWidth: true, nowrap: true},
		{field: "bio", title: "Bio (truncates)", maxWidth: "260px", nowrap: true}
	]

	const wrapColumns = [
		{field: "id", title: "ID", width: "60px", align: "center" as const},
		{field: "name", title: "Name"},
		{field: "city", title: "City"},
		{field: "bio", title: "Bio (wraps)", maxWidth: "260px"}
	]

	const allFeaturesColumns = [
		{field: "id", title: "ID", width: "80px", sortable: true, align: "center" as const},
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "email", title: "Email", filterable: true},
		{field: "age", title: "Age", width: "100px", sortable: true, align: "center" as const},
		{field: "city", title: "City", sortable: true, filterable: true},
		{
			field: "active",
			title: "Status",
			width: "120px",
			sortable: true,
			filterable: false,
			align: "center" as const,
			format: (value: boolean) => (value ? "✓ Active" : "✗ Inactive")
		}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<Meta
		title="QuickGrid"
		description="A lightweight, flexible Svelte data grid with sorting, filtering, and pagination support. Inspired by ASP.NET QuickGrid."
		keywords="svelte, fluentui, quickgrid, data grid, table, sortable, filterable, pagination"
	/>

	<h1>QuickGrid</h1>

	<p>
		A lightweight, flexible data grid component with sorting, filtering, and pagination support. Inspired by ASP.NET QuickGrid.
	</p>

	<References links={[
		{label: "QuickGrid", custom: true},
		{label: "ASP.NET QuickGrid (Inspiration)", href: "https://aspnet.github.io/quickgridsamples/"},
		{label: "QuickGrid Editable", href: "/components/quickgrid-editable"},
		{label: "QuickGrid Context Menu", href: "/components/quickgrid-contextmenu"}
	]} />

	<Card>
		<h2>Examples</h2>

		<h3>Basic Grid</h3>
		<p>Simple grid with default settings:</p>
		<QuickGrid items={sampleData} columns={basicColumns} />

		<h3>Sortable Grid</h3>
		<p>Click column headers to sort (supports string, number, and mixed types):</p>
		<QuickGrid items={sampleData} columns={sortableColumns} sortable />

		<h3>Filterable Grid</h3>
		<p>Type in the filter inputs to search (case-insensitive):</p>
		<QuickGrid items={sampleData} columns={filterableColumns} filterable />

		<h3>Paginated Grid</h3>
		<p>Grid with pagination (5 items per page):</p>
		<QuickGrid items={sampleData} columns={basicColumns} pageable pageSize={5} />

		<h3>Custom Formatting</h3>
		<p>Use format function to customize cell display:</p>
		<QuickGrid items={sampleData} columns={formattedColumns} />

		<h3>All Features Combined</h3>
		<p>Sorting, filtering, pagination, and custom formatting:</p>
		<QuickGrid
			items={sampleData}
			columns={allFeaturesColumns}
			sortable
			filterable
			pageable
			pageSize={7}
		/>

		<h3>Nowrap columns &amp; ellipsis truncation</h3>
		<p>
			<code>column.nowrap: true</code> forces body cells onto a single line. Combined with <code>autoWidth</code> the column sizes to
			<code>max(header text, longest cell value)</code> — useful for ID / code / short name columns. Combined with <code>maxWidth</code>
			the column is capped and long values truncate with an ellipsis instead of overflowing or wrapping.
		</p>
		<p>Compare default wrapping (top) with nowrap + ellipsis (bottom):</p>

		<h4 style="margin: 1rem 0 0.5rem;">Default — wrapping</h4>
		<QuickGrid items={sampleDataWithBios} columns={wrapColumns} fillerColumn columnMinWidth="6rem" />

		<h4 style="margin: 1.5rem 0 0.5rem;">With <code>nowrap: true</code> — single-line + ellipsis</h4>
		<QuickGrid items={sampleDataWithBios} columns={nowrapColumns} fillerColumn columnMinWidth="6rem" />

		<h3>No Stripes, No Hover</h3>
		<p>Grid without alternating row colors or hover effects:</p>
		<QuickGrid items={sampleData} columns={basicColumns} striped={false} hoverable={false} />

		<h3>Editable Grid</h3>
		<p>QuickGrid supports inline editing with multiple editor types, validation, dynamic options loading, and custom editors.</p>
		<p><a href="/components/quickgrid-editable">See QuickGrid Editable documentation</a> for examples and full API reference.</p>
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
		<h2>Column Definition</h2>
		<table class="member-table">
			<thead>
				<tr>
					<th>Property</th>
					<th>Type</th>
					<th>Default</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>field</td>
					<td>keyof T | string</td>
					<td>required</td>
					<td>Field name from data item</td>
				</tr>
				<tr>
					<td>title</td>
					<td>string</td>
					<td>required</td>
					<td>Column header text</td>
				</tr>
				<tr>
					<td>sortable</td>
					<td>boolean</td>
					<td>undefined</td>
					<td>Enable sorting for this column</td>
				</tr>
				<tr>
					<td>filterable</td>
					<td>boolean</td>
					<td>undefined</td>
					<td>Enable filtering for this column</td>
				</tr>
				<tr>
					<td>width</td>
					<td>string</td>
					<td>undefined</td>
					<td>Column width. Any CSS length (e.g. <code>"120px"</code>, <code>"20%"</code>, <code>"10rem"</code>). Ignored when <code>autoWidth</code> is true</td>
				</tr>
				<tr>
					<td>minWidth</td>
					<td>string</td>
					<td>undefined</td>
					<td>CSS <code>min-width</code> for the column (e.g. <code>"80px"</code>)</td>
				</tr>
				<tr>
					<td>maxWidth</td>
					<td>string</td>
					<td>undefined</td>
					<td>CSS <code>max-width</code> for the column (e.g. <code>"320px"</code>)</td>
				</tr>
				<tr>
					<td>autoWidth</td>
					<td>boolean</td>
					<td>undefined</td>
					<td>Size column to its header content and prevent it from stretching. Pair with grid-level <code>fillerColumn</code> so the freed space is absorbed by a trailing empty column instead of redistributing to other columns</td>
				</tr>
				<tr>
					<td>nowrap</td>
					<td>boolean</td>
					<td>undefined</td>
					<td>Body cells never wrap. With <code>maxWidth</code>, long content truncates with an ellipsis. With <code>autoWidth</code>, sizes the column to <code>max(header, longest cell)</code>. Without <code>maxWidth</code>, very long values will widen the column unbounded — set a <code>maxWidth</code> if you want a hard cap</td>
				</tr>
				<tr>
					<td>align</td>
					<td>"left" | "center" | "right"</td>
					<td>"left"</td>
					<td>Text alignment</td>
				</tr>
				<tr>
					<td>format</td>
					<td>(value, row) =&gt; string</td>
					<td>undefined</td>
					<td>Custom cell formatter</td>
				</tr>
				<tr>
					<td>isEditable</td>
					<td>boolean | (row) =&gt; boolean</td>
					<td>undefined</td>
					<td>Enable editing (<a href="/components/quickgrid-editable">see editable docs</a>). Pass a callback for per-row decisions (e.g. only edit leaf rows in a tree)</td>
				</tr>
			</tbody>
		</table>
	</Card>
</Stack>
