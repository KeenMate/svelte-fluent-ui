# Components

The full catalogue of components exported by `svelte-fluentui`. For runnable code, see [EXAMPLES.md](https://github.com/KeenMate/svelte-fluentui/blob/prod/EXAMPLES.md); for the live showcase, see [svelte-fluentui.keenmate.dev](https://svelte-fluentui.keenmate.dev).

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
- `Field` - Form-field wrapper: label, `required`, `hint`, `validationState`/`validationMessage`, and horizontal/vertical `orientation`
- `ValidationSummary` - Panel that maps field name → error message; auto-hides when there are no errors

### Data Display
- `DataGrid` / `DataGridRow` / `DataGridCell` - Data table components
- `QuickGrid` - Advanced data grid with sorting, filtering, pagination, inline editing, tree mode, and custom filter predicates
- `Card` - Content container
- `Badge` - Status indicators
- `Label` - Tag-style indicator with semantic colours and an `outline` variant
- `CompositeBadge` - Three-section `[icon][label][button]` chip (notification pills, dismissible chips)
- `BadgeGroup` - Flex-wrap container that collapses overflow badges into a "+N more" tail
- `ProgressBar` - Progress indication
- `Tooltip` - Contextual information
- `Calendar` - Date picker and calendar
- `Paginator` - Pagination control

### Navigation
- `Tabs` / `Tab` / `TabPanel` - Tab navigation (responsive scroll/wrap/menu modes)
- `Breadcrumb` / `BreadcrumbItem` - Breadcrumb navigation
- `Menu` / `MenuItem` - Menus
- `MenuButton` - Button that opens a dropdown menu on click
- `ContextMenu` - Standalone right-click menu opening at the cursor (submenus, expandable sections)
- `CommandPalette` / `CommandPaletteTrigger` - Spotlight-style fuzzy command palette and its trigger pill
- `AppBar` / `AppBarItem` - Application bar
- `NavMenu` / `NavGroup` / `NavItem` / `NavLink` / `NavLinkItem` / `NavExpander` - Sidebar navigation components
- `TopNav` - Top navigation bar
- `Anchor` - Link component

### Layout
- `Stack` - Flexible layout container
- `Grid` / `GridItem` - Responsive 12-column grid with optional container-query sizing
- `Layout` - Page layout wrapper
- `Header` / `Footer` / `BodyContent` - Layout sections
- `Panel` - Layout panel container
- `MultiSplitter` / `MultiSplitterPane` - Resizable multi-panel splitter
- `Spacer` - Spacing utility
- `Divider` - Visual separator

### Feedback
- `Dialog` - Modal dialogs
- `Alert` - Inline alert with `intent` (info/success/warning/danger), dismissable, optional title/icon
- `Toast` - Declarative notification messages
- `ToastContainer` + `toast` - Programmatic toast service (success, error, warning, info)
- `Accordion` / `AccordionItem` - Collapsible content (custom implementation)

### Utilities
- `Listbox` / `Option` / `OptionGroup` - List selection
- `Tree` / `TreeItem` - Hierarchical data
- `Toolbar` - Action toolbars
- `Icon` - FluentUI SVG icons (regular/filled variants, hover effect), bundled by the `svelteFluentUI` Vite plugin — only used icons ship, inlined into JS (`iconsMode: 'inline'`) or as hashed `/_app/*` assets (`iconsMode: 'asset'`)
- `SiteSettings` - Theme / accent / mode settings dialog
- `portal` - Action for consumer-built overlays that need to escape parent stacking contexts

## Component Highlights

- **Unified form label styling** - TextField, Select, Autocomplete, Radio, RadioGroup and Textarea all share a single canonical `.fluent-field-label` class so labels look identical across every field
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
