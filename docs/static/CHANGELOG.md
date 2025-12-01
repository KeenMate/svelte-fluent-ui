# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **QuickGrid Editable Mode** - Excel-like inline cell editing (inspired by FluentUI Blazor)
  - Navigate mode with arrow key navigation between cells
  - Editor types: `text`, `number`, `checkbox`, `select`, `date`, `autocomplete`, `custom`
  - Custom editor support via `oncelledit` callback with context object
  - Sync and async validation with `validate` callback
  - Dynamic options loading with `loadOptions` and `optionsLoadTrigger`
  - Per-column edit triggers: `click`, `dblclick`, `button`, `always`, `navigate`
  - Events: `onrowchange`, `onroweditstart`, `onroweditcancel`, `onvalidationerror`
  - GridCellEditor component for consistent editor UI
  - Demo page at `/components/quickgrid-editable`

- **Dialog Component Enhancements** - Improved keyboard handling and close control
  - `closeOnEscape` prop - Enable/disable Escape key to close dialog (default: true)
  - `onbeforeclose` callback - Return false to prevent closing (for unsaved data checks)
  - Escape key now closes dialog (respects `preventClose`, `closeOnEscape`, and `onbeforeclose`)
  - X button also respects `onbeforeclose` callback

- **Select/Option Component Data Support** - Select now returns both value and item data on change
  - `Option` component: Added `data` prop to store arbitrary context data
  - `Select` component: `onchange` now returns `{ value: string, data?: Record<string, unknown> }`
  - Eliminates need to manually look up selected item from data array

- **Tabs/Tab Component Enhancements** - Tab change event now includes context data
  - `Tab` component: Added `data` prop to store arbitrary context data
  - `Tabs` component: `ontabchange` now returns `{ tabId: string, data?: Record<string, unknown> }`
  - Renamed `onTabChange` → `ontabchange` (Svelte 5 convention)
  - Renamed `onCloseClick` → `oncloseclick` on Tab component

- **Dialog Modal Backdrop** - Added proper backdrop for modal dialogs
  - Backdrop blocks interaction with content behind the dialog
  - Semi-transparent overlay (rgba(0, 0, 0, 0.4))
  - Proper z-index layering (backdrop: 1040, dialog: 1050)

- **Badge Component Rewrite** - Replaced buggy fluent-badge with custom implementation
  - Same API: `color`, `fill`, `appearance`, `circular`, `onclick`, `class`, `style`
  - Uses CSS variables for theming (`--badge-fill-*`, `--badge-color-*`)
  - Appearance variants: lightweight, accent, neutral, outline, tint

- **NumberField Component Enhancements** - New properties matching FluentUI Blazor API
  - `minlength` - Minimum character length
  - `maxlength` - Maximum character length
  - `size` - Input field size
  - `list` - ID of a datalist element for suggestions
  - `ariaLabel` - Accessibility label (aria-label)
  - `title` - Tooltip text on hover
  - `width` - Component width (e.g., '300px', '100%')
  - `height` - Component height
  - `class` - Additional CSS classes
  - `start` slot - Content/icon before the input
  - `end` slot - Content/icon after the input
  - `onfocus`, `onblur`, `onkeydown`, `onkeyup` event handlers
  - `focus()`, `blur()`, `select()` methods

- **NumberField Documentation Page** - Comprehensive rewrite with FluentUI Blazor examples
  - API documentation tables (Parameters, EventCallbacks, Methods, Slots)
  - Reference links to FluentUI Web Components and FluentUI Blazor
  - Default examples (integer, nullable integer, positive integer)
  - Types examples (short, integer, long, float, decimal)
  - Types with constraints (min/max overrides)
  - Display examples (full width, placeholder, hide steps, required, disabled, read-only)
  - Icons examples with start/end slots
  - Focus examples (autofocus, focus async with button)
  - Filled appearance examples
  - Callback example with onchange

### Fixed
- **Dialog Padding** - Fixed excessive default padding on fluent-dialog
  - Added `::part(control)` CSS to set standard 1rem padding

- **QuickGrid Navigate Mode - Custom Editor Focus** - Fixed arrow keys not working after custom editor commit
  - Custom editors now properly refocus the cell after commit/cancel in navigate mode
  - Same fix previously applied to checkbox/select/date editors

- **ToastContainer Svelte 5 Compatibility** - Fixed legacy `$:` reactive statement
  - Converted `$:` block to `$effect()` for Svelte 5 runes mode
  - Converted variables to `$state` and `$derived`
  - Fixes "legacy_reactive_statement_invalid" error in runes mode

- **Dialog X Button Not Working** - Fixed close button using wrong event handler name
  - Changed `onClick` → `onclick` (Svelte 5 convention)
  - Also fixed Dismiss button handler

- **Numeric Property Binding Issues** - Fixed multiple components failing with falsy values like 0
  - Pattern `prop={prop || null}` fails when value is 0 (e.g., `min={0}` becomes `null`)
  - Fixed using spread pattern: `{...(prop !== undefined ? { prop } : {})}`
  - Components fixed: NumberField, Search, Textarea, Listbox, GridItem

- **GridItem Data Attributes** - Fixed undefined values being passed to data attributes
  - Changed from `data-sm={sm}` to spread pattern to avoid "Cannot convert undefined to object" errors

- **NumberField "undefined" Rendering** - Fixed attributes rendering as literal "undefined"
  - All optional attributes now use `|| null` pattern
  - Title attribute uses spread pattern to avoid rendering "null"

- **Checkbox Component** - Added missing props matching FluentUI Blazor API
  - `name` - Form field name
  - `label` - Label text (alternative to children slot)
  - `ariaLabel` - Accessibility label
  - `class` - Additional CSS classes
  - `style` - Inline styles
  - `threeStateOrderUncheckToIntermediate` - Controls three-state cycle order (false: Unchecked→Checked→Intermediate, true: Unchecked→Intermediate→Checked)

- **Checkbox Documentation Page** - Comprehensive rewrite with FluentUI Blazor examples
  - API documentation tables (Properties, Callbacks)
  - Reference links to FluentUI Web Components and FluentUI Blazor
  - Default checkbox examples (horizontal/vertical layouts)
  - Three-state examples with value display
  - Three-state list with parent/child checkboxes
  - Disabled and read-only examples
  - Label and form integration examples

- **Listbox Component** - Added missing props matching FluentUI Blazor API
  - `name` - Form field name
  - `label` - Label text displayed above the listbox
  - `ariaLabel` - Accessibility label
  - `width` - Component width (e.g., '300px', '100%')
  - `height` - Component height (e.g., '200px')
  - `size` - Number of visible options
  - `class` - Additional CSS classes
  - `style` - Inline styles
  - `onchange` - Callback when selection changes

- **Listbox Documentation Page** - Comprehensive rewrite with FluentUI Blazor examples
  - API documentation tables (Properties, Callbacks, Slots)
  - Reference links to FluentUI Web Components and FluentUI Blazor
  - Manual example with various option states
  - Default example with people picker
  - From list of Option<T> items examples
  - Long list example (US States)
  - Long list with Width and Height example
  - Option template with icons and badges
  - Multiple selection example
  - Disabled and label examples

- **Badge Component** - Enhanced with color system and documentation
  - `fill` - Background color key referencing `--badge-fill-[name]` CSS variable
  - `color` - Text color key referencing `--badge-color-[name]` CSS variable
  - `class` - Additional CSS classes
  - `style` - Inline styles
  - Built-in colors: brand, danger, important, informative, severe, subtle, success, warning
  - Auto-fills `fill` from `color` when only color is specified
  - Technical documentation comment explaining the color system

- **Badge Documentation Page** - Comprehensive examples
  - API documentation tables (Properties, Callbacks, Slots)
  - Reference links to FluentUI Web Components and FluentUI Blazor
  - Built-in colors showcase
  - Appearance examples (accent, lightweight, neutral, outline, tint)
  - Color + Appearance combinations grid
  - Custom colors with CSS variables
  - Circular badge examples

- **Autocomplete Component Enhancements** - New properties matching FluentUI Blazor API
  - `tagsPosition` - Control where selected tags appear: `"inline"` (default, inside input like FluentUI Blazor), `"above"`, or `"below"` the input field
  - `labelTemplate` - Custom label content via Svelte snippet
  - `id` - Element ID
  - `title` - Tooltip text
  - `ariaLabel` - Accessibility label
  - `height` - Component height
  - `multiple` - Explicitly enable/disable multi-select mode (independent of maxSelectedOptions)
  - `loading` - External loading state control (overrides internal isSearching state)
  - `immediateDelay` - Debounce delay in ms before triggering search
  - `selectValueOnTab` - Control whether Tab key selects highlighted option (default: true)
  - `headerContent` - Snippet for custom header in dropdown
  - `footerContent` - Snippet for custom footer in dropdown
  - `optionTemplate` - Snippet for custom option rendering
  - `ondismissed` - Callback when dropdown closes
  - Backspace key removes last chip when input is empty (inline mode UX improvement)
  - Custom inline chips with proper focus state management
  - Click anywhere in inline container focuses input

- **Autocomplete Documentation Page** - Comprehensive examples matching FluentUI Blazor
  - Default examples with basic, pre-selected, and single-select variants
  - **Tags Position examples** - Demonstrates all three modes: inline (default), above, and below
  - Multiple vs single-select mode examples
  - Many items with maxOptionsSearch and maxSelectedOptions
  - Close via code with keepOpen
  - Initial options with async search pattern
  - Disabled, readonly, and required states
  - Appearance styles (outline, filled)
  - Width customization
  - Debounce (immediateDelay) example
  - Option template with custom rendering (icons, email)
  - Header and footer content snippets
  - Select on Tab behavior examples
  - Callback examples (onselectedoptionschange, ondismissed)
  - Code examples for basic usage, async search, and custom templates

- **Combobox Component Enhancements** - New properties matching FluentUI Blazor API
  - `label` - Label text displayed above the combobox
  - `labelTemplate` - Custom label content via Svelte snippet
  - `ariaLabel` - Accessibility label (aria-label)
  - `title` - Tooltip text
  - `width` - Component width (e.g., '300px', '100%')
  - `height` - Component height
  - `class` - Additional CSS classes
  - `style` - Inline styles
  - `onchange` - Callback when selection changes

- **Combobox Documentation Page** - Comprehensive examples matching FluentUI Blazor
  - Default examples with basic, pre-selected, and placeholder variants
  - Option types: from Option array and inline Option elements
  - Disabled states: entire combobox, individual items, all items disabled
  - Appearance styles: outline (default) and filled
  - Autocomplete modes: inline, list, and both
  - List examples: long scrollable list, position above/below
  - Option template with custom content (icons + formatted text)
  - Width/styling examples
  - Callback example demonstrating onchange

### Fixed
- **Autocomplete Dropdown Jumping** - Fixed dropdown moving up/down when navigating with arrow keys
  - PositioningRegion now only calculates position when dropdown opens, not on every re-render
  - Prevents position recalculation during keyboard navigation

- **Autocomplete Tags Styling (above/below modes)** - Fixed ugly appearance of tags
  - Replaced `<fluent-badge>` with custom styled elements for full CSS control
  - Tags now match FluentUI Blazor style: neutral background, dark text, red X icon

- **Combobox "undefined" Display Bug** - Fixed attributes rendering as literal "undefined" string
  - Fixed `title` attribute showing "undefined" tooltip when not set (now uses spread pattern)
  - Fixed `data-option-label` in Option.svelte rendering "undefined" (now uses `|| null`)

- **Combobox Position Prop** - Fixed `position="above"` not being applied correctly
  - FluentUI web components require property assignment, not just attribute
  - Added `$effect` to set `element.position` property after mount
  - Position now correctly forces dropdown above or below input

- **Combobox Pre-selected Value Display** - Fixed pre-selected values not showing label on initial render
  - Added initialization effect with setTimeout to wait for fluent-option elements to register
  - Now correctly displays the selected option's label text in the input field

## [1.0.0-rc06] - 2025-11-27

### Added
- **Alert Component** - Notification banner for displaying important messages
  - 4 intent levels: `info`, `success`, `warning`, `danger`
  - Optional `title` prop for header
  - Optional `dismissable` prop with dismiss button
  - Custom `icon` slot (Svelte 5 snippet) to override default intent icons
  - `ondismiss` callback
  - Demo page at `/components/alert`

- **Icon Component Documentation** - Comprehensive guide for using FluentUI icons
  - Setup instructions with Vite plugin
  - Examples for sizes, variants, colors, and hover effects
  - API reference and plugin options
  - Demo page at `/components/icon`

- **Vite Plugin: fluentuiIcons** - Smart icon bundling for production builds
  - Dev mode: Serves icons directly from node_modules
  - Build mode: Scans source files and copies only used icons to output
  - Auto-detects `<Icon name="..." />` patterns in .svelte, .ts, .js files
  - Config file support (`fluentui-icons.config.json`) for registering dynamic icons
  - Configurable sizes, variants, and output path
  - Import via `import { fluentuiIcons } from 'svelte-fluentui/vite'`

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
