# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
