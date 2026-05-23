# Svelte FluentUI

A comprehensive Svelte wrapper library for Microsoft FluentUI web components (v2.6.x), providing a seamless way to use FluentUI components in Svelte applications.

## What's New in v1.0.0-rc22

- **`InputFile` chips mode now has an overall progress footer** — the same `Pause all` / `Resume all` / `Retry all` controls plus the aggregate progress bar that list/popover modes already had. Works for both `chipsPosition` values; rendered as a sibling below the chips so layout stays sane regardless of position.
- **`package.json` `homepage` points at the docs site** — npm's "Homepage" sidebar link now goes to `svelte-fluentui.keenmate.dev` instead of duplicating the GitHub repo link. Two distinct destinations on the package page.
- **InputFile demo playground persists in localStorage** — the live selector × list × cardSize × chipsPosition mixer at `/components/inputfile` remembers your last configuration across page reloads. Files themselves are not persisted (File objects don't survive JSON).

## What's New in v1.0.0-rc21

- **`InputFile` — `appearance` split into `selectorAppearance` + `listAppearance` + new `cardSize` prop** — the single `appearance` union baked the trigger visual and the file-list visual together, so combinations like "button trigger with popover list" or "card with chips below" weren't expressible. Now `selectorAppearance: "card" | "button" | "minimal"` and `listAppearance: "list" | "chips" | "popover" | "none"` are independent. All previous presets still expressible (`card + list`, `button + list`, `minimal + popover`, `card + chips`). New `cardSize: "minimal" | "compact" | "big"` resizes the card — `big` is the original tall vertical card, `compact` is a 2-row grid layout for forms where 200px felt enormous, and `minimal` collapses everything to a single inline wrapping row (icon · message · hint · hint · Browse) with `·` separators between hints
- **`InputFile` — `expandOnDrag` + `expandOnDragTarget` props for drag-expanded overlay** — when an external file is dragged onto the page, the card temporarily expands into a larger portaled overlay so the user has a generous hit area. Rendered above the form via `use:portal` so the surrounding layout doesn't shift up and down. Overlay centre is anchored to the selector's (or `expandOnDragTarget`'s) centre via `transform: translate(-50%, -50%)` and grows symmetrically in all four directions — clamped to `90vw` / `90vh` so it never escapes the viewport. Dismissal paths cover Esc keydown (since OS-originated drags don't reliably fire `dragend` on cancel), cursor leaving the viewport (`document.dragleave` with `relatedTarget === null`), drop, and window blur. The overlay's own `dragleave` uses `relatedTarget` containment rather than `target === currentTarget` to avoid a flicker bug (`dragleave` fires when moving from a parent element into a child, same as `mouseout`)
- **`InputFile` — popover sticky header + sticky footer with progress bar, batch actions, and three CSS-variable dimensions** — Long file lists in minimal-mode popovers used to scroll the header (file count, +Add more, Clear all) away as the user navigated; aggregate progress was nowhere visible without picking through individual rows. New sticky header pins the file count + actions + limits hint to the top; new sticky footer carries an overall progress bar (`uploadedBytes / totalBytes`), a stats line via `labels.totalProgress({completed, failed, total, uploadedBytes, totalBytes, percent})`, and conditional batch buttons — Pause all (any uploading), Resume all (any paused), Retry all (any failed). New exported instance methods `pauseAll()` / `resumeAll()` / `retryAll()` and `actions` snippet payload widened to receive them. Popover sizing is now bracketed by three CSS variables: `--fluent-inputfile-popover-width` (default `28rem`), `--fluent-inputfile-popover-min-height` (default `16rem`), `--fluent-inputfile-popover-max-height` (default `24rem`) — overridable per-theme or per-instance so the popover doesn't jump around as files are added
- **`InputFile` — `FileUploadResult` return type + `onItemRemove(item)` callback for clean server-side upload/cleanup flows** — Previously the upload handler's `Promise<void>` return meant capturing a server-returned guid required a WeakMap + post-success `onFileUploaded` patch (fragile, two-step). Handler return widened to `Promise<void | FileUploadResult>` where `FileUploadResult = Partial<Pick<InputFileItem, "metadata" | "downloadUrl" | "thumbnailUrl" | "name">>` — restricted on purpose so handlers can't clobber `id` / `status` / `progress`. Returned fields are spread into the same `patchItem` that flips status to `"completed"`, landing the server guid atomically with the completion flag. New `onItemRemove?(item)` callback fires once per item from `removeAt` / `removeById` / row `×` / `clear()` / `reset()`, receiving the removed item with its final metadata still intact. Together they cover the canonical scenario: file picked → auto-upload → server returns guid (now on `item.metadata`) → user removes the file before submit → consumer fires `DELETE /api/files/:guid` from `onItemRemove`. Demo 16 on `/components/inputfile` shows the full flow with an in-memory fake server + activity log
- **`InputFile` — `chipsPosition: "end" | "below"` + chip restructure to `[info | X]` with full-height remove hitbox** — When `listAppearance="chips"`, the chips previously rendered at the trailing edge of the same flex row as the selector card, leaving a tall card + short chips visually floating mid-row. New `chipsPosition` prop (default `"below"`) flips the layout: `"end"` keeps trailing-edge with an inner `.chips-wrap` so multi-row wrap doesn't anchor each row to the card's vertical centre, `"below"` stacks chips beneath the card. Chip itself restructured into `.chip-info` (filename / size / progress, fills width, non-interactive) and `.chip-remove` (full-height button covering everything from the info edge to the chip's right edge), so users no longer miss the small `×` and click empty chip space
- **`InputFile` playground demo on `/components/inputfile`** — live controls for `selectorAppearance` / `listAppearance` / `cardSize` / `chipsPosition` / `multiple` / `disabled` / `expandOnDrag` at the top of the examples grid so consumers can try every combination without rewriting code
- **Border-radius consolidated into a six-tier CSS-variable scale** — ~40 hardcoded `border-radius` declarations across 12 components were swept into `--fluent-border-radius-{sm,md,lg,xl,pill,circle}` (2/4/6/8/999/50%) on `:root`, backed by matching SCSS tokens (`$border-radius-sm/md/lg/xl/pill/circle`). The pre-existing `--fluent-border-radius` is preserved as a back-compat alias of `md`. Pixel-identical to the prior visual — drove tier choice off existing values per call site (4px → md, 2px → sm, etc.). Theming the library's entire corner-rounding is now a six-line variable override instead of a 40-line search-and-replace
- **`InputFile` popover `max-height` was being silently overridden — fixed** — Floating UI's `size` middleware ran on every reposition and unconditionally wrote `floating.style.maxHeight = ${availableHeight - 16}px`, so on any window taller than the CSS cap the inline style won and the popover ballooned to ~viewport height (sticky footer ended up pinned far below the visible scroll region, looking like it was floating mid-list). Middleware now clears the inline cap, reads the CSS-rule-driven `max-height` via `getComputedStyle`, and only re-applies an inline cap when the viewport is actually tighter than the ceiling. CSS variable wins on tall screens, viewport wins on short screens

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
