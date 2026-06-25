# Svelte FluentUI

A comprehensive Svelte wrapper library for Microsoft FluentUI web components (v2.6.x), providing a seamless way to use FluentUI components in Svelte applications.

## What's New in v1.5.0-rc01

- **`CommandPalette` — a generic, app-ready command palette is now a published component** — The Spotlight-style palette that previously lived only inside this repo's docs is now exported from `svelte-fluentui` and reshaped for real apps. It dropped its hard dependency on SvelteKit's `goto`: navigation items render as real `<a>` elements so whatever router your app uses handles the click, which makes the component framework-agnostic. Items are either navigation (`href`) or actions (`onSelect`) and can carry an `icon`, a `meta` line, a `badge`, a `shortcut` hint, a `group`, and search-only `keywords`. You get layered fuzzy scoring (exact > prefix > substring > subsequence) with match highlighting, a grouped idle screen, `bind:open` control, and a configurable global `mod+k` shortcut out of the box — plus escape hatches (a custom `filter` prop and `item`/`empty`/`footer` snippets) when you need full control. See the new `/components/command-palette` demo.
- **`CommandPaletteTrigger` — a drop-in search pill to open the palette** — A small presentational trigger that looks like a search input but acts as a button: search icon, placeholder, and a platform-aware keyboard hint (⌘K on Mac, Ctrl K elsewhere). It ships `small` / `medium` / `large` sizes and collapses to icon-only on narrow screens. Wire its `onclick` to your palette's `bind:open` state and you have the familiar "click the search box or press the shortcut" pattern with no custom markup.

## What's New in v1.4.1

- **`MultiSplitter` — splitters mounted inside hidden tab panels now render at proper widths on first reveal** — When a splitter mounted inside an inactive `<Tab>` (or any `display: none` parent), `clientWidth` was 0 at construction time, so the previous code assigned `flex-basis: 0px` to every pane and the `ResizeObserver` then short-circuited the first reveal — leaving panes smashed at 0 width with no path back to their declared `min` / `size`. The fix splits init into two phases: `scheduleInit` always installs the observer immediately (even when hidden), and `applyInitialSizes` defers its work until `totalAvailable() > 0`. The observer's callback runs the deferred init on the first 0 → non-zero transition via a new `!initApplied` branch. Bonus: hide-then-show cycles now preserve sizes instead of zeroing them via the destructive `clampToConstraints(0, ...)` path, and a reveal-after-resize-while-hidden falls through to the existing scale path so panes re-scale proportionally to the new container width. Demo added under "Inside tabs (deferred initial sizing)".

- **`TopNav` — the pinned desktop drawer no longer collapses on every link click** — `closeMobileMenu` was unconditionally writing `mobileMenuOpen = false`, so the documented pattern of wiring `onClick={closeDrawer}` on every `NavLinkItem` (needed for the mobile overlay to dismiss on tap) accidentally closed the pinned desktop rail too. The sync `$effect` only re-ran when `drawerPinned` itself changed, so once collapsed the rail stayed collapsed until the consumer toggled the prop. Added an early-return guard in `closeMobileMenu` — it's now a no-op when `drawerPinned` is true, matching the documented contract. Mobile overlay behaviour is unchanged.

- **`CommandPalette` — keyboard-shortcut chips in the footer are legible again** — The `.cp-footer` rule set `color: var(--neutral-foreground-hint)` for the "navigate" / "open" / "toggle" labels (reads fine on the panel background), but `.cp-footer kbd` carries its own opaque `--neutral-layer-2` background for the boxed-key look — so the hint color cascaded into the kbd boxes, giving #888 text on #f5f5f5 at 0.7 rem and the arrow / Ctrl / K glyphs effectively vanished. Added explicit `color: var(--neutral-foreground-rest)` on `.cp-footer kbd` so the kbd contents resolve against full foreground-on-layer-2 contrast.

- **Security — npm audit cleaned up, 8 of 9 advisories resolved** — Dev/build dependency chain refreshed: `ws`, `devalue`, `vite`, `postcss`, `qs`, `brace-expansion`, `svelte`, `@sveltejs/kit`, and the nested `cookie` chain all bumped past their respective advisories (3 high, 5 moderate, plus the cookie chain). Only `esbuild` 0.27.x's Windows dev-server file-read low remains, deferred because 0.28.x mis-emits output in this project's pipeline. All resolved packages are devDeps in `svelte-fluentui` — consumers don't get runtime changes, but anyone building from source no longer trips the audit gate.

- **Build pipeline — `vitePreprocess({ script: true })` restored in `docs/svelte.config.js`** — Newer `@sveltejs/vite-plugin-svelte` made `vitePreprocess()` skip TypeScript by default; Svelte 5's native parser handles most TS but tripped on curried arrow functions with typed optional params + return-type annotation and let raw `?.` / `??` operators through to the browser. Switching to `vitePreprocess({ script: true })` re-enables explicit script preprocessing. If you fork this repo or use the same config in your own project and see `SyntaxError: Unexpected token '?'` in the browser after a `@sveltejs/vite-plugin-svelte` bump — this is the fix.

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
// => "1.0.0"
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
