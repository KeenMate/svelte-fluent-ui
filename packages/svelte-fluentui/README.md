# Svelte FluentUI

A comprehensive Svelte wrapper library for Microsoft FluentUI web components (v2.6.x), providing a seamless way to use FluentUI components in Svelte applications.

## What's New in v1.0.0-rc18

- **`InputFile` complete rebuild** — the rc17 component was a callback-driven black box; rc18 turns it into a fully-featured upload primitive. Bindable rich state via `bind:items` (rich `InputFileItem[]` with id / file / name / size / progress / status / error / thumbnailUrl / downloadUrl). Full instance API via `bind:this`: `addFiles`, `removeAt`, `clear`, `uploadAll`, `retry`, `pause`, `resume`, `cancel`, `openPicker`. Four appearance variants (`card` / `button` / `minimal` / `compact-chips`) with the new minimal mode opening a Floating-UI-positioned popover containing the full file list and `+ Add more` / `Upload all` / `Clear all` actions. Color-coded badge in minimal mode (gray pending → blue uploading → green completed → red error). Real upload mechanics: `concurrency`, `AbortSignal` for cancellation, `retryPolicy` with exponential backoff, `chunkSize` for chunked uploads, per-item pause/resume. Smarter validation: `minFiles`, `maxFiles`, `minFileSize`, `customValidator` (sync or async), `rejectionMode: "list" | "callback" | "silent"`, `dedupe: "name" | "name-size" | "hash" | false` (hash uses SHA-1 via `crypto.subtle`), `onValidityChange(valid, reasons)` for field-level state. Power UX: image thumbnails (auto-revoked object URLs), file-type icon coloring by category, paste from clipboard, recursive folder drop, drag-to-reorder rows. Full snippet customization (`dropZone`, `fileItem`, `actions`, `emptyState`). Full i18n via `labels: Partial<InputFileLabels>` — every English string overridable. `maxVisible` + `listMaxHeight` props bound long file lists with a "Show N more" toggle. `initialItems` seeds preloaded server-side rows with download links. Backwards-compatible — rc17 callers using just `accept` / `multiple` / `onFileSelected` / `uploadFileCallback` still work
- **Tooltip + PositioningRegion refactored to use `@floating-ui/dom`** — replaced ~270 lines of hand-rolled flip / shift / cascade-fallback positioning math with `computePosition` + `flip` + `shift` + `arrow` + `hide` + `size` + `autoUpdate` middleware. All popover-style components in the repo now share the same FUI + portal pattern (alongside ContextMenu, MenuButton, and the new InputFile minimal popover). Visible benefits: dropdowns and tooltips now follow their anchors during scroll / resize instead of staying at the original screen position, tooltip arrows auto-shift when the tooltip is shifted to fit the viewport, `hide` middleware cleanly handles the "anchor scrolled out of viewport" case. Affects all 8 downstream consumers (Autocomplete dropdown, DatePicker / TimePicker calendar popups, GridCellEditor combobox, Tabs overflow menu, QuickGrid row toolbar) transparently — public APIs unchanged
- **`Field` validation-state border now extends to `InputFile`** — wrapping an InputFile in `<Field validationState="error">` previously rendered the validation message but didn't paint the red bottom-border on the control because InputFile is a custom div, not a fluent-* element with shadow parts. The `_field.scss` selector list now also covers `.fluent-inputfile .drop-zone`, `.fluent-inputfile .chips-row`, and `.fluent-inputfile .minimal-trigger`, so all three of InputFile's bordered appearance variants get the state accent
- **`QuickGrid` Esc properly cancels edits without committing the in-progress value** — clearing a number cell then pressing Esc was committing `null` because the editor's blur (Esc removes focus from `<input>`) fired during teardown and ran commit before cancel could win. Fixed in both navigate mode (handled by QuickGrid) and dblclick / click / button modes (handled by GridCellEditor) — different code paths, both now keep `skipBlurCommit` true through the unmount-blur
- **`QuickGrid` Enter / F2 / typing on read-only cells no longer opens an editor** — rc17's "all cells focusable" change exposed that the keyboard-edit triggers in `handleNavigationKeyDown` weren't gated on `isCellEditable`. Click handlers always were. Surfaced on the teams+employees demo where pressing Enter on a team row's Name (tree column) or any team row's Salary cell would open a default text editor that shouldn't exist
- **Docs Changelog page renders workspace-root `CHANGELOG.md` directly via Vite `?raw` import + render polish** — eliminated the `docs/static/CHANGELOG.md` duplicate that had to be manually synced before each release; both `/` and `/changelog` now read the single source of truth at build time. Render polish: drop the duplicate `# Changelog` H1 (page template already has it), leading bold component-name in each bullet styled as a block-level mini-heading so short bullets get equal visual weight. `Dockerfile` + `.dockerignore` updated so the build context includes the workspace-root file
- **Various docs typos and TS error sweep** — Toast service, navigation-layout, appbar, multisplitter, navigation, quickgrid-editable pages got typo fixes plus Combobox `OptionItem` shape repairs

## What's New in v1.0.0-rc17

- **`Field` component** — wraps any form control with label + hint + validation message + state border. `validationState: "none" | "warning" | "error" | "success"` drives both the message color and the bottom-border accent on the inner control via shadow parts. `hint` renders neutral helper text when there's no error to show. Matches FluentUI 2 / Blazor convention of factoring validation presentation out of individual controls
- **`ValidationSummary` component** — top-of-form panel listing all errors with clickable jump-to-field links. Takes a plain `errors: Record<string, string>` map, auto-hides when empty, renders as `role="alert"` for screen readers. Pairs with `<Field>` for submit-time validation flows
- **Field & ValidationSummary demo page** at `/components/forms/field` covers all states, control types, live validation with touched-on-blur, horizontal orientation, and the submit-time summary pattern
- **Refactored `/applications/form-validation`** to use the new components — ~80 lines of inline `<small class="field-error">` and hand-rolled summary panel removed; reads as a tutorial now
- **`QuickGrid` `Ctrl`+`→` / `Ctrl`+`←` tree expand-collapse in navigate mode** — keyboard-only tree traversal. `Ctrl`+`→` expands the focused row; `Ctrl`+`←` collapses it (or walks up to the nearest expanded ancestor and collapses that). Modifier-key shape avoids ambiguity with plain ArrowLeft/Right which navigate columns
- **`QuickGrid` navigate mode: all cells are now focusable, not only editable ones** — previously only editable cells got `tabindex=0`, so users couldn't land on read-only cells (like the tree column or parent rows in heterogeneous trees) and couldn't trigger `Ctrl`+arrow on them. Now every cell is focusable; Tab still walks through editable cells only (the productive Tab-through-fields UX). Focus indicator extended to all focused cells
- **`QuickGrid` Tab-while-editing now works in `dblclick` / `click` / `button` modes** — only `navigate` mode had a Tab handler before; the others fell through to browser default and focus disappeared. Tab now commits + auto-opens the editor on the next editable cell (spreadsheet pattern)
- **`QuickGrid` mode-switcher on the editable-per-row-type demo** — `/components/quickgrid-tree` example gained a radio control to flip between `navigate`, `dblclick`, `click`, and `button` so you can verify keyboard behaviors across all modes
- **`QuickGrid` predefined context-menu types for tree expand / collapse** — `contextMenu={["expand-all", "collapse-all", "expand-tree", "collapse-tree"]}` wires common tree commands without writing handlers. `expand-all` / `collapse-all` operate on the right-clicked row's branch (file-explorer / IDE convention); `expand-tree` / `collapse-tree` operate on the entire dataset. Visibility gates auto-hide useless options (leaf rows don't show subtree commands, etc.). `ContextMenuItem.label` is now optional since predefined `type` supplies a default
- **Bug fix — Tab traversal correctly skips rows with zero editable columns** — the row-aware Tab promise in rc16 had a hole in heterogeneous trees where a row has *no* editable columns. New `findNextEditableCell` helper walks past such rows in both directions
- **Bug fix — Toast styles now actually ship in the bundle** — the `_toast.scss` partial existed and was complete (`.fluent-toast-container`, position variants, animations) but `main.scss` never `@use`d it, so every consumer got the toast DOM with zero styling: an unstyled box at top-left of the viewport instead of the styled popover at top-right. Affects every page using the toast service. Fixed by adding `@use "assets/styles/components/toast";` to `main.scss`
- **Form Validation demo page** — new `/applications/form-validation` walks through the common patterns: required & format, cross-field (passwords match), numeric range with custom rules, debounced async availability check, conditional required, and submit-time error summary with jump-to-field links. Includes a tiny composable validator helper recipe for copy-paste

## Features

- 🎨 **Complete FluentUI Component Set** - Wraps all major FluentUI web components
- 🔧 **TypeScript Support** - Full type definitions for all components
- 📱 **Responsive Design** - Built-in responsive layout components (incl. responsive `Tabs` with scroll/wrap/menu modes)
- 🎯 **Svelte 5 Compatible** - Works with the latest Svelte features
- 🎨 **SCSS & Tailwind CSS** - Flexible styling options
- 📦 **Tree-shakeable** - Import only what you need
- ✨ **FluentUI Blazor Inspired** - Advanced components like Calendar, DatePicker, TimePicker, InputFile, Autocomplete
- 💾 **Navigation Persistence** - Sidebar menu state persists across page reloads with localStorage
- 🎯 **Active Route Highlighting** - Current page automatically highlighted in navigation
- 🔔 **Toast Notifications** - Programmatic toast service with multiple positions and auto-dismiss
- 🗂 **Centralized z-index scale + portaled overlays** - Dialogs, popovers and tooltips render through `document.body` so they escape ancestor stacking contexts; every overlay uses a shared `--fluent-z-*` token scale with baked-in fallbacks
- 🪟 **`portal` action** - Utility action exported for consumer-built overlays that need to escape parent stacking contexts
- 🔌 **Global runtime API** - `window.components["svelte-fluentui"].version()` exposed at runtime for introspection (mirrors the pattern used by sister packages)

## Highlights

- **Unified form label styling** - TextField, Select, Autocomplete, Radio, RadioGroup and Textarea all share a single canonical `.fluent-label` class so labels look identical across every field
- **Autocomplete height parity** - The custom Autocomplete now matches FluentUI text field / select height (32px) using the same `--base-height-multiplier × --design-unit` tokens
- **Ctrl+Space in Autocomplete** - Press `Ctrl+Space` (or `⌘+Space` on Mac) to force-open the dropdown with all available options
- **Dialog** - Full Fluent-style layout: `title` / `header` slot, right-aligned footer, `primaryAction` / `secondaryAction` shorthand, or custom `footer` snippet. Portaled to `<body>` so it escapes ancestor stacking contexts
- **DatePicker & TimePicker** - Calendar/clock popups anchored correctly to their inputs, natural-width popups (no more stretch-to-input-width), outside-click + `Escape` dismissal, `minDate`/`maxDate` / `minTime`/`maxTime`, `firstDayOfWeek`, `disabledDateFunc`, `autoClose`, bindable `open`
- **Calendar** - `firstDayOfWeek` override, `selectableDates` allow-list, `onPickerMonthChange` callback
- **Tabs** - Pure-Svelte implementation (no more shadow-DOM wrestling) with animated full-tab-width active indicator. `responsive="scroll" | "wrap" | "menu"` — `scroll` auto-shows `‹ ›` arrow buttons on overflow; `menu` collapses overflow into a `⋯` dropdown that swaps the picked tab into the strip on select, with ellipsis truncation on the borderline tab. Full keyboard nav, vertical orientation with `stripWidth` sidebar sizing + auto-ellipsis labels, swipe-to-navigate on the panels (opt out via `swipe={false}`), per-tab `title` tooltips, and `justify` for equal-width stretching
- **MenuButton** - Button that opens a dropdown menu on click instead of a one-off `onclick`. Takes `items: MenuButtonItem[]` (label, icon, disabled, visible, danger, dividerBefore, onclick), forwards button props, exposes bindable `open`. Positioned with Floating UI — auto-flips when near viewport edges, shifts to stay in bounds, and caps height with internal scroll when tight. `position="bottom" | "top"` controls the preferred side
- **ContextMenu** - Standalone right-click menu that opens at the cursor. Wrap any element with `<ContextMenu items={…}>…</ContextMenu>` and right-click inside opens a Floating-UI-positioned menu. Supports **inline expandable sections** (`children` + `expandable: true`, with a rotating chevron) for sidebar-style nav menus *and* **side-opening submenus** (nested `children`) with hover-intent delays, auto-flip away from the viewport edge, and arbitrary nesting. `offsetMenuX` / `offsetMenuY` push the menu away from the cursor so the click position doesn't land on the first item. Closes on scroll, click-outside, or Escape (Escape pops submenus one level at a time)
- **Slider** - Proper wrapper with `bind:value`, `min`/`max`/`step`, `orientation`, `onchange`/`oninput`, labels
- **Navigation Persistence** - Sidebar menu state automatically saved to localStorage and restored on page reload
- **Active Route Highlighting** - Current page is automatically highlighted in the navigation menu
- **Toast Service** - Programmatic notifications with `toast.success()`, `toast.error()`, etc. - 6 positions, progress bars, auto-dismiss
- **InputFile** - Drag-and-drop file upload with validation and progress tracking
- **Autocomplete** - Multiple selection with tag/chip display, async search with AbortSignal, initial options, Ctrl+Space to show all
- **QuickGrid** - Advanced data grid with sorting, filtering, pagination, editable rows, row toolbar, context menu, tree mode with ltree-style paths, per-column custom filter predicates, and stable row identity via `idMember`
- **Three-State Checkbox** - Checkbox with indeterminate state support
- **Responsive Layout** - Complete layout system with Grid, Stack, and responsive components

## Installation

```bash
npm install svelte-fluentui
```

## Quick Start

```svelte
<script>
  import { Button, TextField, Card } from 'svelte-fluentui'
</script>

<Card>
  <TextField placeholder="Enter your name" />
  <Button appearance="accent">Submit</Button>
</Card>
```

## Available Components

### Form Controls
- `Button` - Various button styles and appearances
- `TextField` - Text input with validation
- `NumberField` - Numeric input control
- `Textarea` - Multi-line text input
- `Checkbox` - Checkbox input with three-state support
- `Radio` / `RadioGroup` - Radio button controls
- `Switch` - Toggle switch
- `Select` - Dropdown selection
- `Combobox` - Searchable dropdown
- `Autocomplete` - Multiple selection with tags/chips (inspired by FluentUI Blazor)
- `Slider` - Range slider control
- `Search` - Search input field
- `DatePicker` - Date selection with calendar popup (inspired by FluentUI Blazor)
- `TimePicker` - Time selection with hour/minute/second picker (inspired by FluentUI Blazor)
- `InputFile` - File upload with drag-drop and progress tracking (inspired by FluentUI Blazor)

### Data Display
- `DataGrid` / `DataGridRow` / `DataGridCell` - Data table components
- `QuickGrid` - Advanced data grid with sorting, filtering, pagination, inline editing, tree mode, and custom filter predicates
- `Card` - Content container
- `Badge` - Status indicators
- `ProgressBar` - Progress indication
- `Tooltip` - Contextual information
- `Calendar` - Date picker and calendar
- `Paginator` - Pagination control

### Navigation
- `Tabs` / `Tab` / `TabPanel` - Tab navigation
- `Breadcrumb` / `BreadcrumbItem` - Breadcrumb navigation
- `Menu` / `MenuItem` - Context menus
- `AppBar` / `AppBarItem` - Application bar
- `NavMenu` / `NavItem` / `NavLink` - Navigation components
- `Anchor` - Link component

### Layout
- `Stack` - Flexible layout container
- `Layout` - Page layout wrapper
- `Header` / `Footer` / `BodyContent` - Layout sections
- `Spacer` - Spacing utility
- `Divider` - Visual separator

### Feedback
- `Dialog` - Modal dialogs
- `Toast` - Declarative notification messages
- `ToastContainer` + `toast` - Programmatic toast service (success, error, warning, info)
- `Accordion` / `AccordionItem` - Collapsible content

### Utilities
- `Listbox` / `Option` - List selection
- `Tree` / `TreeItem` - Hierarchical data
- `Toolbar` - Action toolbars

## Usage Examples

### Form with Validation
```svelte
<script>
  import { TextField, Button, Stack } from 'svelte-fluentui'

  let email = ''
  let password = ''
</script>

<Stack orientation="vertical" gap="16">
  <TextField
    bind:value={email}
    type="email"
    placeholder="Enter email"
    required
  />
  <TextField
    bind:value={password}
    type="password"
    placeholder="Enter password"
    required
  />
  <Button appearance="accent">Sign In</Button>
</Stack>
```

### Data Grid
```svelte
<script>
  import { DataGrid, DataGridRow, DataGridCell } from 'svelte-fluentui'

  const users = [
    { name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { name: 'Bob', email: 'bob@example.com', role: 'User' }
  ]
</script>

<DataGrid>
  {#each users as user}
    <DataGridRow>
      <DataGridCell>{user.name}</DataGridCell>
      <DataGridCell>{user.email}</DataGridCell>
      <DataGridCell>{user.role}</DataGridCell>
    </DataGridRow>
  {/each}
</DataGrid>
```

### QuickGrid with Sorting & Filtering
```svelte
<script lang="ts">
  import { QuickGrid } from 'svelte-fluentui'

  type User = {
    id: number
    name: string
    email: string
    role: string
  }

  const users: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
    { id: 3, name: 'Carol', email: 'carol@example.com', role: 'User' }
  ]

  const columns = [
    { field: 'id', title: 'ID', width: '80px', sortable: true },
    { field: 'name', title: 'Name', sortable: true, filterable: true },
    { field: 'email', title: 'Email', filterable: true },
    { field: 'role', title: 'Role', sortable: true }
  ]
</script>

<QuickGrid
  items={users}
  {columns}
  sortable
  filterable
  pageable
  pageSize={10}
/>
```

### Navigation Layout with Persistence
```svelte
<script>
  import { Layout, Header, NavMenu, NavGroup, NavLinkItem, BodyContent } from 'svelte-fluentui'
  import { page } from '$app/stores'

  // Check if a link is active based on current route
  function isActive(href: string): boolean {
    if (!href) return false
    if (href === "/" && $page.url.pathname === "/") return true
    if (href !== "/" && $page.url.pathname.startsWith(href)) return true
    return false
  }
</script>

<Layout>
  <Header slot="header">
    <h1>My App</h1>
  </Header>

  <NavMenu slot="navigation">
    <NavGroup title="Main Menu">
      {#snippet linkText()}
        Main Menu
      {/snippet}

      <NavLinkItem href="/" class={isActive("/") ? "active" : ""}>
        Home
      </NavLinkItem>
      <NavLinkItem href="/about" class={isActive("/about") ? "active" : ""}>
        About
      </NavLinkItem>
      <NavLinkItem href="/contact" class={isActive("/contact") ? "active" : ""}>
        Contact
      </NavLinkItem>
    </NavGroup>
  </NavMenu>

  <BodyContent>
    <!-- Main content here -->
  </BodyContent>
</Layout>
```

### Date and Time Pickers
```svelte
<script>
  import { DatePicker, TimePicker } from 'svelte-fluentui'

  let selectedDate = $state<Date | null>(new Date())
  let selectedTime = $state<string | null>("14:30")

  // Deny weekends
  const disabledDateFunc = (d: Date) => d.getDay() === 0 || d.getDay() === 6
</script>

<DatePicker
  bind:value={selectedDate}
  label="Select date"
  placeholder="Choose a date"
  firstDayOfWeek={1}
  {disabledDateFunc}
  autoClose={true}
/>

<TimePicker
  bind:value={selectedTime}
  label="Select time"
  useAmPm={false}
  showSeconds={false}
  minTime="08:00"
  maxTime="18:00"
  autoClose={true}
/>
```

### Dialog with Actions
```svelte
<script>
  import { Dialog, Button } from 'svelte-fluentui'

  let open = $state(false)
  let name = $state("")
</script>

<Button onclick={() => open = true}>Open Dialog</Button>

<Dialog
  bind:visible={open}
  title="Rename item"
  modal
  primaryAction={{
    label: "Save",
    onClick: async () => {
      if (!name.trim()) return false  // keep open
      await saveName(name)
      // auto-closes when onClick resolves to anything but `false`
    }
  }}
  secondaryAction={{
    label: "Cancel"
  }}
>
  <label>
    Name
    <input bind:value={name} />
  </label>
</Dialog>
```

### Responsive Tabs
```svelte
<script>
  import { Tabs, Tab } from 'svelte-fluentui'
</script>

<!-- Default: tabs scroll horizontally when too wide -->
<Tabs activeId="overview">
  {#snippet childContent()}
    <Tab id="overview" label="Overview" />
    <Tab id="members" label="Members" />
    <Tab id="activity" label="Activity" />
    <Tab id="integrations" label="Integrations" />
    <Tab id="settings" label="Settings" />
  {/snippet}
</Tabs>

<!-- Wrap onto multiple rows instead of scrolling -->
<Tabs responsive="wrap" activeId="a">...</Tabs>

<!-- Justify: tabs divide the row equally -->
<Tabs justify activeId="a">...</Tabs>
```

### Autocomplete with Multiple Selection
```svelte
<script lang="ts">
  import { Autocomplete } from 'svelte-fluentui'

  const options = [
    { value: "1", text: "Option 1" },
    { value: "2", text: "Option 2" },
    { value: "3", text: "Option 3" }
  ]

  let selected = $state<string[]>([])
</script>

<Autocomplete
  bind:selectedOptions={selected}
  options={options}
  label="Select multiple"
  placeholder="Type to search..."
  maxSelectedOptions={5}
/>
```

### File Upload with Progress
```svelte
<script lang="ts">
  import { InputFile } from 'svelte-fluentui'
  import type { FileUploadHandler } from 'svelte-fluentui'

  const uploadFile: FileUploadHandler = async (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)

    // Your upload logic here
    // Call onProgress(percent) to update progress bar

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) throw new Error('Upload failed')
  }
</script>

<InputFile
  multiple={true}
  accept="image/*"
  maxFileSize={5 * 1024 * 1024}
  uploadFileCallback={uploadFile}
  onFileUploaded={(file) => console.log('Uploaded:', file.name)}
/>
```

### Toast Notifications
```svelte
<script>
  import { ToastContainer, toast } from 'svelte-fluentui'

  function showSuccess() {
    toast.success('Operation completed successfully!')
  }

  function showError() {
    const id = toast.error('Something went wrong', {
      persistent: true,
      position: 'top-center'
    })
    // Later: toast.dismiss(id)
  }

  function showWithProgress() {
    toast.info('Processing your request...', {
      showProgress: true,
      duration: 8000
    })
  }
</script>

<!-- Add once in your layout -->
<ToastContainer />

<button onclick={showSuccess}>Show Success</button>
<button onclick={showError}>Show Error</button>
<button onclick={showWithProgress}>Show With Progress</button>
```

### `portal` Action (for custom overlays)
```svelte
<script>
  import { portal } from 'svelte-fluentui'

  let open = $state(false)
</script>

<button onclick={() => open = true}>Show overlay</button>

{#if open}
  <!-- Moved to <body> for the lifetime of this block so ancestor
       stacking contexts / transforms don't affect its z-index. -->
  <div use:portal class="my-overlay" onclick={() => open = false}>
    My custom overlay
  </div>
{/if}
```

### Global Runtime API
```js
// In any browser console, after the page has loaded svelte-fluentui:
window.components["svelte-fluentui"].version()
// => "1.0.0-rc08"
```

Also available as a direct import:
```js
import { VERSION } from 'svelte-fluentui'
console.log(VERSION)
```

## Z-Index Scale

All overlays use a shared token scale so the layering stays consistent across the library. Variables are exposed at `:root` when you import the SCSS bundle; every `z-index: var(--fluent-z-*)` declaration in components also includes the numeric fallback so things still stack correctly even without our SCSS loaded.

| Token | Value | Used for |
|---|---|---|
| `--fluent-z-dropdown` | 1000 | Simple dropdowns, grid overlays |
| `--fluent-z-sticky` | 1020 | Sticky app bars / headers |
| `--fluent-z-fixed` | 1030 | Fixed sidebars / mobile nav |
| `--fluent-z-modal-backdrop` | 1040 | Dialog overlay |
| `--fluent-z-modal` | 1050 | Dialog itself |
| `--fluent-z-popover` | 1060 | Calendar / time / autocomplete popups (above modal) |
| `--fluent-z-tooltip` | 1070 | Tooltip |
| `--fluent-z-toast` | 1080 | Toast |

## Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/KeenMate/svelte-fluentui.git
cd svelte-fluentui
npm install
```

### Working on the Library

The library source code is in `src/lib/`. To package the library:

```bash
npm run package
```

### Working on Documentation

The documentation site is in the `docs/` folder as a separate SvelteKit project:

```bash
cd docs
npm install
npm run dev
```

Or use the Makefile:

```bash
make dev  # Runs docs dev server
```

Visit `http://localhost:5173` to see the component showcase and examples.

## Building

Build the library for publishing:

```bash
npm run build
```

Build documentation Docker image:

```bash
# With local source
make docker-build-docs

# With specific npm version
make docker-build-docs VERSION=1.0.0-rc03
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [KeenMate](https://github.com/KeenMate)

## Credits

Built on top of [Microsoft FluentUI Web Components](https://github.com/microsoft/fluentui) v2.6.x.
