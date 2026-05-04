<script lang="ts">
	import {QuickGrid, Stack, Grid, GridItem, Card} from "svelte-fluentui"

	type Org = {
		path: string
		name: string
		head: string
		headcount: number
		budget: number
		region: string
	}

	// Path-based hierarchy ("ltree"): each row carries its full path; parents come before children.
	const orgs: Org[] = [
		{path: "1",         name: "Acme Corp",            head: "J. Stark",     headcount: 1240, budget: 12_500_000, region: "Global"},
		{path: "1.1",       name: "Engineering",          head: "P. Parker",    headcount: 520,  budget: 5_800_000,  region: "Global"},
		{path: "1.1.1",     name: "Platform",             head: "T. Stark",     headcount: 140,  budget: 1_900_000,  region: "US"},
		{path: "1.1.1.1",   name: "Identity Squad",       head: "N. Romanoff",  headcount: 22,   budget: 290_000,    region: "US"},
		{path: "1.1.1.2",   name: "Storage Squad",        head: "S. Rogers",    headcount: 18,   budget: 240_000,    region: "US"},
		{path: "1.1.2",     name: "Product",              head: "B. Banner",    headcount: 210,  budget: 2_400_000,  region: "EU"},
		{path: "1.1.2.1",   name: "Web Squad",            head: "W. Maximoff",  headcount: 34,   budget: 410_000,    region: "EU"},
		{path: "1.1.2.2",   name: "Mobile Squad",         head: "C. Barton",    headcount: 28,   budget: 360_000,    region: "EU"},
		{path: "1.1.3",     name: "Infrastructure",       head: "S. Strange",   headcount: 170,  budget: 1_500_000,  region: "Global"},
		{path: "1.2",       name: "Sales",                head: "P. Potts",     headcount: 320,  budget: 3_100_000,  region: "Global"},
		{path: "1.2.1",     name: "AMER",                 head: "S. Wilson",    headcount: 140,  budget: 1_500_000,  region: "US"},
		{path: "1.2.2",     name: "EMEA",                 head: "T. Odinson",   headcount: 110,  budget: 1_000_000,  region: "EU"},
		{path: "1.2.3",     name: "APAC",                 head: "S. Cassidy",   headcount: 70,   budget: 600_000,    region: "APAC"},
		{path: "1.3",       name: "Operations",           head: "N. Fury",      headcount: 200,  budget: 2_200_000,  region: "Global"},
		{path: "1.3.1",     name: "People",               head: "M. Hill",      headcount: 60,   budget: 700_000,    region: "Global"},
		{path: "1.3.2",     name: "Finance",              head: "J. Rhodes",    headcount: 80,   budget: 900_000,    region: "Global"}
	]

	// Numeric range filter: parses ">N", "<N", ">=N", "<=N", "=N", or falls back to substring.
	// Returns `null` when the input starts with an operator but isn't yet a complete
	// `op + number` — the grid then ignores this filter (no rows hidden) and paints the
	// input red. Plain text without an operator is treated as a substring search.
	function numericRangeFilter(field: keyof Org) {
		return (filterValue: string, row: Org): boolean | null => {
			const trimmed = filterValue.trim()
			if (!trimmed) return true
			const opMatch = trimmed.match(/^(>=|<=|>|<|=)\s*(-?\d+(?:\.\d+)?)$/)
			if (!opMatch) {
				if (/^[<>=]/.test(trimmed)) return null
				return String(row[field]).includes(trimmed)
			}
			const cell = Number(row[field])
			const [, op, numStr] = opMatch
			const n = Number(numStr)
			if (!Number.isFinite(n) || !Number.isFinite(cell)) return null
			if (op === ">")  return cell >  n
			if (op === "<")  return cell <  n
			if (op === ">=") return cell >= n
			if (op === "<=") return cell <= n
			if (op === "=")  return cell === n
			return null
		}
	}

	const orgColumns = [
		{field: "name",      title: "Organization", isTree: true,    sortable: false, filterable: true,  minWidth: "260px"},
		{field: "head",      title: "Head",         filterable: true},
		{field: "headcount", title: "Headcount",    align: "right" as const, width: "120px",
		 filterable: true, filter: numericRangeFilter("headcount"),
		 format: (v: number) => v.toLocaleString()},
		{field: "budget",    title: "Budget",       align: "right" as const, width: "150px",
		 filterable: true, filter: numericRangeFilter("budget"),
		 format: (v: number) => "$" + v.toLocaleString()},
		{field: "region",    title: "Region",       width: "120px", filterable: true}
	]

	// Path-based with pre-computed level + parent path (DB-side calculation pattern)
	type Folder = {
		path: string
		parentPath: string
		level: number
		name: string
		size: string
		modified: string
	}

	const folders: Folder[] = [
		{path: "C:\\Windows",                       parentPath: "C:",                       level: 1, name: "Windows",          size: "—",      modified: "2026-04-01"},
		{path: "C:\\Windows\\System32",             parentPath: "C:\\Windows",              level: 2, name: "System32",         size: "8.2 GB", modified: "2026-04-12"},
		{path: "C:\\Windows\\System32\\drivers",    parentPath: "C:\\Windows\\System32",    level: 3, name: "drivers",          size: "1.1 GB", modified: "2026-04-12"},
		{path: "C:\\Windows\\System32\\config",     parentPath: "C:\\Windows\\System32",    level: 3, name: "config",           size: "240 MB", modified: "2026-04-08"},
		{path: "C:\\Windows\\Temp",                 parentPath: "C:\\Windows",              level: 2, name: "Temp",             size: "120 MB", modified: "2026-04-29"},
		{path: "C:\\Users",                         parentPath: "C:",                       level: 1, name: "Users",            size: "—",      modified: "2026-04-30"},
		{path: "C:\\Users\\Public",                 parentPath: "C:\\Users",                level: 2, name: "Public",           size: "12 MB",  modified: "2026-03-22"},
		{path: "C:\\Users\\Default",                parentPath: "C:\\Users",                level: 2, name: "Default",          size: "8 MB",   modified: "2026-03-22"}
	]

	const folderColumns = [
		{field: "name",     title: "Name",     isTree: true, filterable: true, minWidth: "260px"},
		{field: "size",     title: "Size",     width: "100px", align: "right" as const},
		{field: "modified", title: "Modified", width: "140px"}
	]

	// API tables (Properties / Callbacks / Slots / Column Properties)
	type PropertyRow = {name: string; type: string; default: string; description: string}

	const properties: PropertyRow[] = [
		{name: "treePathMember",          type: "keyof T",                default: "undefined", description: "Required to enable tree mode. Field on each row that holds the ltree-style path string (e.g. \"1.2.3\", \"/1/2/3\", \"C:\\foo\\bar\")."},
		{name: "treeLevelMember",         type: "keyof T",                default: "undefined", description: "Optional. Field on each row that holds a pre-computed depth (0-based). Falls back to deriving from path."},
		{name: "treeParentMember",        type: "keyof T",                default: "undefined", description: "Optional. Field on each row that holds the parent path. Falls back to deriving from path."},
		{name: "treeSeparator",           type: "string",                 default: "auto",      description: "Path separator. Auto-detected from items by scanning for \"/\", \"\\\\\", or \".\"."},
		{name: "treeDataSorted",          type: "boolean",                default: "false",     description: "True when items are already sorted so parents precede children. False sorts internally by path with numeric-aware segment comparison."},
		{name: "expandedPaths",           type: "Set<string>",            default: "undefined", description: "Bindable. Set of expanded path strings. When omitted, expansion is managed internally."},
		{name: "defaultExpandDepth",      type: "number",                 default: "undefined", description: "Initial expansion depth when expandedPaths is not bound. Interpreted relative to the dataset's shallowest level. Omit to expand all on first render."},
		{name: "treeDoubleClickBehavior", type: '"none" | "toggle"',      default: '"none"',    description: "When \"toggle\", a double-click anywhere on the tree column toggles expand/collapse on rows that have children. Wins over edit triggers on the tree column."},
		{name: "idMember",                type: "keyof T",                default: "undefined", description: "Field that uniquely identifies a row. Drafts and invalid-cell markers key by it so they survive pagination, filter, sort, and tree expand/collapse re-orderings. In tree mode, treePathMember is the fallback."},
		{name: "columnMinWidth",          type: "string",                 default: "undefined", description: "Default min-width applied to every column header without its own minWidth. Useful with fillerColumn to stop content-sized columns from collapsing too far. Skipped on autoWidth columns."},
		{name: "fillerColumn",            type: "boolean",                default: "false",     description: "Append an empty trailing column with width: 100% so leftover horizontal space lands on the filler instead of an arbitrary content column."}
	]

	const callbacks: PropertyRow[] = [
		{name: "onfilterchange", type: "(filters: Record<string, string>) => void", default: "undefined", description: "When provided, internal client-side filtering is bypassed entirely. Filter inputs still render and fire this callback with a copy of the current {field: value} map on every keystroke. Caller is expected to update items (typical server-side pattern: debounce, post to backend, replace items)."}
	]

	const slots: PropertyRow[] = [
		{name: "—", type: "—", default: "—", description: "Tree mode adds no new slots. Per-cell rendering still uses the column-level format / template / snippet hooks documented on the main QuickGrid page."}
	]

	const columnProperties: PropertyRow[] = [
		{name: "isTree", type: "boolean", default: "undefined", description: "Mark this column as the tree column. It renders the indentation (level × 1.25rem padding-inline-start) and the expand/collapse chevron."},
		{name: "filter", type: "(filterValue: string, row: T) => boolean | null", default: "undefined", description: "Custom filter predicate that replaces the built-in substring match for this column. Return true/false to keep/drop the row, or null when the input string is syntactically invalid (e.g. \">\" without a number) — the grid then ignores the filter for that column AND adds a .invalid class to the input so the user sees a red border."}
	]

	const propertyColumns = [
		{field: "name",        title: "Name",        sortable: true, filterable: true},
		{field: "type",        title: "Type",        sortable: true, filterable: true},
		{field: "default",     title: "Default",     sortable: true},
		{field: "description", title: "Description", filterable: true}
	]

	// Bindable expansion demo
	let expanded = $state(new Set<string>(["1", "1.1"]))

	// Toggle for the dbl-click-to-expand demo (default on)
	let dblClickToggle = $state(true)

	// === Mixed-editability tree (teams + employees) ===
	// Heterogeneous tree where parent rows (teams) are read-only summaries and
	// only the leaves (employees) are editable. Demonstrates `column.isEditable`
	// as a per-row predicate so role/salary can be edited on employees but not on
	// the team rows that aggregate them.
	type TeamRow = {
		path: string
		kind: "team" | "employee"
		name: string
		role?: string       // employees only
		salary?: number     // employees only
		lead?: string       // teams only
		headcount?: number  // teams only
	}

	let teamData = $state<TeamRow[]>([
		{path: "1",     kind: "team",     name: "Platform",  lead: "T. Stark",     headcount: 3},
		{path: "1.1",   kind: "employee", name: "N. Romanoff", role: "Senior Engineer", salary: 145000},
		{path: "1.2",   kind: "employee", name: "S. Rogers",   role: "Engineer",        salary: 110000},
		{path: "1.3",   kind: "employee", name: "P. Parker",   role: "Junior Engineer", salary: 78000},
		{path: "2",     kind: "team",     name: "Product",   lead: "B. Banner",    headcount: 3},
		{path: "2.1",   kind: "employee", name: "W. Maximoff", role: "PM",              salary: 130000},
		{path: "2.2",   kind: "employee", name: "C. Barton",   role: "Designer",        salary: 105000},
		{path: "2.3",   kind: "employee", name: "S. Strange",  role: "Researcher",      salary: 120000}
	])

	const isEmployee = (row: TeamRow) => row.kind === "employee"

	const teamColumns = [
		{field: "name", title: "Name", isTree: true, minWidth: "260px"},
		{
			field: "kind",
			title: "Type",
			width: "110px",
			format: (v: string) => v === "team" ? "Team" : "Employee"
		},
		{
			field: "role",
			title: "Role",
			width: "180px",
			isEditable: isEmployee,           // per-row predicate — only employees
			editor: "text" as const,
			format: (v: string | undefined) => v ?? "—"
		},
		{
			field: "salary",
			title: "Salary",
			width: "140px",
			align: "right" as const,
			isEditable: isEmployee,
			editor: "number" as const,
			editorOptions: {min: 0, max: 1_000_000, step: 1000},
			format: (v: number | undefined) => v === undefined ? "—" : "$" + v.toLocaleString()
		},
		{
			field: "headcount",
			title: "Headcount",
			width: "120px",
			align: "right" as const,
			format: (v: number | undefined) => v === undefined ? "—" : String(v)
		}
	]

	let lastTeamChange = $state("")

	function handleTeamRowChange(detail: {row: TeamRow; draftRow: TeamRow; rowIndex: number; field: string; oldValue: unknown; newValue: unknown; isValid: boolean}) {
		if (!detail.isValid) return
		teamData[detail.rowIndex] = {...detail.draftRow}
		lastTeamChange = `${detail.draftRow.name}: ${detail.field} → ${JSON.stringify(detail.newValue)}`
	}
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>QuickGrid Tree</h1>

	<p>
		QuickGrid renders hierarchical data when each row carries a path string (PostgreSQL ltree style: <code>1.2.3</code>, POSIX-style <code>/1/2/3</code>, or Windows-style <code>C:\foo\bar</code>).
		Mark one column with <code>isTree: true</code> and the grid handles indentation, expand/collapse, ancestor-aware filtering, and optional double-click-to-toggle.
	</p>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="/components/quickgrid">QuickGrid</a>
			|
			<a href="/components/quickgrid-editable">QuickGrid Editable</a>
			|
			<a href="/components/quickgrid-contextmenu">QuickGrid Context Menu</a>
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Properties</h2>
				<QuickGrid items={properties} columns={propertyColumns} sortable filterable striped fillerColumn />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Callbacks</h2>
				<QuickGrid items={callbacks} columns={propertyColumns} sortable filterable striped fillerColumn />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Slots</h2>
				<QuickGrid items={slots} columns={propertyColumns} striped fillerColumn />
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2>Column Properties</h2>
		<QuickGrid items={columnProperties} columns={propertyColumns} sortable filterable striped fillerColumn />
	</Card>

	<Card>
		<h2>Examples</h2>

		<h3>Basic — derived level &amp; parent</h3>
		<p>
			Only <code>treePathMember</code> is provided. Level and parent path are derived from the dot-separated path. Filter is ancestor-aware: matched rows force their parents visible.
			Double-click anywhere on the Organization column to toggle expand/collapse — controlled by <code>treeDoubleClickBehavior</code>.
		</p>
		<p>
			The <strong>Headcount</strong> and <strong>Budget</strong> columns use a column-level <code>filter</code> callback to parse range operators —
			try <code>&gt;500</code> or <code>&lt;=50</code> on Headcount, <code>&gt;1000000</code> or <code>&lt;500000</code> on Budget.
			A plain number falls back to substring match. Typing just <code>&gt;</code> paints the input red and leaves all rows visible until you finish.
		</p>
		<label style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
			<input type="checkbox" bind:checked={dblClickToggle} />
			<span><code>treeDoubleClickBehavior</code> = <code>{dblClickToggle ? "toggle" : "none"}</code></span>
		</label>
		<QuickGrid
			items={orgs}
			columns={orgColumns}
			treePathMember="path"
			treeDoubleClickBehavior={dblClickToggle ? "toggle" : "none"}
			filterable
			striped
			fillerColumn
			columnMinWidth="8rem"
		/>

		<h3>Pre-computed level &amp; parent</h3>
		<p>
			Same data shape but with <code>level</code> and <code>parentPath</code> pre-computed in the database, so the grid does not parse the path string at all. Uses <code>\</code> as the separator (auto-detected). <code>defaultExpandDepth=&#123;1&#125;</code> shows only the dataset's roots expanded initially (depth is interpreted relative to the shallowest level present).
		</p>
		<QuickGrid
			items={folders}
			columns={folderColumns}
			treePathMember="path"
			treeLevelMember="level"
			treeParentMember="parentPath"
			treeDataSorted
			defaultExpandDepth={1}
			striped
			fillerColumn
			columnMinWidth="8rem"
		/>

		<h3>Bindable expansion state</h3>
		<p>Currently expanded: <code>{[...expanded].join(", ") || "(none)"}</code></p>
		<QuickGrid
			items={orgs}
			columns={orgColumns}
			treePathMember="path"
			bind:expandedPaths={expanded}
			striped
			fillerColumn
			columnMinWidth="8rem"
		/>

		<h3>Editable per row type — teams vs employees</h3>
		<p>
			Heterogeneous tree where parent rows (teams) are read-only summaries and only the leaves (employees) are editable.
			Each editable column carries a per-row predicate via <code>isEditable: (row) =&gt; boolean</code> — here
			<code>(row) =&gt; row.kind === "employee"</code> — so double-clicking <strong>Role</strong> or
			<strong>Salary</strong> on an employee row enters edit mode, but the same cells on a team row do nothing.
			In navigate mode, <kbd>Tab</kbd> traversal also skips read-only rows.
		</p>
		<p>
			For an all-or-nothing row gate that does not vary per column, use the grid-level
			<code>isRowEditable</code> prop instead — same shape (<code>boolean | (row) =&gt; boolean</code>), one place.
		</p>
		{#if lastTeamChange}
			<p style="font-size: 0.875rem; color: var(--accent-fill-rest);">Last change: {lastTeamChange}</p>
		{/if}
		<QuickGrid
			items={teamData}
			columns={teamColumns}
			treePathMember="path"
			editable
			idMember="path"
			onrowchange={handleTeamRowChange}
			striped
			hoverable
			fillerColumn
			columnMinWidth="8rem"
		/>
	</Card>
</Stack>
