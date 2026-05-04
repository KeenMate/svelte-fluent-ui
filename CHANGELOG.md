# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-rc16] - 2026-05-04

### Added
- **`QuickGrid` per-row-type editability** - Tree grids and any other heterogeneous dataset can now express "only some rows are editable" without the consumer hand-rolling click-handlers around the grid. Two new shapes, both `boolean | ((row: T) => boolean)`:
  - **Column-level `isEditable` callback** — `column.isEditable: (row) => row.kind === "employee"` lets each editable column decide per-row. Useful when *which* columns are editable depends on the row type (e.g. salary editable on employees, headcount visible-but-read-only on team rows, name editable on both).
  - **Grid-level `isRowEditable` prop** — single predicate that gates the entire row. Use when every editable column is editable for the same set of rows; cheaper than repeating the predicate on every column.
  - Three-stage gate: grid-level `editable` master switch → `isRowEditable` row gate → `column.isEditable` cell gate. All three must pass. Static `false` short-circuits without evaluating the next stage.
  - Navigate-mode `Tab` / `Shift-Tab` traversal is row-aware: `getEditableColumns(row)` is now called per row so the cursor skips read-only cells correctly when stepping through a heterogeneous tree. Cost is one predicate evaluation per row navigated, not per cell rendered.
  - Demo at `/components/quickgrid-tree` → "Editable per row type — teams vs employees": Platform / Product team rows are read-only summaries; double-click on Role or Salary on an employee row enters edit mode, same cells on a team row do nothing.
- **`QuickGrid` `column.nowrap` prop** - Body cells in this column never wrap (`white-space: nowrap`). Three useful combinations:
  - **`nowrap` alone** — single-line cells, column expands as needed to fit the longest value. Best for short identifiers (SKU, code, ID) where wrapping is just visual noise.
  - **`nowrap` + `maxWidth: "…"`** — single-line cells with a hard width cap; long values truncate with an ellipsis. Implementation wraps plain-text cell renders in a `<span class="cell-text">` so a flex child can carry the `overflow: hidden; text-overflow: ellipsis; min-width: 0` (text-overflow doesn't propagate from a flex container to a bare text node, so a wrapper element is required for the ellipsis to actually trigger).
  - **`nowrap` + `autoWidth`** — column sizes to `max(header text, longest cell value)` without either wrapping. Pairs with `fillerColumn` so leftover horizontal space lands on the filler.
  - The header style mirrors the body's nowrap when `column.nowrap` is set, so a body-nowrap column doesn't end up with a wrapping header above single-line cells.
  - Demo on `/components/quickgrid` ("Nowrap columns & ellipsis truncation") shows wrapping vs nowrap+ellipsis side-by-side against a `bio` column with deliberately long values, with explicit `<h4>` labels above each grid.
- **`QuickGrid` component-prefixed CSS variables** - New `--fluent-quickgrid-header-bg`, `--fluent-quickgrid-header-hover-bg`, `--fluent-quickgrid-header-sorted-bg`, `--fluent-quickgrid-stripe-bg`, `--fluent-quickgrid-row-hover-bg` tokens decouple QuickGrid's row/header surfaces from the generic FluentUI `--neutral-layer-*` palette. Themes that overrode `--neutral-layer-2` to a brand color (e.g. DHL yellow on the navbar) used to drag QuickGrid header + striped rows along at the same full-strength saturation, which made data tables visually overwhelming. Now consumers can tint the grid surfaces independently — typically at 10–15 % opacity — while leaving the navbar at full strength. Generated from light/dark `$quickgrid-*` SCSS variables in `_variables.scss`, wired through both theme blocks of `theme.scss`. QuickGrid's CSS uses two-layer fallbacks (`var(--fluent-quickgrid-header-bg, var(--neutral-layer-2, #f5f5f5))`) so existing themes that don't define the new tokens still render identically. Pagination buttons and cell-edit buttons intentionally still use `--neutral-layer-*` since those are buttons, not row surfaces.
- **`Autocomplete` `startIcon` and `endIcon` snippet props** - Decorative snippet slots inside the input at the leading and trailing edge. `startIcon` renders before the input (typical use: a magnifying glass to signal "this is a search box"). `endIcon` renders after, but yields to the auto-rendered clear button (when something is selected) and loading spinner (during async search), so a search icon cleanly swaps to a clear button on selection without fighting it. `:has(.input-start)` / `:has(.input-end)` rules pad the input by 32px on either side in non-inline mode so text never sits underneath the icons. New "Start & End Icons" example on `/components/autocomplete`.
- **`Autocomplete` chip-size CSS variables** - Eight new `--fluent-autocomplete-chip-*` tokens (font-size, line-height, padding-y, padding-x, gap, max-width, text-max-width, remove-padding) drive both inline and external chip geometry. Defaults are in rem so chips scale with root font-size. Themes can override globally (`:root { --fluent-autocomplete-chip-font-size: 0.75rem; }`) instead of monkey-patching component selectors.
- **Site settings store now applies to the document** - `settings` store gains a browser-only subscribe listener that pushes every change to `document.documentElement` as CSS custom properties, plus the `dir` and `data-theme` attributes. Theme mode `'system'` resolves via `matchMedia('(prefers-color-scheme: dark)')` and re-applies on OS-level theme changes. Accent color writes `--accent-fill-rest`/`-hover`/`-active`, mirrors to `--fluent-accent-primary`/`-hover`/`-active`, and computes `--foreground-on-accent-rest`/`-hover`/`-active`/`-focus` via a W3C luminance threshold so dark accents get white labels and light accents (PowerBI yellow) get black labels — without that recompute the OK button on the Site Settings dialog disappeared (white-on-yellow). Neutral base color writes `--neutral-layer-1` and `--fluent-bg-primary`. Direction writes the `dir` attribute. Defensive: non-string accent/neutral values (legacy localStorage shapes) coerce to `#0078d4` / `#FAFAFA` instead of throwing.

### Changed
- **BREAKING — `QuickGrid` column property `editable` renamed to `isEditable`** - The boolean form is unchanged (`isEditable: true` works exactly like `editable: true` did); the new function form (`isEditable: (row) => boolean`) is purely additive. Migration: rename `editable: true` → `isEditable: true` on every column literal. Demo pages at `/components/quickgrid-editable` and `/components/quickgrid-contextmenu` and the `ai/quickgrid.txt` reference were swept. The grid-level `editable` prop is unchanged — it remains the master "is editing turned on at all" switch.
- **`Autocomplete` focus border follows FluentUI 2 textfield convention** - The focus state was painting all four sides of the input with the accent color and adding a 1px outer glow (`border-color: accent + box-shadow: 0 0 0 1px accent`), which broke the FluentUI 2 textfield convention. Now only the bottom edge turns accent (`border-bottom-color`) and an inset box-shadow adds 1px more visual thickness on the bottom only — matches the Blazor reference and avoids any layout shift on focus.
- **`Autocomplete` inline chip size unified with external chip** - Inline chips (inside the input, in `tagsPosition: 'inline'`) had `font-size: 12px` while external chips (above/below modes) had `font-size: 14px`. Same data, same widget — picking a value visually shrunk the chip on its way into the input. Both now use `--fluent-autocomplete-chip-font-size` (default `0.875rem`) and share the same height; the only intentional difference is that external chips have a 1px border (they're standalone, the input's border doesn't enclose them) while inline chips don't (they sit inside the input's existing border).
- **`Tabs` active tab text now tracks accent** - `.fluent-tab.active` color changed from `var(--neutral-foreground-rest)` to `var(--accent-fill-rest, var(--neutral-foreground-rest))` so the active tab's label matches its bottom indicator instead of staying neutral gray. Aligns with the FluentUI Blazor pattern (active tab = accent label + accent indicator).
- **`QuickGrid` sort indicator now tracks accent** - The `▲` / `▼` triangle on the actively sorted column is colored with `var(--accent-fill-rest, currentColor)` instead of inheriting the column header's neutral text color. The unsorted-column placeholder `⬍` stays explicitly neutral with 0.3 opacity so the active sort direction visually stands out.
- **`theme` store localStorage key namespaced** - Renamed `"theme"` → `"fluent-theme"` to prevent collisions with host applications using the same generic key (e.g. PureAdmin saves its theme name like `"audi"` to `localStorage.theme`, which our store then read and discarded as invalid). Migration is automatic — invalid values fall back to `"light"` once; users will need to re-toggle dark mode if they relied on the old key.

### Fixed
- **`QuickGrid` body cells now inherit column width constraints** - `width` / `minWidth` / `maxWidth` / `columnMinWidth` were applied only to the `<th>` header; body `<td>`s carried only `text-align`. In HTML auto table-layout the column's natural width is determined by the *widest* cell across header and body — so a wide body cell (especially one with `nowrap: true`) would drag the column past the header's `max-width`. Net effect on the new nowrap demo: ellipsis wouldn't activate because the column wasn't actually clamped. New `getColumnBodyStyle()` mirrors the same width logic the header uses (including `autoWidth`'s `width: 1%; white-space: nowrap` shrink-to-content trick) onto every body `<td>`, so width caps are now enforced consistently. Side benefit unrelated to nowrap: any grid using `columnMinWidth` will see body cells respect that minimum too, where previously they could squeeze below it.
- **`Autocomplete` single-select mode now actually works** - `selectOption` always appended to `selectedOptions` regardless of `effectiveMultiple`. Net effect in single-select mode: first click appeared to work (`selectedOptions = ['cz']`, `hasSingleSelection = true`, input rendered the picked text), but a second click made `selectedOptions = ['cz','de']` — `hasSingleSelection` then required `length === 1` and went false, `displayValue` fell back to the empty `searchText`, and no chips render in single-select (`showTags` requires `effectiveMultiple`), so the input went mysteriously blank with two values silently held in state. Also `maxSelectedOptions` was being checked even in single-select where it makes no sense. Now: single-select replaces (`[option.value]`), multi-select still appends; the `maxSelectedOptions` cap only gates multi-select; and the dropdown auto-closes after a single-select pick regardless of `keepOpen` (a one-pick widget shouldn't stay open).
- **`Autocomplete` dropdown now closes when the page is scrolled outside it** - `PositioningRegion` anchors the popover to the input on initial open but does not re-anchor on scroll, so scrolling the page would leave the options list floating at its old screen position, visually detached from its anchor. There was a click-outside listener but no scroll-outside listener. Added a `scroll` listener (registered with `capture: true` because most page scroll containers don't bubble scroll events to document) that closes the dropdown when scrolling happens outside both the anchor (`containerElement`) and the popover surface (`.options-list, .positioning-region`). Scrolling inside the options list itself (which is its own scrollable region with `max-height: 300px; overflow-y: auto`) keeps the dropdown open.
- **Site Settings dialog handler unwraps Select detail** - `docs/src/lib/components/SiteSettings.svelte` `handleThemeChange` and `handleAccentColorChange` were passing the entire `Select` event detail (`{value, selectedOption, data}`) to the store setters instead of `detail.value`, which serialized the object into localStorage and broke accent resolution on subsequent loads. Now destructures `.value` matching the package's reference dialog.

## [1.0.0-rc15] - 2026-05-01 [PUBLISHED]

### Added
- **`QuickGrid` tree mode** - New `treePathMember` prop turns the grid into a TreeGrid for ltree-style hierarchical data: each row carries a single path string (PostgreSQL ltree `"1.2.3"`, POSIX-style `"/1/2/3"`, or Windows-style `"C:\foo\bar"`), and one column marked `isTree: true` renders the indent + expand/collapse chevron. Separator is auto-detected by scanning items for `/`, `\`, or `.` (scans through items, not just `items[0]`, so a root row like `"1"` doesn't fool the detector). Optional `treeLevelMember` and `treeParentMember` skip the path-parsing work when those values are pre-computed in the database — coalesces caller-provided values over derived ones. `treeDataSorted` (default `false`) trusts caller's order; otherwise the grid sorts internally by path with numeric-aware segment comparison so `"1.2"` sorts before `"1.10"`. `expandedPaths: Set<string>` is `$bindable`; `defaultExpandDepth` initializes the internal set when not bound, interpreted *relative to the dataset's shallowest level* so a partial-tree / subtree view starting at level 3 still expands its own roots when you pass `defaultExpandDepth={1}`. Filter is ancestor-aware — matched rows force their ancestors visible, and while the filter is active the collapse logic is bypassed so matches inside collapsed branches still appear. Visibility check skips parent paths that aren't actual rows in the dataset (virtual roots), so partial trees render correctly without inventing synthetic root rows. In tree mode, column sort is intentionally disabled to preserve hierarchy. Dedicated demo page at `/components/quickgrid-tree` with three examples (derived-only, pre-computed level + parent, bindable expansion).
- **`QuickGrid` `idMember` prop** - Field on each row that uniquely identifies it. Internal state (drafts, in-progress edits, invalid-cell markers) is now keyed by the value of this field, so pagination, filter, sort, and tree expand/collapse no longer cause an in-flight edit to land on the wrong row when the displayed order changes. Coalesce order in `getRowId(item, displayedIndex)`: `idMember` value → `treePathMember` value (tree mode) → displayed-row index as last-resort fallback. When `editable={true}` is enabled and neither `idMember` nor `treePathMember` is provided, the grid emits a one-shot `console.warn` explaining the consequence (state keyed by displayed index, drifts on re-order) and pointing at the fix.
- **`QuickGrid` `treeDoubleClickBehavior` prop** - `'none' | 'toggle'` (default `'none'`). When set to `'toggle'`, double-clicking anywhere on the tree column toggles expand/collapse on rows that have children — convenient for users who'd rather smash the row than aim at the chevron. Double-click on the chevron itself is ignored (it stops `dblclick` propagation, so chevron stays single-click only — no double-firing). Leaves don't toggle (no children to expand). On the tree column the toggle wins over edit triggers, so users with `editTrigger="dblclick"` or `"navigate"` get tree behavior here; edits can still be initiated by single-click in `'click'` mode or via Enter/F2 in navigate mode. Default text-selection behavior (browser extends the selection on the second click of a dblclick) is suppressed via `mousedown` + `e.preventDefault()` only when `e.detail > 1` AND toggle is enabled AND the row has children — single-click selection elsewhere still works. Demo's org grid defaults to `'toggle'` with a checkbox to flip it.
- **`QuickGrid` per-column `filter` callback** - New `Column.filter?: (filterValue: string, row: T) => boolean | null`. When set, it replaces the built-in case-insensitive substring match for that column. Use cases: numeric ranges (`>500`, `<=10`), date ranges, regex, or multi-field search (`"john doe"` matching `firstName + " " + lastName`). The cell still uses the same per-column filter input as the default substring search — the callback just owns the predicate. Returning `null` signals "input is syntactically incomplete" (e.g. user typed `>` without a number yet) — the grid then ignores this filter (all rows pass) AND adds a `.invalid` class to the input so the user gets a red border instead of an empty grid. Validity is probed against the first row only (the assumption is that validity is a property of the input string, not the data). Demo's Headcount and Budget columns parse `>` / `<` / `>=` / `<=` / `=` operators, return `null` when the input starts with an operator but the number is missing, and fall back to substring match for plain text. Filters against the *raw* row value, not the formatted display string, so a budget formatter `v => "$" + v.toLocaleString()` still searches against the underlying number.
- **`QuickGrid` grid-level `onfilterchange` callback** - `(filters: Record<string, string>) => void`. When provided, internal client-side filtering is bypassed entirely — the grid still renders the filter inputs, fires this callback on every keystroke with a copy of the current `{field: value}` map, and trusts the caller to update `items`. Typical pattern: debounce in the handler, post the filter map to a backend, replace `items` with the result. Pairs cleanly with server-side pagination/sort if you wire those the same way.
- **`QuickGrid` `columnMinWidth` prop** - Grid-level default `min-width` applied to every column header that doesn't specify its own `minWidth`. Useful in concert with `fillerColumn` to stop content-sized columns from collapsing too far when the filler claims leftover space. Skipped on columns that opted into `autoWidth` (whose `width: 1%; white-space: nowrap` shrink-to-content trick would be defeated by a min-width).

### Changed
- **BREAKING — `QuickGrid` `invalidCells` shape: `rowIndex` → `rowKey`** - The bindable `invalidCells: CellValidationState[]` prop now uses `{ rowKey: string, field: string, error: string }` instead of `{ rowIndex: number, field: string, error: string }`. The `rowKey` is whatever `getRowId(item, displayedIndex)` returns (the new `idMember` value, the tree path, or the displayed index as string fallback). Reason: invalid-cell markers shared the same drift problem drafts had — collapsing a parent or paginating could leave a marker on the wrong row. Migration: callers binding `invalidCells` need to read `c.rowKey` instead of `c.rowIndex`. The `onvalidationerror` callback's `detail.rowIndex` is unchanged (still the displayed index, since the callback also passes `row` and the caller can derive the id themselves).

### Fixed
- **`QuickGrid` `fillerColumn` actually absorbs leftover space** - The `.filler-column` CSS was `width: auto`, which doesn't claim any specific share in HTML auto table-layout. Whichever column happened to have the loosest content constraints (typically a column with no `width` set) absorbed the leftover instead, ballooning to fill the row while sibling columns stayed compact. Switched to `width: 100%` — the classic absorb-leftover idiom in auto layout: other columns get their content/defined widths first, the empty filler swallows whatever remains. Affects every demo using `fillerColumn`, not only the new tree page.

## [1.0.0-rc14] - 2026-04-24 [PUBLISHED]

### Added
- **`Combobox` `minSearchLength` prop** - Keeps the dropdown closed until the typed text reaches the configured length. Useful against large or async option sets where opening on a single character like `"a"` is wasteful — visual noise for a consumer's list, actual cost for one driving an API. Implementation listens to the `<fluent-combobox>` `input` event and queues a microtask to force-close `el.open = false` after Fluent has already set its own open state, so the override wins. Empty input is deliberately not gated (clicking into an empty combobox to browse still works); only the `typed.length > 0 && typed.length < minSearchLength` range closes it
- **`Autocomplete` `minSearchLength` prop** - Short-circuits `filterOptions` before the debounce timer or `performSearch` runs. Below the threshold, `onoptionssearch` is never invoked (the critical win for async search against expensive backends), `filteredOptions` is cleared, and the dropdown is closed. Bypassed for empty input so `showInitialOptions` still works, and `showAllOptions` (Ctrl+Space) still overrides as an explicit user ask
- **`Grid` columns mode (`columns` + `gap` props)** - Passing `columns={N}` switches `Grid` from its 12-column flex-spacing mode to CSS grid with `grid-template-columns: repeat(N, minmax(0, 1fr))`. Each `<GridItem>` becomes an equal-width track regardless of content. Why `minmax(0, 1fr)` and not `1fr`: grid items default to `min-width: auto` (intrinsic content width), so with plain `1fr` a single chip-stuffed Autocomplete or long unbreakable string could still steal width from siblings — the same bug the mode is meant to fix. `minmax(0, 1fr)` lets tracks shrink below content, so columns stay pinned at 1/N of the container. Optional `gap` prop (default `"1rem"`) controls inter-cell spacing. The two modes are mutually exclusive: when `columns` is set, `spacing`/`justify`/`data-spacing` are suppressed and the existing `.fluent-grid[data-spacing="N"]` margin/padding rules don't match; when it isn't, the existing flex system is untouched. Backward-compatible for every existing `<Grid spacing={N}>` caller — no migration needed

### Changed
- **Demo datasets expanded** - Replaced small hand-written fixtures in the Autocomplete, Combobox, and Select demos with a shared `docs/src/lib/demo-data/datasets.ts` module: ~195 real countries (heavy prefix clusters like "United ...", "South ...", "Saint ..."), 63 songs with heavy clustering ("All ...", "I Want ...", "Sweet ..." etc.), and 33 languages with shared first letters so Select's native type-ahead has something to cycle through when the user presses `s` repeatedly. The old fixtures were small (5–15 items) and mostly unique-prefix, making it hard to exercise filtering, scrolling, `maxOptionsSearch` limits, or `minSearchLength` gating
- **Grid demo page updated** - Documents both layout modes side-by-side. Property table now includes `columns` and `gap` rows and flags which props are flex-mode-only. New "Columns mode (CSS grid)" demo card visually demonstrates the `minmax(0, 1fr)` promise: a 3-column row where the middle cell contains a deliberately unbreakable string, and the outer two cells stay pinned at 1/3 width each
- **Autocomplete / Combobox demo pages** - Added property-table entries for `minSearchLength` and dedicated demo cards. Autocomplete's demo includes a call counter (incremented inside the `onoptionssearch` handler) so users can visually confirm the async function is NOT invoked below the threshold
- **Docs pages standardized — 41 pages in three batches** - All component demo pages migrated to the shared Calendar-reference layout: outer `<Stack>`, `<h1>`, description, References `<Card>`, 3-column API `<Grid>` (Properties / Callbacks / Slots using `<h2>` inside Cards), then Examples wrapped in a single `<Card>` with `<h3>` subsections. Pages that previously rendered Examples *before* API (radiogroup, number-field, search, quickgrid-contextmenu, etc.) were flipped. Pages with stacked API Cards using `<h3>` (checkbox, combobox, autocomplete, listbox, etc.) got the 3-col `<Grid>` layout with `<h2>` titles. Per-page `<style>` blocks that only overrode `h1/h2/h3/p` font-sizes were dropped. Secondary entities (Select Option, Grid GridItem, Radio+RadioGroup, Tabs+Tab, Accordion+AccordionItem, AppBar+AppBarItem, MultiSplitter+MultiSplitterPane, Navigation's four entities) use either an extra Card below the 3-col Grid or a second stacked 3-col Grid with prefixed h2 titles (e.g. `Tab Properties`). Extras that don't fit the Properties/Callbacks/Slots trio (text-field Actions, number-field/search Methods, menu-button MenuButtonItem, quickgrid editable's editor/validation context types, toast Options, toast-service Store Methods, etc.) became standalone `<Card>`s between the API Grid and Examples. Individual top-level example Cards consolidated into one wrapping `<Card><h2>Examples</h2>` per page. Autocomplete's callbacks/slots were normalized to the shared Property shape (name/type/default/description) so all three API QuickGrids share the same columns, and duplicate rows where the same entry appeared in both Properties and its native Callbacks/Slots card were removed. AccordionItem, AppBarItem, and Navigation's sub-entities got full Properties/Callbacks/Slots tables sourced from their component files
- **Shared `.content h3` spacing** - Moved the "example subsection breathing room" rule into `docs/src/assets/styles/components.scss` (scoped to `.content`, which is the main-content wrapper in `+layout.svelte` every demo page renders inside). Consecutive `<h3>` subsections inside a demo page's Examples card now get a consistent `2rem` top margin without per-page style blocks. Applies to all current and future demo pages automatically
- **Demo-page descriptions backfilled — 26 pages** - The layout standardization left the description `<p>` between `<h1>` and the References `<Card>` in place on pages that already had one (Checkbox, DatePicker, TimePicker, Autocomplete, QuickGrid, Combobox, Search, Select, Number-field, Radio, Listbox, Icon, InputFile, MenuButton, ContextMenu, Grid, Multisplitter, Navigation) but left a conspicuous gap on the 26 that didn't: Calendar, Alert, Anchor, Badge, Breadcrumbs, Button, Card, DataGrid, Dialog, Option, Paginator, Tabs, Toast, Toolbar, Tooltip, RadioGroup, Switch, TextArea, TextField, Accordion, AppBar, BodyContent, Layout, Spacer, Stack, and ToastService. Each now gets a 1–2 sentence description. Wrappers mention the underlying `<fluent-*>` element they wrap; custom components (Calendar, Card, Paginator, Toast, ToastService, AppBar, BodyContent, Layout, Spacer, Alert) note the FluentUI Blazor component they're inspired by — matching the style already in use on DatePicker/Checkbox/etc. ToastService had its description buried *inside* the References Card; pulled out to the standard slot and the References Card trimmed to just the reference link, so every page is visually identical now

### Fixed
- **Changelog renderer escapes raw HTML** - The home (`/`) and `/changelog` routes fetch `CHANGELOG.md` and convert it to HTML with a small custom converter, then render with `{@html}`. Without HTML-escaping the raw markdown first, a code span like `` `<fluent-dialog>` `` became `<code><fluent-dialog></code>` and the browser parsed the inner tag as a real auto-registering custom element — which painted an empty Fluent dialog floating on the page. The web component's internal `modal` / `trap-focus` defaults reflected back as attributes (`<fluent-dialog modal="" trap-focus="">`) which made this especially visible. Fix: call `escapeHtml()` on `&`, `<`, `>` before any markdown transforms run, in both renderer files. All the `<fluent-*>` / `<slot>` / `<template>` etc. mentions in the changelog now display as literal text inside `<code>` elements as intended

## [1.0.0-rc13] - 2026-04-20

### Added
- **New `MenuButton` component** - Button that opens a dropdown menu on click instead of firing an `onclick`. Takes an `items: MenuButtonItem[]` array (label, icon, disabled, visible, danger, dividerBefore, onclick), forwards button props (`appearance`, `disabled`, `class`, `style`, `children`/`start`/`end` snippets), and exposes bindable `open` plus `onopen`/`onclose` callbacks. Menu positioning uses `@floating-ui/dom` — `flip` to the opposite side when near viewport edges, `shift` for horizontal nudging, `size` middleware to cap max-height and make the menu scrollable when space is tight, `autoUpdate` for live reposition on scroll/resize. Portalled to `<body>` so it escapes ancestor stacking contexts. Exported as `MenuButton` + `MenuButtonItem` type, with a dedicated demo page at `/components/menu-button`.
- **New `ContextMenu` component** - Standalone right-click menu that opens at the cursor position. Wraps children with a `display: contents` span that catches `contextmenu` events and portals a Floating-UI-positioned menu at the click coordinates (via a virtual anchor). Reuses the `MenuButtonItem` shape from `MenuButton`. New `offsetMenuX` / `offsetMenuY` props push the menu away from the cursor so the click position doesn't land directly on the first item — defaults to `offsetMenuX: 8` so the cursor sits safely off the left edge of the menu after right-click. `disabled` prop falls through to the browser's native context menu. Dedicated demo page at `/components/context-menu` with basic, offset-sliders, per-item, conditional-visibility, and sidebar-style sections scenarios
- **`MenuButtonItem` expandable sections & submenus** - Extended the item shape with `id` (stable key), `children` (nested items), `expandable`, `defaultExpanded`:
  - **Inline expandable sections** (`children` + `expandable: true`) — renders the item as a section header with a rotating chevron; children render inline below when expanded. Matches the sidebar-style nav menu pattern (overview + nested components, dividers between groups). Expand state is remembered across menu opens
  - **Side-opening submenus** (`children` only) — renders the item as a trigger with a right-pointing chevron; hover/focus opens a separate Floating-UI popover at `placement="right-start"` with `flip(fallbackPlacements: ["left-start", "right-end", "left-end"])` so it auto-flips to the left when near the right edge of the viewport. Hover-intent delays (150ms open / 250ms close) prevent flicker and let the user diagonally swoop from trigger to submenu body. Sibling submenus (same parent) auto-close when a new one opens. Nested submenus work recursively (the same `renderItem` snippet is called inside each submenu portal)
  - Custom menu markup replaces `<fluent-menu>` / `<fluent-menu-item>` in `ContextMenu` so we can render nested structure without shadow-DOM acrobatics. Styled against FluentUI design tokens (neutral-layer-1 background, neutral-stroke-layer-rest border, popover shadow, stealth-hover fill, accent-fill-rest icon color, error-foreground for `danger` items)
  - `Escape` pops submenus one level at a time before closing the root menu
  - Close-on-scroll restored — context menus traditionally dismiss when the underlying content scrolls (scroll events don't bubble, so the listener uses capture to catch any ancestor's scroll). Scrolls *inside* the menu itself are ignored so long scrollable menus still work
  - `SvelteMap` (from `svelte/reactivity`) is used for the open-submenus map — a plain `new Map()` wrapped in `$state()` doesn't proxy `.set()`/`.delete()` mutations, so submenus wouldn't render reactively otherwise

### Changed
- **MenuButton now uses Floating UI** - Replaced the `PositioningRegion` wrapper with direct `@floating-ui/dom` calls for more robust positioning. `flip` handles top/bottom overflow, `shift({ padding: 8 })` nudges horizontally, `size` caps max-height so a tall menu near the bottom of the viewport becomes internally scrollable instead of getting clipped, and `autoUpdate` reposition on scroll/resize means the menu follows its anchor live (we removed the force-close-on-scroll workaround that the previous hand-rolled positioning required)
- **New dependency: `@floating-ui/dom`** - Added as a library dependency for `MenuButton` and `ContextMenu` positioning

## [1.0.0-rc12] - 2026-04-20

### Changed
- **Tabs / Tab — full custom Svelte rewrite** - Dropped the `<fluent-tabs>` / `<fluent-tab>` / `<fluent-tab-panel>` web-component wrappers in favor of a first-class Svelte implementation. The previous rewrite attempts (rc09 scroll clip, rc10 scrollbar styling, rc11 host-width cascade, wrap mode) were all losing cascade races against upstream shadow-DOM styles (`:host { display: grid; grid-template-columns: auto 1fr auto }` and `.tablist { width: max-content }`) — author `::part()` rules lost, JS-applied inline styles on shadow parts worked but felt fragile. Replaced with a pure Svelte + design-tokens implementation:
  - **Public API unchanged** — `<Tabs activeId ontabchange ... childContent>` + `<Tab id label icon content>` usage keeps working exactly as before. `<Tab>` now renders no DOM of its own; it registers its props with the parent via context, and `<Tabs>` renders the real tab buttons + panels from the registered entries
  - **Responsive modes work reliably** — `scroll` clips and scrolls within the container (hidden scrollbar), `wrap` flows tabs onto multiple rows (real flex-wrap), `menu` collapses overflowing tabs into a `⋯` button at the end of the strip that opens a floating menu of hidden tabs. Selecting a hidden tab swaps its position with the last-visible tab so the selection stays in the strip. Uses the same `fluent-menu`/`fluent-menu-item` styling as QuickGrid's context menu for visual consistency. The old `clip` mode was removed — `scroll` + `menu` cover every real-world need it did
  - **Menu-mode ellipsis truncation** — when the next tab doesn't fully fit but there's ≥ 60px of remaining strip space, it's kept in the strip as the last visible tab and capped via `max-width`; the label truncates with `…` (icon + close button stay intact) rather than being kicked into the overflow menu. Edge case where the very first tab alone is wider than the strip also truncates rather than clipping raw
  - **Menu `⋯` button pinned to the end of the strip** — via flex `margin-left: auto` (horizontal) / `margin-top: auto` (vertical) so its position doesn't shift with the width of the last-visible tab. Shadow tablist copy stays in flow so its natural width is measurable (`:not(.fluent-tab-shadow)` scopes the margin to the real button)
  - **Measurement is feedback-loop-free** — `menu` mode uses an off-screen "shadow" tablist that renders every tab at natural width. `visibleCount` is computed by cumulative-summing shadow widths against the real tablist's `clientWidth`. Without the shadow, showing/hiding the overflow button would swing the measurement in a cycle
  - **Scroll arrow buttons** — in `responsive="scroll"` mode, `‹` and `›` buttons appear at the ends automatically when there's overflow, and scroll by 80% of the tablist width on click. Hidden when the tablist fits. Absolute-positioned over the strip edges so toggling them doesn't change the tablist's `clientWidth` (which would itself feedback-loop)
  - **Animated full-width active indicator** — a 2px bar that slides between tabs with a cubic-bezier `transform`/`width` transition (vs FluentUI's 20px static sub-tab micro-indicator). `translate(x, y)` on both axes so the indicator correctly tracks the active tab's row in `responsive="wrap"` multi-row layouts
  - **Keyboard navigation** — `ArrowLeft`/`ArrowRight` (horizontal) or `ArrowUp`/`ArrowDown` (vertical), `Home`, `End`. Disabled tabs are skipped automatically
  - **Vertical orientation** fully supported — strip on the left with a vertical border, indicator on the left edge. Long labels auto-ellipsis so one wide tab doesn't inflate the whole strip
  - **`stripWidth` / `stripHeight` props** — cap the strip's cross-axis. Most useful in `orientation="vertical"` where the default is natural-width (widest label wins); `stripWidth="200px"` gives a predictable sidebar and each tab's label auto-ellipsises when needed
  - **Swipe navigation** — horizontal-swipe on the tabpanels container (vertical-swipe in vertical orientation) navigates prev/next tab. Dominant-axis guard (`|Δmain| ≥ 50px` AND `|Δmain| ≥ |Δcross| × 1.5`) so scrolling panel content doesn't hijack the gesture; touches starting on interactive elements (`input`, `button`, `textarea`, `select`, links, contenteditable, ARIA `slider`/`spinbutton`) are ignored so form controls keep their gestures. Opt out with `swipe={false}`
  - **Native `title` tooltip** — each tab button gets `title={tab.label}` so hover reveals the full text, especially useful for ellipsis-truncated labels
  - **Read+write effect loop fixed in Tab registration** — `ctx.register()` reads the `tabs` $state array (for findIndex) before writing to it. Without isolation, Tab's `$effect` subscribes to `tabs` and then writes to it, producing `effect_update_depth_exceeded`. Fix: wrap `register`/`unregister` calls in `untrack(() => …)` so the prop reads in the effect body stay tracked (re-run on real prop changes) but the array reads inside register don't
  - Deprecated `overflow={...}` prop — the dropdown-overflow feature was rarely used, not auto-populated from real overflow, and is superseded by `responsive="menu"`. Warns to the console if set
- **Sidebar nav items no longer overlap Dialog overlay / Dialog** - `PositioningRegion.svelte` applied `z-index: var(--fluent-z-popover, 1060)` to the `.positioning-region` class globally. But that class is used in two modes: a portalled floating overlay (dropdowns, toolbars) *and* a plain static wrapper that `NavLink` / `NavExpander` render around every sidebar item. The static wrapper was inheriting the popover z-index, which put every sidebar link above the Dialog overlay (1040) and even above the Dialog itself (1050). Fix: scope the z-index rule to a new `.positioning-region-floating` class applied only to the portalled floating variant. Static wrappers are now plain layout wrappers with no stacking context, so modals/dialogs once again paint above the sidebar

## [1.0.0-rc10] - 2026-04-16

### Added
- **QuickGrid column width control** - Three new per-column props on `Column<T>` plus a grid-level opt-in filler column, so columns can keep predefined widths instead of being justified across the table
  - `minWidth?: string` - CSS `min-width` for the column. Any CSS length (`"80px"`, `"20%"`, `"10rem"`, `"40ch"`, ...)
  - `maxWidth?: string` - CSS `max-width` for the column
  - `autoWidth?: boolean` - Size column to its header content and prevent it from stretching. Implements the classic HTML-table `width: 1%; white-space: nowrap` header trick. Ignored if `width` is also set — use one or the other
  - `width?: string` (existing) now JSDoc'd for consistency with the new props
- **QuickGrid `fillerColumn` prop** (opt-in, default `false`) - Appends an empty trailing `<th>` / `<td>` to every row that absorbs any remaining horizontal space. Pair with `autoWidth` or explicit `width` on the other columns so the freed-up space goes into the filler instead of redistributing across the real columns. The filler cell has no padding, background, or interaction — it just exists to soak up width

### Fixed
- **Tabs `responsive="scroll"` no longer clips tab-panel content** - Horizontal-scroll overflow was applied to the whole `<fluent-tabs>` host in rc09, which wraps both the tab row *and* the tab panels. That meant `overflow-y: hidden` on the host also clipped popovers, dropdowns, tooltips, and other overlays rendered inside the tab content (a dropdown opened near the bottom of a tab panel would get cut off by the tab-row's overflow context). Moved the scroll onto `::part(tablist)` only — the host is now a normal block whose content area grows naturally, and only the tab strip itself scrolls when it exceeds the container
- **Tabs scroll bar hidden by default** - The thin scrollbar that rendered under the active-tab underline in `responsive="scroll"` mode is now hidden (`scrollbar-width: none`). Scrolling still works via wheel, trackpad, touch, and keyboard — matching the tab-row UX in VS Code and Chrome. Removes the need for consumers to override `.fluent-tabs-wrapper.responsive-scroll { overflow: … }` in their own styles

### Changed
- **QuickGrid / GridCellEditor - debug logs removed** - Stripped 14 leftover `console.log` statements from the dropdown-editor flow (`[1]`–`[10]` in `GridCellEditor.svelte`) and the navigate-mode auto-edit prevention flow (`[QG1]`–`[QG4]` in `QuickGrid.svelte`). Real `console.error` handlers for option-loading and search failures are kept



### Added
- **Applications section** - New top-level docs section with real-life UI pattern examples
  - New sidebar group "Applications" with overview page at `/applications`
  - **Filter Card** (`/applications/filter-card`) - combines TextField (search), Select (category), and Autocomplete (multi-tag) filters in one card row driving a reactive QuickGrid
  - **Order Form** (`/applications/order-form`) - cascading hardware/software order form. Selecting an order type (mobile / hardware / software) reveals a different branch of fields; some branches cascade further (e.g. Hardware → Computer reveals OS/RAM/storage/budget). Exercises nearly every form component: TextField, Textarea, Select, Option, Combobox, Autocomplete, NumberField, DatePicker, TimePicker, RadioGroup, Radio, Checkbox, Switch, InputFile, Button, Badge, Divider, Icon, Accordion, and the Toast service
- **Autocomplete Ctrl+Space shortcut** - Open dropdown with all available options
  - Press `Ctrl+Space` (or `⌘+Space` on Mac) in an Autocomplete input to force-open the dropdown showing all options minus already-selected ones
  - Works in both synchronous (`options`) and async (`onoptionssearch`) modes
  - New internal `showAllOptions()` helper usable for programmatic open
- **TextField** - New `id` and `labelTemplate` props to match `Select` / `Autocomplete`
- **Calendar** - Additional props from FluentUI Blazor FluentCalendar API
  - `firstDayOfWeek` (0=Sunday…6=Saturday) overrides the culture's default week start
  - `selectableDates` — inverse of `disabledDateFunc` (return `true` to allow); composes with `disabledDateFunc`
  - `onPickerMonthChange` callback fires when the user navigates months/years via prev/next
- **DatePicker** - Additional props from FluentUI Blazor FluentDatePicker API
  - `disabledDateFunc` — pass-through to inner Calendar (composes with `minDate`/`maxDate`)
  - `firstDayOfWeek` — pass-through to inner Calendar
  - `autoClose` (default `true`) — close the popup on date select
  - Bindable `open` + `onOpenChange` callback for controlled popup state
  - `id` — so the `<label for="…">` associates with the text field
  - `labelTemplate` snippet
  - `openCalendarIconAriaLabel`, `title`
  - Label now uses the shared `.fluent-label` class (consistent with TextField/Select/Autocomplete)
- **TimePicker** - Additional props from FluentUI Blazor FluentTimePicker API
  - `minTime` / `maxTime` (`HH:mm` or `HH:mm:ss`) — clamp valid times; apply is no-op when out of range
  - `useAmPm` (nullable) — overrides `use24Hours` when explicitly set
  - `secondStep` — increment for the seconds column
  - `autoClose` (default `true`)
  - Bindable `open` + `onOpenChange` callback for controlled popup state
  - `id`, `labelTemplate`, `title`, `openClockIconAriaLabel`
  - Label now uses the shared `.fluent-label` class
- **Slider component** - Proper wrapper implementation (was previously a TODO stub with no props)
  - Props: `id`, `value` (bindable number), `min`, `max`, `step`, `orientation`, `disabled`, `readonly`, `required`, `name`, `label`, `labelTemplate`, `ariaLabel`, `class`, `style`
  - Callbacks: `onchange`, `oninput` (both receive numeric value)
  - Two-way binding via `bind:value`, label uses shared `.fluent-label` class
  - Keeps web component's string value in sync via element-property assignment
- **Dialog** - Header / footer / action props to match FluentUI Blazor's FluentDialog visual layout
  - `title` prop renders a heading (left side) alongside the close button (right side) in a header row
  - `header` snippet for fully custom header content
  - `footer` snippet for fully custom footer content
  - `primaryAction` / `secondaryAction` props — `{label, appearance?, disabled?, onClick?}` shorthand for the common "OK / Cancel" pattern. `onClick` may return `false` to keep the dialog open after the click
  - Footer alignment changed from split (`space-between`) to right-aligned (`flex-end`) to match Fluent visual conventions
  - Existing `actions` snippet, `dismissable`/`dismissButtonText` still work; they now sit in the right-aligned footer alongside `primaryAction`/`secondaryAction`
  - When `title`/`header` is omitted, the close X reverts to a floating top-right button (matching legacy behavior) instead of reserving an empty header strip — so old dialogs with their own `<h3>` in the body still look right
- **Tabs responsive overflow** - New `responsive` prop on `Tabs` controls how the tab list handles widths wider than its container
  - `"scroll"` (default): horizontal overflow with a thin scrollbar — tabs no longer overflow narrow containers
  - `"wrap"`: tab rows wrap onto multiple lines
  - `"clip"`: preserves FluentUI's upstream behavior (tablist grows to `max-content`) for backwards compatibility
  - Implemented via `::part(tablist)` (fluent-tabs exposes `part="tablist"` on its shadow-root tab list), so the override ships automatically whenever the component is used — no SCSS import required. Previously the tablist had `width: max-content` hard-wired in the shadow DOM, forcing consumer apps to override it in their own styles
  - Tabs stay compactly aligned at the start (not justified across the container) by default: the scroll/wrap modes use `max-width: 100%` on the host + `overflow-x: auto` so the tablist keeps its natural `max-content` width and only scrolls when it doesn't fit
  - New `justify` boolean prop (default `false`) — when `true`, the tab list stretches to fill the available width so the tabs divide the row equally. Applies in `"scroll"` / `"wrap"` modes; in `"scroll"` mode it also disables the scrollbar since the list always fits by definition
- **Global runtime API** - Package now registers `window.components["svelte-fluentui"]` on import (browser only), exposing `version()` so non-Svelte / console code can introspect the loaded version. Mirrors the pattern used by sister packages (e.g. `web-multiselect`)
  - Also exported as `VERSION` from `svelte-fluentui` for direct import
  - Auto-generated `src/lib/version.ts` is rewritten on each build by the new `scripts/pre-package.js` to keep it in sync with `package.json`
- **`portal` action** - New public export (`import {portal} from "svelte-fluentui"`)
  - Moves an element out of its current DOM position into another container (defaults to `document.body`) for the lifetime of the action
  - Useful for any consumer-built overlay (custom dropdowns, popovers) that needs to escape ancestor stacking contexts
  - Used internally by `Dialog`, `PositioningRegion`, and `Tooltip`

### Changed
- **Centralized z-index scale + portal-based overlays** - Replaced ad-hoc / hardcoded `z-index` values across components with the long-defined token scale, and routed all overlays (modal, popovers, tooltips) through `document.body` so the scale is honored regardless of where the consumer renders them
  - New CSS variables exposed at `:root` (mirroring `$z-index-*` tokens): `--fluent-z-dropdown` (1000), `--fluent-z-sticky` (1020), `--fluent-z-fixed` (1030), `--fluent-z-modal-backdrop` (1040), `--fluent-z-modal` (1050), `--fluent-z-popover` (1060), `--fluent-z-tooltip` (1070), `--fluent-z-toast` (1080)
  - New `portal` action exported from `svelte-fluentui` — moves an element to `document.body` (or any selector/element) for its lifetime, escaping ancestor stacking contexts
  - `Dialog` overlay + `<fluent-dialog>` now portal to `<body>` and use `--fluent-z-modal-backdrop` / `--fluent-z-modal`
  - `PositioningRegion` overlay portals to `<body>` and uses `--fluent-z-popover` (so dropdowns from inside a modal correctly render above it)
  - `Tooltip` portals and uses `--fluent-z-tooltip`
  - `Autocomplete`, `DatePicker`, `TimePicker`, `GridCellEditor`, `QuickGrid` (context menu, row connector) now consume `--fluent-z-popover` / `--fluent-z-dropdown`
  - `TopNav` brand / mobile toggle / mobile sidebar use `--fluent-z-sticky` / `--fluent-z-fixed`
  - `SiteSettings` Dialog no longer needs the `style="z-index: 10000"` workaround
- **Selected fluent-tab z-index neutralized** - Blazor's `fluent-components.scss` ships `fluent-tab[aria-selected="true"] { z-index: 1 }`. Combined with parent stacking contexts that could elevate the tab above modals, this caused selected tabs to "shine through" dialogs. Override moved into `Tab.svelte`'s scoped style as `:global(fluent-tab[aria-selected="true"]) { z-index: auto !important }` so it ships automatically with the component (consumers who don't import our SCSS bundle were missing the previous override). Selected state remains visually obvious through font-weight/color
- **Dialog Escape now handled globally** - Previously the keydown handler was wired only on the dialog element, so `Esc` was lost whenever focus drifted outside the dialog (e.g. user clicked the overlay). Now a single document-level `keydown` listener (capture phase) routes `Esc` to the topmost open Dialog instance, regardless of where focus lives. The listener is installed lazily when the first dialog opens and removed when the last one closes — no extra prop required, behavior is governed by the existing `closeOnEscape` (default `true`) and `onbeforeclose` (return `false` to veto)
- **Tab spacing** - FluentUI's `<fluent-tab>` template is a single bare `<slot>` with no gap between children, so icon + label + badge render visually glued. `Tab.svelte` now ships `:global(fluent-tab) { display: inline-flex; align-items: center; gap: 0.5rem }` as part of the component so any combination of icon / label / badge / close button breathes automatically
- **Z-index CSS variables now have fallbacks** - All `z-index: var(--fluent-z-*)` declarations across components now include the absolute fallback (`var(--fluent-z-modal-backdrop, 1040)` etc.). Consumers who don't import `theme.scss` (so the variables aren't defined) still get correct stacking instead of `z-index: auto`
- **Unified form label styling** - TextField, Select, Autocomplete, Radio, and RadioGroup now share a single canonical `.fluent-label` class
  - New global `.fluent-label` style in `components.scss` (0.875rem / weight 600 / neutral foreground / 0.25rem bottom margin)
  - `TextField` now renders its own `<label class="fluent-label" for={id}>` above `<fluent-text-field>` instead of slot-delegating the label text to the web component's internal label
  - `Autocomplete` label class renamed from `.autocomplete-label` to `.fluent-label`; local styles removed
  - `Textarea` label now uses `.fluent-label` class for consistency
  - Result: all form fields now have visually identical labels
- **Autocomplete height parity with fluent-text-field / fluent-select**
  - Outer `.autocomplete-input-container` pinned to `min-height` using FluentUI `--base-height-multiplier × --design-unit` tokens (32px default), with `box-sizing: border-box`
  - Inline-mode container padding reduced from `4px 8px` to `0 8px` to avoid stacking with inner input padding
  - Native input vertical padding removed (`4px 0` → `0`); non-inline override still provides `4px 8px`
  - Inline-mode input stretches to container height via `align-self: stretch`
  - Net effect: autocomplete total height is now exactly 32px (was ~37.33px), matching FluentUI text field and select
- **Autocomplete label spacing** - Removed redundant `gap: 0.5rem` on `.fluent-autocomplete` wrapper; label-to-input spacing now comes solely from the shared `.fluent-label` margin, matching the other form components

### Fixed
- **npm audit — cookie vulnerability** - Added an `overrides` entry in the workspace root `package.json` pinning `cookie` to `^0.7.2` (the patched version per [GHSA-pxg6-pf52-xh8x](https://github.com/advisories/GHSA-pxg6-pf52-xh8x)). SvelteKit upstream still pulls `cookie@^0.6.0` transitively, so this is the cleanest way to flush the vulnerability without waiting for an upstream release. After a clean `npm install`, audit now reports 0 vulnerabilities
- **DatePicker / TimePicker popup positioning** - Calendar/time popup no longer renders in the top-left corner of the viewport
  - Root cause: `bind:this` on a `<TextField>` Svelte component returned the component instance, not a DOM element, so `PositioningRegion` couldn't compute anchor coordinates
  - Both pickers now bind `PositioningRegion`'s `anchor` to their own `<div class="*-wrapper">` DOM element
- **DatePicker / TimePicker popup width** - Popup now sizes to its content instead of stretching to the input's width
  - `PositioningRegion` gained a `matchWidth?: boolean` prop (default `true`, preserving existing behavior for combobox/select dropdowns)
  - DatePicker and TimePicker pass `matchWidth={false}` so the calendar / clock panels use their natural width
- **DatePicker / TimePicker outside-click and Escape dismiss** - Popups now close when clicking outside the field/popup or pressing `Escape`
- **DatePicker / TimePicker end-slot button layout** - Calendar/clock icon and clear (×) button were stacking vertically, making the × button spill below the input
  - Wrapped both buttons in a `.end-buttons` inline-flex container with `gap: 0.25rem`
- **Icon names** - Fixed PascalCase icon names that should be lowercase (icons rendered as ⚠️)
  - `"Person"` → `"person"` in Autocomplete, Listbox, and Combobox demo pages
  - `"Money"` → `"money"` and `"Calculator"` → `"calculator"` in NumberField demo page
  - `"Globe"` → `"globe"` in Search demo page
  - Also fixed string `size="16"` to numeric `size={16}` in affected usages
- **Vite plugin icon detection** - `extractIconNames` now matches `icon:` and `iconName:` object properties in addition to `name:`, fixing sidebar icons not being copied to production builds
- **Dockerfile** - Added missing `README.md` to root COPY step, fixing `post-package.js` build failure

### Documentation
- **References section** - Added missing References links to Button, Select, and Icon demo pages
- **API documentation audit** - Added Properties, Callbacks, and Slots tables to all component demo pages that were missing them:
  - Pages missing all three: Button, DatePicker, TimePicker, Toast Service, QuickGrid, QuickGrid Editable, QuickGrid Context Menu, NumberField, Radio, RadioGroup, Search, Grid, MultiSplitter
  - Pages missing Callbacks and/or Slots: Autocomplete, Checkbox, Icon, InputFile, Listbox, Combobox, Card, Tabs, Toast, Toolbar, Tooltip, AppBar, Navigation, BodyContent, Layout, Spacer

### Added
- **Select Component** - Enhanced props and functionality to match FluentUI Blazor API
  - New props: `title`, `width`, `height`, `maxVisibleOptions`, `indicatorTemplate`
  - `width`/`height` props for dimension control via inline styles
  - `maxVisibleOptions` prop for opt-in height constraint in `multiple` select mode
    - When explicitly set, limits visible options and enables scrolling
    - Uses scroll container wrapper to preserve FluentUI borders
    - Automatically measures option row height and sets container height
    - Default behavior: show all options with auto-calculated height (no constraint)
  - `indicatorTemplate` slot for custom dropdown indicator/arrow
  - `onchange` callback now returns `selectedOption` (display text) in addition to `value` and `data`
  - Comprehensive docs page with 12 examples:
    - Multiple select: all visible, with maxVisibleOptions, with selected/disabled options
    - Single select (default dropdown)
    - Appearances (outline, filled)
    - Disabled states (disabled select, disabled option)
    - Forced position (above/below)
    - Width control (full width, fixed width)
    - Long list with built-in scrolling
    - Two-way binding with `bind:value`
    - Data binding with `onchange` and Option `data` prop
    - Dynamic options from array using `#each`
  - API reference tables for Select props, Option props, callbacks, and slots

- **Option Component** - Enhanced props to match FluentUI Blazor API
  - New props: `class`, `style`, `icon` (slot)
  - `icon` slot renders before option text for icon support in dropdowns
  - Removed console.log debug statement

- **QuickGrid Native Dropdown Editors** - Built-in Select, Combobox, and Autocomplete editors for grid cells
  - **Native Select**: Click/Enter opens dropdown, arrow keys navigate, letter keys jump to matching option
  - **Native Combobox**: Type to filter static options, arrow keys navigate filtered list
  - **Native Autocomplete**: Type to trigger async search with debounce, can commit freeform text
  - All editors use `PositioningRegion` for dropdown positioning
  - FluentUI-styled dropdowns with proper theming and dark mode support
  - Keyboard navigation: ArrowUp/Down navigate, Enter selects, Escape closes/cancels, Tab commits
  - `initialSearchQuery` support for typing-to-edit in navigate mode (all dropdown types)

- **QuickGrid dropdownShowOnFocus Prop** - Auto-enter edit mode for dropdown editors when cell is focused
  - Configurable via `dropdownShowOnFocus` prop (default: true)
  - Select, Combobox, and Autocomplete columns show editor immediately on cell focus
  - Eliminates need for double-click or Enter to start editing dropdown cells

- **QuickGrid Column Header Info** - Info icons with tooltips for column headers
  - New `headerInfo` column property displays ⓘ icon next to header title
  - Uses FluentUI Icon component (`info` icon with accent color)
  - Hover tooltip shows the info text

- **QuickGrid Draft Row Editing** - Row-level draft editing for validation workflows
  - When editing starts, row is cloned to preserve original values
  - Invalid values are shown in the cell (not reverted)
  - `RowChangeDetail` now includes both `row` (original) and `draftRow` (with user changes)
  - Enables "show what user typed even if invalid" UX pattern

- **AbortController Support for Autocomplete Search** - Cancel stale search requests
  - `onSearch` callback now receives optional `AbortSignal` parameter
  - Previous in-flight requests are automatically aborted when user types more
  - Prevents stale results from appearing (e.g., typing "cz" won't show "c" results)
  - Proper cleanup when dropdown closes

- **QuickGrid Row Toolbar** - Enhanced floating toolbar with custom actions and multi-row layout
  - Renamed from `rowActions` to `rowToolbar` (backwards compatible aliases maintained)
  - New props: `showRowToolbar`, `rowToolbar`, `ontoolbarclick`
  - Custom toolbar items with: `id`, `icon`, `title`, `label`, `row`, `group`, `danger`, `disabled`, `onclick`
  - Multi-row layout: items can be assigned to different rows (`row: 1` closest to grid row)
  - Groups with dividers: items with different `group` numbers separated by `|` divider
  - Async onclick support: custom handlers can be async functions
  - Predefined types still work: `'add'`, `'delete'`, `'duplicate'`, `'moveUp'`, `'moveDown'`
  - Backwards compatible: string shorthand (`['add', 'delete']`) still works
  - RTL support for mirrored layouts

- **QuickGrid Toolbar Trigger Modes** - Control how row toolbar is shown
  - New `toolbarTrigger` prop with three modes: `'hover'` (default), `'click'`, `'button'`
  - **Hover mode**: Show on mouse hover, hide on mouse leave (existing behavior)
  - **Click mode**: Show/hide by clicking on the row (toggle)
  - **Button mode**: Adds dedicated actions column with ⋮ button to show/hide toolbar
  - Toolbar auto-hides on scroll in hover mode

- **QuickGrid Toolbar Alignment** - Vertical alignment option for row toolbar
  - New `toolbarAlign` prop: `'center'` (default) or `'top'`
  - `'top'` aligns first toolbar row with the grid row for consistent visual appearance

- **QuickGrid Context Menu** - Right-click context menu with cell/row awareness
  - New `contextMenu` prop accepts array of menu item configurations
  - New `oncontextmenuopen` callback fired when menu opens with full context
  - Uses FluentUI `fluent-menu` / `fluent-menu-item` components for native styling
  - Menu items support:
    - `label`: Static string or dynamic function `(context) => string`
    - `icon`: Optional emoji or icon string
    - `disabled`: Boolean or function `(context) => boolean`
    - `visible`: Boolean or function `(context) => boolean`
    - `danger`: Red styling for destructive actions
    - `dividerBefore`: Add divider line before item
    - `onclick`: Handler receives full context (row, rowIndex, colIndex, column, cellValue)
  - Auto-repositions to stay within viewport boundaries
  - Closes on: click outside, Escape key, scroll

- **Radio/RadioGroup Components** - Enhanced props to match FluentUI Blazor API
  - **RadioGroup** new props: `label`, `labelTemplate`, `ariaLabel`, `orientation`, `required`, `autofocus`, `placeholder`, `class`, `style`, `onchange`
  - **Radio** new props: `label`, `labelTemplate`, `ariaLabel`, `name`, `readonly`, `disabled`, `required`, `checked`, `autofocus`, `class`, `style`
  - Context-based communication between RadioGroup and Radio for proper state management
  - Uses spread pattern for all optional attributes to prevent `null`/`undefined` values causing issues
  - Separate demo pages: `/components/forms/radio` and `/components/forms/radiogroup`
  - RadioGroup page includes: Default, In a toolbar, States (readonly/disabled), Label outside group, With preset examples

- **Search Component** - Enhanced props and functionality to match FluentUI Blazor API
  - New props: `immediate`, `immediateDelay`, `dataList`, `displayName`, `width`, `height`, `title`
  - New slot props: `start` and `end` for custom icons inside the search field
  - `immediate` mode with optional `immediateDelay` for debounced search callbacks
  - `focusAsync(preventScroll?)` method exposed for programmatic focus
  - Default `appearance="outline"` for proper bordered input styling
  - Uses spread pattern for all optional attributes to prevent `null` values causing issues
  - Comprehensive docs page with examples:
    - Basic (with/without label), Interactive search with results
    - Interactive with debounce (500ms delay example)
    - Immediate mode toggle with/without delay
    - States: Full Width, Placeholder, Required, Disabled, Read only
    - Icons: start/end slot support
    - Focus: Autofocus and FocusAsync button example
    - Filled style variants
    - Miscellaneous: minlength/maxlength validation
    - Placeholders and autofill prevention reference table

### Changed
- **Replaced `live-server` with `five-server`** - Maintained fork with modern dependencies
  - Eliminates 6 vulnerabilities from outdated `braces`/`chokidar`/`micromatch` in `live-server`
  - Upgraded `@sveltejs/adapter-auto` from `^6.1.1` to `^7.0.0` to unblock `npm audit fix`
  - Reduced total vulnerabilities from 24 to 4 (remaining 4 are upstream `@sveltejs/kit` → `cookie` issue)

- **GridCellEditor Refactored** - Replaced external `Autocomplete` component with native implementations
  - Removed dependency on `Autocomplete.svelte` for grid editing
  - Cell editors now feel native to the grid with consistent styling
  - Arrow keys properly captured by dropdown when open (don't navigate grid)
  - No flash of initial options when entering edit mode by typing (FOAC fix)

### Fixed
- **Select/Combobox Async Options** - Value not applied when options load asynchronously
  - `fluent-select` and `fluent-combobox` web components only evaluate `current-value` at init
  - If options are rendered after mount (e.g., from API call), the value prop was ignored
  - Added `MutationObserver` to detect when child options are added and re-apply the value
  - Consumers no longer need `{#key}` workaround to force re-render after async data loads
  - Autocomplete not affected (pure Svelte component, no web component value-matching issue)

- **Tooltip Component** - Complete rewrite to pure Svelte implementation
  - Removed `fluent-tooltip` web component dependency
  - Uses FluentUI design tokens (`--elevation-shadow-tooltip`, `--control-corner-radius`, etc.)
  - Added fade in/out animation (opacity + scale transition)
  - **Auto-positioning with flip logic** (Floating UI style):
    - Automatically flips to opposite side when preferred position doesn't fit viewport
    - Priority: preferred → opposite → whichever has more space
    - Arrow tracks anchor position when tooltip is shifted
  - **Scroll/resize tracking**: Tooltip repositions on scroll and window resize
  - **Anchor visibility detection**: Tooltip fades out when anchor scrolls out of viewport
  - Fixed demo page: removed bold text, corrected position type documentation

- **QuickGrid Text Editor Arrow Keys** - ArrowLeft/ArrowRight now only move cursor in text inputs
  - TextField, NumberField, Textarea: Arrow keys move text cursor, never navigate cells
  - User must use Tab/Enter to leave cell (prevents accidental navigation)
  - Select/Combobox/Checkbox: Arrow keys still navigate cells immediately
  - ArrowUp/ArrowDown: Still navigate rows for all editor types

- **QuickGrid Arrow Key Navigation** - Arrow keys no longer move grid focus when dropdown is open
  - Added `e.stopPropagation()` to prevent event bubbling to grid
  - QuickGrid's `handleEditorKeyDownInNavigateMode` now skips arrow key handling for dropdown editors
- **QuickGrid Double-Click in Navigate Mode** - Double-click now properly enters edit mode
  - Fixed `handleCellDblClick` to work with both "dblclick" and "navigate" edit triggers
- **Dropdown Click-Outside Handling** - Clicking dropdown options no longer triggers blur/commit
  - Added `onmousedown={(e) => e.preventDefault()}` to prevent focus loss when clicking options
  - Changed from `onblur` to `onfocusout` (blur doesn't bubble, focusout does)
- **QuickGrid Focus State Cleanup** - Cell focus border now clears when clicking outside the grid
  - Added `handleGridFocusOut` to clear `focusedCell` when focus leaves the grid
  - Prevents "stuck" focus border when clicking outside after editing
- **Dropdown Scroll Blocking** - Page no longer scrolls when scrolling inside dropdown
  - Added wheel event handler to block page scroll when dropdown is open
  - Allows scrolling within dropdown options list
- **Dropdown Width Matching** - Dropdown width now matches cell width exactly
  - Dropdown anchors to parent `<td>` element instead of editor element
  - Ensures consistent width regardless of cell padding
- **Autocomplete Debounce** - Proper 300ms debounce for async search
  - Initial options not shown when user starts editing by typing
  - Search only triggered after debounce delay
- **QuickGrid Row Action Connector Arrow** - Improved bracket-shaped connector for row action popup
  - Changed from L-shape to `[` bracket shape pointing to row's left side (middle height)
  - Arrow stays visible once row has moved (persists when returning to original position)
  - Back-loop arrow (75% to 25% height) shown when popup overlaps the target row
  - Proper horizontal spacing for arrow head (no overlap with vertical line)
  - RTL support with mirrored `]` bracket shape

- **Dialog Overlay** - Dialog no longer allows interaction with elements behind it
  - Added a proper overlay `<div>` that covers the entire viewport when dialog is visible
  - Blocks pointer events on sidebar, tabs, and all background content
  - Clicking the overlay closes the dialog (unless `preventClose` is set)
  - Replaced unreliable CSS `::before` pseudo-element approach that didn't block clicks through web component shadow DOM

## [1.0.0-rc05] - 2025-11-24 - PUBLISHED

### Added
- **NavIcon Component Export** - NavIcon component now properly exported from nav module
- **navigationStore Export** - Navigation state store now exported from stores module

### Fixed
- **Windows Makefile Compatibility** - Removed Unix-specific commands (printf, read) for Windows compatibility
- **Package Exports Completeness** - All components and stores now properly exported

## [1.0.0-rc04] - 2025-11-20

### Added
- **Short SCSS Export Paths** - Cleaner imports following industry standards
  - New short paths: `svelte-fluentui/fluent-ui`, `svelte-fluentui/theme`, `svelte-fluentui/layout`, `svelte-fluentui/nav`, `svelte-fluentui/components`
  - Old verbose paths like `svelte-fluentui/assets/styles/fluent-ui/main` still work via `./assets/*` export
  - Follows conventions used by Bootstrap, Tailwind, Angular Material
- **Comprehensive Getting Started Documentation**
  - Installation instructions with peer dependencies
  - Two styling options: SCSS (recommended) vs CSS
  - SCSS variable customization guide with `@use ... with ()` syntax
  - Complete setup example with FluentUI theme configuration
  - Constants and TypeScript usage examples
- **Component Library Page** - Restructured home page with categorized component list
  - Components grouped by category (Forms & Inputs, Layout, Navigation, Display, Feedback, Data Display)
  - Clickable component names linking directly to documentation
  - Improved Quick Links section
  - Sortable and filterable by group, name, and description

### Changed
- **SCSS by Default** - Styles now default to SCSS for variable override capability
  - Main import changed from `svelte-fluentui/styles` (CSS) to `svelte-fluentui/styles.scss` (SCSS)
  - Allows consumers to override SCSS variables using `@use ... with ()` syntax
  - CSS import still available for projects without SCSS processing
- **Removed Toast-related console.log statements** for production readiness

### Fixed
- **Docker Build** - Consolidated Dockerfile to root with VERSION parameter support
  - Removed redundant `docs/Dockerfile` and `docs/nginx.conf`
  - Default VERSION set to `1.0.0-rc04` for CI/CD compatibility
  - Simplified build process with proper SCSS file copying
  - Supports `VERSION=file:..` for local builds
- **GitIgnore** - Updated `.svelte-kit` to ignore in all directories (root and docs)
- **Component Exports** - Removed unsafe `...restProps` destructuring from 53+ components for Svelte 5 compatibility

## [1.0.0-rc03] - 2025-11-20

### Added
- **Toast Service** - Programmatic toast notification system
  - Store-based toast API with `toast.success()`, `toast.error()`, `toast.warning()`, `toast.info()`
  - ToastContainer component for rendering toasts
  - Support for 6 positions: top-right, top-left, top-center, bottom-right, bottom-left, bottom-center
  - Auto-dismiss with configurable duration
  - Optional progress bars
  - Persistent toasts that require manual dismissal
  - Programmatic dismiss by ID or dismiss all
  - Demo page at `/components/toast-service`

- **Documentation Project Structure** - Separated library and documentation
  - Created `docs/` folder with independent SvelteKit project
  - Documentation uses `svelte-fluentui` as package dependency (`file:..`)
  - Validates that library exports work correctly
  - Docker build system with VERSION parameter support
    - Build with local source: `make docker-build-docs` or `VERSION=file:..`
    - Build with npm version: `make docker-build-docs VERSION=1.0.0-rc03`
  - Follows svelte-spa-router pattern for better separation of concerns

### Added (from previous unreleased)
- **Navigation Persistence** - Sidebar navigation state persists across page reloads
  - LocalStorage integration for NavGroup expanded/collapsed state
  - New `navigationStore` for managing navigation state
  - NavGroup accepts optional `title` prop for unique identification
  - Automatic restore of navigation state on page load

- **Active Navigation Highlighting** - Current page is highlighted in navigation menu
  - Route-based active state detection using SvelteKit's `$page` store
  - Automatic "active" class application to current NavLinkItem
  - Exact match for home page, startsWith match for other routes

- **DatePicker Component** - Date selection with calendar popup (inspired by FluentUI Blazor)
  - Calendar popup with date selection
  - Min/max date validation
  - Custom date formatting options
  - Clear button functionality
  - Different appearances (filled, outline)
  - Disabled, readonly, and required states
  - Demo page at `/components/datepicker`

- **TimePicker Component** - Time selection with hour/minute/second picker (inspired by FluentUI Blazor)
  - 12-hour and 24-hour format support
  - Optional seconds display
  - Custom hour and minute step intervals
  - AM/PM selector for 12-hour format
  - Time validation and formatting
  - Clear button functionality
  - Different appearances (filled, outline)
  - Demo page at `/components/timepicker`

- **InputFile Component** - File upload with drag-drop, validation, and progress tracking (inspired by FluentUI Blazor)
  - Drag and drop zone with visual feedback
  - File type filtering via accept prop
  - File size and count validation
  - Multiple file selection support
  - Progress tracking with visual progress bars
  - Generic upload callback for custom upload logic
  - Individual file removal and clear all
  - File states: pending, uploading, completed, error
  - Events: onFileSelected, onFileUploaded, onFileError, onCompleted
  - Demo page at `/components/inputfile`

- **Autocomplete Component** - Multiple selection with tag/chip display (inspired by FluentUI Blazor)
  - Multiple selection with badge/chip display
  - Custom filtering with "contains" logic (case insensitive)
  - Async search support via onOptionsSearch callback
  - Keyboard navigation (Arrow Up/Down, Enter, Escape, Tab)
  - Maximum selections limit
  - Keep open after selection option
  - Loading indicator for async searches
  - Click outside to close
  - Configurable max results display
  - People picker use case support
  - Demo page at `/components/autocomplete`

### Changed
- **TextField Component** - Enhanced event handling support
  - Added onKeyDown, onKeyUp, onFocus, onBlur event props
  - Now properly forwards keyboard and focus events from underlying fluent-text-field
  - Matches native web component event handling capabilities

### Fixed
- **Component Props Handling** - Removed unsafe restProps spreading across all components (breaking fix for Svelte 5 compatibility)
  - Completely removed all `{...restProps}`, `{...(restProps || {})}`, and `{...rest}` template spreads
  - Prevents "Cannot convert undefined or null to object" errors caused by Svelte 5's strict proxy handling
  - Affected 49 components: Icon, Stack, Header, Layout, Footer, Grid, GridItem, Accordion, AccordionItem, Anchor, Autocomplete, Badge, Breadcrumb, BreadcrumbItem, Button, Card, Combobox, DataGrid, DataGridCell, DataGridRow, DatePicker, Dialog, InputFile, Listbox, MultiSplitter, MultiSplitterPane, TopNav, AppBar, AppBarItem, NavExpander, NavGroup, NavItem, NavLink, NavLinkItem, NavMenu, Option, Paginator, PositioningRegion, QuickGrid, Radio, RadioGroup, Search, Select, Switch, Tab, TabPanel, Tabs, Textarea, TimePicker, Toolbar, Tooltip, ResourcesIcon, Calendar
  - Removed 18 conditional spreads from Textarea component
  - **Note**: Components no longer forward arbitrary HTML attributes to underlying elements. Use explicit props instead.
  - Fixed Dialog.svelte restProps.style access with optional chaining

- **Checkbox Component** - Fixed duplicate custom element registration errors
  - Added check for existing 'fluent-checkbox' element before registration
  - Prevents "Cannot read properties of null (reading 'prototype')" errors

- **PositioningRegion Component** - Complete rewrite for proper dropdown positioning
  - Changed from `position: absolute` to `position: fixed` for viewport-relative positioning
  - Removed incorrect scroll offset calculations (window.scrollY/scrollX)
  - Added dual-mode support:
    - Positioned overlay mode (with anchor): for dropdowns, tooltips, popovers
    - Static wrapper mode (without anchor): for NavLink and other components
  - Fixed sidebar navigation items rendering empty after initial positioning fix
  - Dropdowns now appear directly below anchor elements instead of at page bottom

- **Autocomplete Component** - Improved single-select mode UX
  - Single-select now displays selected value inline in TextField (like Material-UI/Ant Design)
  - Added clear button (X) in TextField end slot for single-select mode
  - Hidden badge container and yellow background for single-select
  - Badge container only appears for multi-select mode (maxSelectedOptions > 1)
  - Hidden "Maximum 1 selection reached" message in single-select mode
  - Auto-clears selection when user starts typing in single-select mode

- **Autocomplete Component** - Fixed input disabling deadlock
  - Removed `isMaxReached` from TextField disabled condition
  - Input now stays enabled when max selections reached
  - Users can always remove selections via X buttons
  - Selection prevention already handled by selectOption function
  - Warning message still shows when max reached
  - Prevents UX deadlock where users couldn't fix their mistakes

- **Button Component** - Fixed icon-only class incorrectly applied to buttons with text
  - Changed icon slots from `<template>` to `<span>` with conditional rendering
  - Fixed icons not displaying at end of buttons
  - Added flexbox styles for proper icon vertical alignment

- **Dialog Component** - Fixed close button not being clickable
  - Replaced text "X" with proper Button component
  - Added onClose callback prop
  - Updated hide() and toggle() to call onClose callback

- **Checkbox Component** - Fixed three-state checkbox only toggling true/false
  - Implemented proper three-state cycle: true → null (indeterminate) → false → true
  - Set indeterminate attribute on fluent-checkbox element
  - Fixed "All" checkbox to show indeterminate state when some items unchecked
  - Made allChecked a derived value based on child checkboxes

- **TimePicker Component** - Fixed fields appearing locked/disabled
  - Moved click handler from icon button to entire wrapper div
  - Added cursor: pointer style to wrapper
  - Fixed popup closing immediately after selecting time values
  - Added event.stopPropagation() to prevent click bubbling

### Changed
- **Dialog Component** - Added size control options
  - Added size prop with predefined sizes: small (400px), medium (600px), large (800px), extra-large (1000px), full (90vw x 90vh)
  - Added width and height props for custom sizes
  - Created demo page showing all size options

- **Checkbox Demo Page** - Enhanced with comprehensive examples
  - Added horizontal and vertical layout examples
  - Three-state checkbox examples
  - Parent-child relationship with indeterminate state
  - Matches FluentUI Blazor documentation style

- **Analytics Domain** - Updated Plausible analytics tracking
  - Changed domain from generic to `svelte-fluentui.keenmate.dev`

## [1.0.0-rc02] - 2025-10-05

### Added
- **TopNav Component** - New responsive top navigation component
  - Mobile hamburger menu with slide-out sidebar from left
  - Desktop horizontal navigation with icons
  - Support for navigation groups with NavMenu integration
  - Theme toggle button support in actions area
  - Configurable brand, items, and height
  - Full mobile responsive support (768px breakpoint)

- **QuickGrid Component** - New data grid component with sorting, filtering, and pagination
  - TypeScript generics support for type-safe data binding
  - Column-based configuration with field mapping
  - Client-side sorting (string, number, and mixed type support)
  - Client-side filtering with case-insensitive search
  - Built-in pagination with customizable page size
  - Custom cell formatting via format functions
  - Striped and hoverable row options
  - Full FluentUI design token integration
  - Dark mode support
  - Demo page at `/components/quickgrid`

- **Reference Links** - Added documentation links to all component demo pages
  - Links to FluentUI Web Components Storybook
  - Links to FluentUI Blazor documentation
  - Clear indication of components not available in web components (N/A)

### Fixed
- **Tooltip Demo Page** - Removed Czech language text, replaced with English
- **HTML Structure** - Fixed missing opening `<p>` tags in tooltip examples
- **Web Component URLs** - Corrected Storybook URL patterns to match actual structure
  - Fixed 11 component links with proper double-name pattern (e.g., `components-button-button--docs`)
  - Marked 8 components as N/A where web components don't exist
- **Svelte 5 Compatibility** - Fixed event handler syntax errors
  - Changed `onclick="return false;"` string attributes to proper `<span>` elements
  - Updated 16 component demo pages
- **Card Component Layout** - Removed `display: flex; flex-direction: column;` from Card
  - Fixes unwanted button stretching in flex containers
  - Aligns with Microsoft's FluentUI Blazor CSS
- **Double Scrollbar Issue** - Fixed nested scroll containers causing duplicate vertical scrollbars
  - Removed `overflow` settings from `.main-content` and `.body-content`
  - Changed `.layout` from `height: 100%` to `min-height: 100vh`
  - Changed sidebar from `height: 100%` to `min-height: 100vh`
- **Legacy CSS Cleanup** - Removed old sidebar layout styles
  - Removed fixed 250px and 150px padding from `#layout` and `#menu` selectors
  - Cleaned up `static/css/main.css` media queries
  - Removed hardcoded styles from `layout.scss`
- **NavMenu Width** - Fixed hardcoded 250px width to be responsive
  - Changed default from `width: 250px` to `width: 100%`
  - Now properly respects Grid container width

### Changed
- **Navigation Structure** - Unified sidebar navigation across all pages
  - Combined site navigation (Home, Documentation, Resources) with component categories
  - Same navigation structure on root page and component pages
  - GitHub URL updated to KeenMate organization
- **Component List** - Converted static HTML table to interactive QuickGrid
  - Added 48 components with state, comment, and href data
  - Sortable and filterable columns
  - Changed page title from "List of components and their state" to "List of components"
- **Layout Architecture** - Restructured pages to use proper component hierarchy
  - Implemented `BodyContent → Grid → GridItem` structure
  - Replaced custom flexbox divs with responsive Grid system
  - Sidebar uses GridItem breakpoints (xs=12, md=3, lg=2)
  - Content area uses GridItem breakpoints (xs=12, md=9, lg=10)
- **Mobile Responsiveness** - Improved mobile layout behavior
  - Sidebar hidden on mobile (< 768px)
  - TopNav hamburger menu appears on mobile (left side)
  - Sticky sidebar on desktop, static on mobile
  - Reduced content padding on mobile (2rem → 1rem)

## [1.0.0-rc01] - 2025-01-XX

### Added
- Initial release candidate
- Complete FluentUI web component wrappers
- Layout components (Stack, Grid, GridItem, MultiSplitter)
- Navigation components (NavMenu, AppBar, Breadcrumbs)
- Form controls (TextField, Checkbox, Radio, Select, etc.)
- Data display components (DataGrid, Card, Badge, Calendar)
- Feedback components (Dialog, Toast, Tooltip)
- Paginator component
- Dark mode support
- Comprehensive demo pages for all components
- TypeScript support
- SCSS styling with FluentUI design tokens
