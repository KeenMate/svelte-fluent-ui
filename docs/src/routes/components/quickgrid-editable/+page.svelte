<script lang="ts">
	import {QuickGrid, Stack, Grid, GridItem, Card, Dialog, Button} from "svelte-fluentui"

	type Person = {
		id: number
		name: string
		email: string
		age: number
		city: string
		active: boolean
		role?: string
		metadata?: Record<string, any>
	}

	let sampleData: Person[] = $state([
		{id: 1, name: "Alice Johnson", email: "alice@example.com", age: 28, city: "New York", active: true, role: "admin", metadata: {theme: "dark", notifications: true}},
		{id: 2, name: "Bob Smith", email: "bob@example.com", age: 34, city: "Los Angeles", active: true, role: "user", metadata: {theme: "light", language: "en"}},
		{id: 3, name: "Carol White", email: "carol@example.com", age: 26, city: "Chicago", active: false, role: "user", metadata: null},
		{id: 4, name: "David Brown", email: "david@example.com", age: 42, city: "Houston", active: true, role: "moderator", metadata: {permissions: ["read", "write"]}},
		{id: 5, name: "Eve Davis", email: "eve@example.com", age: 31, city: "Phoenix", active: true, role: "user", metadata: {theme: "auto"}},
		{id: 6, name: "Frank Miller", email: "frank@example.com", age: 29, city: "Philadelphia", active: false, role: "user"},
		{id: 7, name: "Grace Lee", email: "grace@example.com", age: 37, city: "San Antonio", active: true, role: "admin", metadata: {dashboard: {widgets: ["stats", "chart"]}}},
		{id: 8, name: "Henry Wilson", email: "henry@example.com", age: 25, city: "San Diego", active: true, role: "user"},
		{id: 9, name: "Iris Moore", email: "iris@example.com", age: 33, city: "Dallas", active: false, role: "moderator", metadata: {notes: "VIP customer"}},
		{id: 10, name: "Jack Taylor", email: "jack@example.com", age: 39, city: "San Jose", active: true, role: "user"},
		{id: 11, name: "Karen Anderson", email: "karen@example.com", age: 27, city: "Austin", active: true, role: "user"},
		{id: 12, name: "Leo Thomas", email: "leo@example.com", age: 36, city: "Jacksonville", active: false, role: "user"},
		{id: 13, name: "Mary Martinez", email: "mary@example.com", age: 30, city: "Fort Worth", active: true, role: "moderator"},
		{id: 14, name: "Nancy Garcia", email: "nancy@example.com", age: 32, city: "Columbus", active: true, role: "user"},
		{id: 15, name: "Oscar Rodriguez", email: "oscar@example.com", age: 41, city: "Charlotte", active: false, role: "admin", metadata: {verified: true, level: 5}}
	])

	// Editable columns configuration
	const editableColumns = [
		{field: "id", title: "ID", width: "80px", align: "center" as const},
		{field: "name", title: "Name", editable: true, editor: "text" as const},
		{field: "age", title: "Age", width: "100px", align: "center" as const, editable: true, editor: "number" as const, editorOptions: {min: 0, max: 120}},
		{field: "city", title: "City", editable: true, editor: "text" as const},
		{field: "active", title: "Active", width: "100px", align: "center" as const, editable: true, editor: "checkbox" as const},
		{
			field: "role",
			title: "Role",
			width: "150px",
			editable: true,
			editor: "select" as const,
			editorOptions: {
				options: [
					{value: "admin", label: "Administrator"},
					{value: "moderator", label: "Moderator"},
					{value: "user", label: "User"}
				]
			}
		}
	]

	// Always editable columns (Excel-like spreadsheet)
	const alwaysEditableColumns = [
		{field: "id", title: "ID", width: "60px", align: "center" as const},
		{field: "name", title: "Name", editable: true, editor: "text" as const, editTrigger: "always" as const},
		{field: "age", title: "Age", width: "80px", align: "center" as const, editable: true, editor: "number" as const, editTrigger: "always" as const, editorOptions: {min: 0, max: 120}},
		{field: "city", title: "City", editable: true, editor: "text" as const, editTrigger: "always" as const},
		{field: "active", title: "Active", width: "80px", align: "center" as const, editable: true, editor: "checkbox" as const, editTrigger: "always" as const}
	]

	// Navigate mode columns (arrow keys to move, type to edit)
	const navigateColumns = [
		{field: "id", title: "ID", width: "60px", align: "center" as const},
		{field: "name", title: "Name", editable: true, editor: "text" as const},
		{field: "age", title: "Age", width: "80px", align: "center" as const, editable: true, editor: "number" as const, editorOptions: {min: 0, max: 120}},
		{field: "city", title: "City", editable: true, editor: "text" as const},
		{field: "active", title: "Active", width: "80px", align: "center" as const, editable: true, editor: "checkbox" as const},
		{
			field: "metadata",
			title: "Metadata",
			width: "150px",
			editable: true,
			editor: "custom" as const,
			showEditButton: true,
			format: (value: any) => value ? JSON.stringify(value).substring(0, 20) + (JSON.stringify(value).length > 20 ? "..." : "") : "(empty)",
			oncelledit: (context: CustomEditorContext) => {
				jsonEditorContext = context
				jsonEditorValue = context.value ? JSON.stringify(context.value, null, 2) : ""
				jsonError = null
				jsonDialogOpen = true
			}
		}
	]

	// Mixed edit triggers columns
	const mixedTriggerColumns = [
		{field: "id", title: "ID", width: "60px", align: "center" as const},
		{field: "name", title: "Name (dblclick)", editable: true, editor: "text" as const, editTrigger: "dblclick" as const},
		{field: "city", title: "City (click)", editable: true, editor: "text" as const, editTrigger: "click" as const},
		{field: "age", title: "Age (button)", width: "100px", align: "center" as const, editable: true, editor: "number" as const, editTrigger: "button" as const, showEditButton: true},
		{field: "active", title: "Active (always)", width: "100px", align: "center" as const, editable: true, editor: "checkbox" as const, editTrigger: "always" as const}
	]

	// Custom JSON editor columns
	type CustomEditorContext = {
		value: any
		row: Person
		rowIndex: number
		field: string
		commit: (newValue: any) => void
		cancel: () => void
	}

	let jsonDialogOpen = $state(false)
	let jsonEditorContext = $state<CustomEditorContext | null>(null)
	let jsonEditorValue = $state("")
	let jsonError = $state<string | null>(null)
	let jsonTextarea: HTMLTextAreaElement | undefined = $state()

	// Autofocus textarea when dialog opens
	$effect(() => {
		if (jsonDialogOpen && jsonTextarea) {
			// Small delay to ensure dialog is fully rendered
			setTimeout(() => jsonTextarea?.focus(), 50)
		}
	})

	const jsonEditorColumns = [
		{field: "id", title: "ID", width: "60px", align: "center" as const},
		{field: "name", title: "Name", editable: true, editor: "text" as const},
		{field: "email", title: "Email", editable: true, editor: "text" as const},
		{
			field: "metadata",
			title: "Metadata (JSON)",
			width: "200px",
			editable: true,
			editor: "custom" as const,
			showEditButton: true,
			format: (value: any) => value ? JSON.stringify(value).substring(0, 30) + (JSON.stringify(value).length > 30 ? "..." : "") : "(empty)",
			oncelledit: (context: CustomEditorContext) => {
				jsonEditorContext = context
				jsonEditorValue = context.value ? JSON.stringify(context.value, null, 2) : ""
				jsonError = null
				jsonDialogOpen = true
			}
		}
	]

	function handleJsonSave() {
		if (!jsonEditorContext) return

		try {
			const parsed = jsonEditorValue.trim() ? JSON.parse(jsonEditorValue) : null
			jsonEditorContext.commit(parsed)
			jsonDialogOpen = false
			jsonEditorContext = null
			jsonError = null
		} catch (e) {
			jsonError = "Invalid JSON: " + (e as Error).message
		}
	}

	function handleJsonCancel() {
		jsonEditorContext?.cancel()
		jsonDialogOpen = false
		jsonEditorContext = null
		jsonError = null
	}

	let lastChange = $state<string>("")

	function handleRowChange(detail: {row: Person; rowIndex: number; field: string; oldValue: any; newValue: any}) {
		// Update the data
		sampleData[detail.rowIndex] = {...detail.row, [detail.field]: detail.newValue}
		lastChange = `Changed ${detail.field}: "${JSON.stringify(detail.oldValue)}" → "${JSON.stringify(detail.newValue)}" (row ${detail.rowIndex + 1})`
	}
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>QuickGrid Editable</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="/components/quickgrid">QuickGrid (Basic)</a>
			|
			<span style="color: #999; cursor: not-allowed;" title="Custom component">QuickGrid Editable (Custom)</span>
		</p>
	</Card>

	<p>
		QuickGrid supports inline editing with multiple editor types, edit triggers, validation, and advanced callbacks. This page covers all editable features.
	</p>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6}>
			<Card>
				<h2>Editing Props (QuickGrid)</h2>
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
							<td>editable</td>
							<td>boolean</td>
							<td>false</td>
							<td>Enable inline editing mode</td>
						</tr>
						<tr>
							<td>editTrigger</td>
							<td>"click" | "dblclick" | "button" | "always" | "navigate"</td>
							<td>"dblclick"</td>
							<td>How to trigger cell editing</td>
						</tr>
						<tr>
							<td>onrowchange</td>
							<td>(detail) =&gt; void</td>
							<td>undefined</td>
							<td>Callback when cell value changes</td>
						</tr>
						<tr>
							<td>onroweditstart</td>
							<td>(detail) =&gt; void</td>
							<td>undefined</td>
							<td>Callback when cell enters edit mode</td>
						</tr>
						<tr>
							<td>onroweditcancel</td>
							<td>(detail) =&gt; void</td>
							<td>undefined</td>
							<td>Callback when editing is cancelled</td>
						</tr>
						<tr>
							<td>onvalidationerror</td>
							<td>(detail) =&gt; void</td>
							<td>undefined</td>
							<td>Callback when validation fails</td>
						</tr>
					</tbody>
				</table>
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6}>
			<Card>
				<h2>Column Editing Props</h2>
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
							<td>editable</td>
							<td>boolean</td>
							<td>undefined</td>
							<td>Enable editing for this column</td>
						</tr>
						<tr>
							<td>editor</td>
							<td>"text" | "number" | "checkbox" | "select" | "date" | "custom"</td>
							<td>"text"</td>
							<td>Editor type for this column</td>
						</tr>
						<tr>
							<td>editTrigger</td>
							<td>"click" | "dblclick" | "button" | "always" | "navigate"</td>
							<td>grid default</td>
							<td>Per-column edit trigger override</td>
						</tr>
						<tr>
							<td>editorOptions</td>
							<td>object</td>
							<td>undefined</td>
							<td>Editor options (min/max, options, loadOptions)</td>
						</tr>
						<tr>
							<td>validate</td>
							<td>(value, row) =&gt; string | null | Promise</td>
							<td>undefined</td>
							<td>Sync or async validation function</td>
						</tr>
						<tr>
							<td>oncelledit</td>
							<td>(context) =&gt; void</td>
							<td>undefined</td>
							<td>Custom editor callback (for editor="custom")</td>
						</tr>
						<tr>
							<td>showEditButton</td>
							<td>boolean</td>
							<td>false</td>
							<td>Show edit button in cell</td>
						</tr>
					</tbody>
				</table>
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2>Edit Triggers</h2>
		<table class="member-table">
			<thead>
				<tr>
					<th>Trigger</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>dblclick</td>
					<td>Double-click to enter edit mode (default)</td>
				</tr>
				<tr>
					<td>click</td>
					<td>Single-click to enter edit mode</td>
				</tr>
				<tr>
					<td>button</td>
					<td>Click the edit button to enter edit mode</td>
				</tr>
				<tr>
					<td>always</td>
					<td>Cell is always in edit mode (spreadsheet-like)</td>
				</tr>
				<tr>
					<td>navigate</td>
					<td>Arrow key navigation with type-to-edit (Excel-like)</td>
				</tr>
			</tbody>
		</table>
	</Card>

	<Card>
		<h2>Editable Grid (Double-click)</h2>
		<p>Double-click any editable cell to edit. Press <strong>Enter</strong> to save, <strong>Escape</strong> to cancel. Supports text, number, checkbox, and select editors.</p>
		<QuickGrid
			items={sampleData}
			columns={editableColumns}
			editable
			editTrigger="dblclick"
			onrowchange={handleRowChange}
			pageable
			pageSize={8}
		/>
		{#if lastChange}
			<p style="margin-top: 1rem; padding: 0.5rem; background: var(--neutral-layer-2, #f5f5f5); border-radius: 4px;">
				<strong>Last change:</strong> {lastChange}
			</p>
		{/if}
	</Card>

	<Card>
		<h2>Always Editable (Spreadsheet Mode)</h2>
		<p>All cells are always in edit mode - like a spreadsheet. Try using <strong>Tab</strong> to move between cells.</p>
		<QuickGrid
			items={sampleData}
			columns={alwaysEditableColumns}
			editable
			onrowchange={handleRowChange}
			pageable
			pageSize={10}
			striped={false}
		/>
	</Card>

	<Card>
		<h2>Navigate Mode (Excel-like)</h2>
		<p>Click a cell to focus, then use keyboard to navigate and edit:</p>
		<table class="member-table" style="margin-bottom: 1rem;">
			<thead>
				<tr>
					<th>Key</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				<tr><td>Arrow keys</td><td>Move between editable cells</td></tr>
				<tr><td>Tab / Shift+Tab</td><td>Move to next/previous cell</td></tr>
				<tr><td>Enter / F2</td><td>Enter edit mode</td></tr>
				<tr><td>Space</td><td>Toggle checkbox</td></tr>
				<tr><td>Escape</td><td>Cancel editing, return to navigation</td></tr>
				<tr><td>Any character</td><td>Start editing and type (text/number fields)</td></tr>
				<tr><td>Enter (while editing)</td><td>Commit and move to cell below</td></tr>
			</tbody>
		</table>
		<QuickGrid
			items={sampleData}
			columns={navigateColumns}
			editable
			editTrigger="navigate"
			onrowchange={handleRowChange}
			pageable
			pageSize={10}
		/>
	</Card>

	<Card>
		<h2>Mixed Edit Triggers</h2>
		<p>Different columns can have different edit triggers:</p>
		<QuickGrid
			items={sampleData}
			columns={mixedTriggerColumns}
			editable
			onrowchange={handleRowChange}
			pageable
			pageSize={8}
		/>
	</Card>

	<Card>
		<h2>Custom Editor: JSON in Dialog</h2>
		<p>Click the edit button (✎) in the Metadata column to open a JSON editor dialog. This demonstrates using <code>editor: "custom"</code> with <code>oncelledit</code> callback.</p>
		<QuickGrid
			items={sampleData}
			columns={jsonEditorColumns}
			editable
			onrowchange={handleRowChange}
			pageable
			pageSize={8}
		/>
	</Card>

	<!-- JSON Editor Dialog -->
	<Dialog
		visible={jsonDialogOpen}
		modal
		size="small"
		onClose={handleJsonCancel}
	>
		<div class="json-editor-dialog">
			<h3>Edit JSON Metadata</h3>
			<p style="margin-bottom: 0.5rem; color: var(--neutral-foreground-hint, #707070);">
				Editing: {jsonEditorContext?.row?.name ?? ""}
			</p>
			<textarea
				bind:this={jsonTextarea}
				class="json-textarea"
				bind:value={jsonEditorValue}
				placeholder={'{"key": "value"}'}
				rows={12}
			></textarea>
			{#if jsonError}
				<p class="json-error">{jsonError}</p>
			{/if}
			<div class="json-dialog-actions">
				<Button appearance="neutral" onclick={handleJsonCancel}>Cancel</Button>
				<Button appearance="accent" onclick={handleJsonSave}>Save</Button>
			</div>
		</div>
	</Dialog>

	<Card>
		<h2>Basic Editable Code Example</h2>
		<pre>{`<script lang="ts">
  type Person = {
    id: number
    name: string
    age: number
    active: boolean
    role: string
  }

  let data: Person[] = $state([
    { id: 1, name: "Alice", age: 28, active: true, role: "admin" },
    { id: 2, name: "Bob", age: 34, active: false, role: "user" }
  ])

  const columns = [
    { field: "id", title: "ID", width: "80px" },
    { field: "name", title: "Name", editable: true, editor: "text" },
    { field: "age", title: "Age", editable: true, editor: "number",
      editorOptions: { min: 0, max: 120 } },
    { field: "active", title: "Active", editable: true, editor: "checkbox" },
    {
      field: "role",
      title: "Role",
      editable: true,
      editor: "select",
      editorOptions: {
        options: [
          { value: "admin", label: "Administrator" },
          { value: "user", label: "User" }
        ]
      }
    }
  ]

  function handleRowChange(detail) {
    // Update data - the component does NOT mutate your data
    data[detail.rowIndex] = {
      ...detail.row,
      [detail.field]: detail.newValue
    }
  }
</script>

<QuickGrid
  items={data}
  columns={columns}
  editable
  editTrigger="dblclick"
  onrowchange={handleRowChange}
/>`}</pre>
	</Card>

	<Card>
		<h2>Async Validation</h2>
		<p>QuickGrid supports both synchronous and asynchronous validation. The cell shows a loading state during async validation.</p>
		<pre>{`const columns = [
  {
    field: "email",
    title: "Email",
    editable: true,
    editor: "text",
    // Supports both sync and async validation
    validate: async (value, row) => {
      // Async API call to check uniqueness
      const exists = await checkEmailExists(value, row.id)
      return exists ? "Email already in use" : null
    }
  }
]

<QuickGrid
  items={data}
  columns={columns}
  editable
  onvalidationerror={(detail) => {
    console.log(\`Validation failed: \${detail.error}\`)
  }}
/>`}</pre>
	</Card>

	<Card>
		<h2>Dynamic Options Loading</h2>
		<p>Select and autocomplete editors can load options dynamically with configurable timing.</p>
		<table class="member-table" style="margin-bottom: 1rem;">
			<thead>
				<tr>
					<th>optionsLoadTrigger</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr><td>immediate</td><td>Load once when grid mounts, cache forever</td></tr>
				<tr><td>oneditstart</td><td>Load when cell enters edit mode (default)</td></tr>
				<tr><td>ondropdownopen</td><td>Load when dropdown opens (lazy)</td></tr>
			</tbody>
		</table>
		<pre>{`const columns = [
  {
    field: "departmentId",
    title: "Department",
    editable: true,
    editor: "select",
    editorOptions: {
      // Load options dynamically
      loadOptions: async (row, field) => {
        const departments = await fetchDepartments(row.companyId)
        return departments.map(d => ({ value: d.id, label: d.name }))
      },
      optionsLoadTrigger: "ondropdownopen"
    }
  }
]`}</pre>
	</Card>

	<Card>
		<h2>Custom Editor (Dialog)</h2>
		<p>Use <code>editor: "custom"</code> with <code>oncelledit</code> callback to implement custom editors like dialogs, JSON editors, color pickers, etc.</p>
		<pre>{`<script>
  let showJsonDialog = false
  let jsonEditorContext = null

  const columns = [
    {
      field: "metadata",
      title: "Metadata",
      editable: true,
      editor: "custom",
      showEditButton: true,  // Shows edit icon in cell
      format: (value) => value ? "{ ... }" : "(empty)",
      oncelledit: (context) => {
        // context provides: value, row, rowIndex, field, commit(), cancel()
        jsonEditorContext = context
        showJsonDialog = true
      }
    }
  ]

  function handleJsonSave(newJson) {
    jsonEditorContext?.commit(newJson)  // Fires onrowchange
    showJsonDialog = false
  }
</script>

<QuickGrid {items} {columns} editable onrowchange={handleRowChange} />

{#if showJsonDialog}
  <Dialog open onclose={() => jsonEditorContext?.cancel()}>
    <JsonEditor
      value={jsonEditorContext?.value}
      onsave={handleJsonSave}
    />
  </Dialog>
{/if}`}</pre>
	</Card>

	<Card>
		<h2>CustomEditorContext</h2>
		<p>The context object passed to <code>oncelledit</code>:</p>
		<table class="member-table">
			<thead>
				<tr>
					<th>Property</th>
					<th>Type</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr><td>value</td><td>any</td><td>Current cell value</td></tr>
				<tr><td>row</td><td>T</td><td>Full row data</td></tr>
				<tr><td>rowIndex</td><td>number</td><td>Row index in current view</td></tr>
				<tr><td>field</td><td>string</td><td>Field name being edited</td></tr>
				<tr><td>commit</td><td>(newValue) =&gt; void</td><td>Call to save new value (fires onrowchange)</td></tr>
				<tr><td>cancel</td><td>() =&gt; void</td><td>Call to cancel editing</td></tr>
			</tbody>
		</table>
	</Card>

	<Card>
		<h2>EditorOptions</h2>
		<p>Options available in <code>editorOptions</code> depending on editor type:</p>
		<table class="member-table">
			<thead>
				<tr>
					<th>Property</th>
					<th>Type</th>
					<th>Editors</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr><td>options</td><td>EditorOption[]</td><td>select, autocomplete</td><td>Static options array</td></tr>
				<tr><td>loadOptions</td><td>(row, field) =&gt; Promise&lt;EditorOption[]&gt;</td><td>select, autocomplete</td><td>Dynamic options loader</td></tr>
				<tr><td>optionsLoadTrigger</td><td>"immediate" | "oneditstart" | "ondropdownopen"</td><td>select, autocomplete</td><td>When to load dynamic options</td></tr>
				<tr><td>min</td><td>number</td><td>number</td><td>Minimum value</td></tr>
				<tr><td>max</td><td>number</td><td>number</td><td>Maximum value</td></tr>
				<tr><td>step</td><td>number</td><td>number</td><td>Step increment</td></tr>
				<tr><td>maxLength</td><td>number</td><td>text</td><td>Maximum character length</td></tr>
				<tr><td>onSearch</td><td>(query, row) =&gt; Promise&lt;EditorOption[]&gt;</td><td>autocomplete</td><td>Search callback for autocomplete</td></tr>
			</tbody>
		</table>
	</Card>
</Stack>

<style>
	.json-editor-dialog {
		padding: 1rem;
	}

	.json-editor-dialog h3 {
		margin: 0 0 0.5rem 0;
	}

	.json-textarea {
		width: 100%;
		font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
		font-size: 13px;
		padding: 0.75rem;
		border: 1px solid var(--neutral-stroke-input-rest, #d1d1d1);
		border-radius: var(--control-corner-radius, 4px);
		background: var(--neutral-layer-1, #ffffff);
		color: var(--neutral-foreground-rest, #242424);
		resize: vertical;
		box-sizing: border-box;
	}

	.json-textarea:focus {
		outline: none;
		border-color: var(--accent-fill-rest, #0078d4);
		box-shadow: 0 0 0 1px var(--accent-fill-rest, #0078d4);
	}

	.json-error {
		color: var(--error-foreground, #d13438);
		font-size: 0.875rem;
		margin: 0.5rem 0;
	}

	.json-dialog-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	:global([data-theme="dark"]) .json-textarea {
		background: var(--neutral-layer-1, #1f1f1f);
		color: var(--neutral-foreground-rest, #e0e0e0);
		border-color: var(--neutral-stroke-input-rest, #5a5a5a);
	}
</style>
