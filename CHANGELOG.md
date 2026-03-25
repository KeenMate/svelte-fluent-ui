# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
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
