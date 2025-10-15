# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Svelte wrapper library for FluentUI web components (version 2.6.x). The project uses SvelteKit with TypeScript, Tailwind CSS, and SCSS for styling. It's packaged as a reusable component library that wraps Microsoft's FluentUI web components.

## Development Commands

- `npm run dev` - Start development server
- `npm run dev -- --open` - Start development server and open in browser
- `npm run build` - Build the production app and package the library
- `npm run preview` - Preview the production build
- `npm run check` - Run TypeScript checking
- `npm run check:watch` - Run TypeScript checking in watch mode
- `npm run lint` - Run linting (Prettier + ESLint)
- `npm run format` - Format code with Prettier
- `npm run prepack` - Package the library for publishing (runs automatically on build)

## Architecture

### Library Structure
- `src/lib/` - Main library code that gets packaged
- `src/lib/components/` - Svelte component wrappers for FluentUI web components
- `src/lib/components/index.ts` - Main component exports
- `src/routes/` - Demo/showcase pages for development and testing

### Component Organization
- Individual components: Button, Checkbox, TextField, etc.
- Layout components: `src/lib/components/layout/` (Stack, Layout, Header, Footer, Grid, GridItem, MultiSplitter, etc.)
- Navigation components: `src/lib/components/nav/` (AppBar, NavMenu, NavItem, etc.)
- Data components: QuickGrid (custom grid with sorting, filtering, pagination)
- Icons: `src/lib/components/icons/`
- FluentUI utilities: `src/lib/fluent-ui/` (calendar utilities, constants, setup)

### Styling
- Uses SCSS for component-specific styling
- Tailwind CSS for utility classes
- FluentUI web component styles imported via `@fluentui/web-components`
- Main styles: `src/lib/main.scss`
- Component styles: `src/assets/styles/components.scss`
- FluentUI-specific styles: `src/assets/styles/fluent-ui/`

### Key Files
- `src/lib/index.ts` - Main library entry point (exports from components/index.js)
- `src/lib/components/index.ts` - All component exports
- Package exports to `dist/` directory for publishing

## Dependencies

- **Svelte 5.x** - Component framework
- **SvelteKit** - Build tool and framework
- **@fluentui/web-components 2.6.1** - Microsoft FluentUI web components
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **TypeScript** - Type checking
- **SASS** - CSS preprocessing

## Development Notes

- This project wraps FluentUI web components rather than reimplementing them
- Demo pages in `src/routes/components/` show component usage
- Library components should follow existing naming and export patterns
- TypeScript checking is required before commits
- Components are exported both individually and through index files

### Custom Components vs FluentUI Wrappers

This project contains two types of components:

#### Custom Implementations (No FluentUI wrapper)
These are built from scratch using Svelte, styled with FluentUI design tokens:

- **QuickGrid** - Advanced data grid with sorting, filtering, and pagination (inspired by ASP.NET QuickGrid)
- **Card** - Content container with FluentUI styling
- **Toast** - Notification/toast component (uses fluent-anchor but custom layout)
- **Calendar** - Date picker with custom FluentUI calendar implementation
- **DatePicker** - Date selection with calendar popup (inspired by FluentUI Blazor)
- **TimePicker** - Time selection with hour/minute/second picker (inspired by FluentUI Blazor)
- **InputFile** - File upload with drag-drop, validation, and progress tracking (inspired by FluentUI Blazor)
- **Autocomplete** - Multiple selection with tag/chip display and custom filtering (inspired by FluentUI Blazor)
- **Paginator** - Pagination control with custom logic
- **Tab/Tabs** - Tab navigation (wraps fluent-tab but adds significant custom logic)

#### Layout Components (Custom implementations)
Located in `src/lib/components/layout/`:
- **Stack** - Flexbox layout container (vertical/horizontal)
- **Grid** - Responsive 12-column grid system
- **GridItem** - Grid column item
- **Layout** - Page layout wrapper
- **Header** - Page header section
- **Footer** - Page footer section
- **BodyContent** - Main content area
- **Spacer** - Spacing utility
- **MultiSplitter** - Resizable multi-panel splitter
- **MultiSplitterPane** - Splitter panel

#### Navigation Components (Custom implementations)
Located in `src/lib/components/nav/`:
- **AppBar** - Application bar
- **NavMenu** - Navigation menu container
- **NavGroup** - Navigation group
- **NavLinkItem** - Navigation link item
- **NavItem** - Generic navigation item

#### FluentUI Web Component Wrappers
These wrap `<fluent-*>` web components from `@fluentui/web-components`:

- **Accordion** → `<fluent-accordion>`
- **AccordionItem** → `<fluent-accordion-item>`
- **Anchor** → `<fluent-anchor>`
- **Badge** → `<fluent-badge>`
- **Breadcrumb** → `<fluent-breadcrumb>`
- **BreadcrumbItem** → `<fluent-breadcrumb-item>`
- **Button** → `<fluent-button>`
- **Checkbox** → `<fluent-checkbox>`
- **Combobox** → `<fluent-combobox>`
- **DataGrid** → `<fluent-data-grid>`
- **DataGridRow** → `<fluent-data-grid-row>`
- **DataGridCell** → `<fluent-data-grid-cell>`
- **Dialog** → `<fluent-dialog>`
- **Divider** → `<fluent-divider>`
- **Listbox** → `<fluent-listbox>`
- **Menu** → `<fluent-menu>`
- **MenuItem** → `<fluent-menu-item>`
- **NumberField** → `<fluent-number-field>`
- **Option** → `<fluent-option>`
- **Progress** → `<fluent-progress>`
- **Radio** → `<fluent-radio>`
- **RadioGroup** → `<fluent-radio-group>`
- **Search** → `<fluent-search>`
- **Select** → `<fluent-select>`
- **Slider** → `<fluent-slider>`
- **Switch** → `<fluent-switch>`
- **TabPanel** → `<fluent-tab-panel>`
- **Textarea** → `<fluent-text-area>`
- **TextField** → `<fluent-text-field>`
- **Toolbar** → `<fluent-toolbar>`
- **Tooltip** → `<fluent-tooltip>`
- **Tree** → `<fluent-tree-view>`
- **TreeItem** → `<fluent-tree-item>`

**IMPORTANT for Wrapper Components:**
- Only include properties that are actually supported by the underlying `<fluent-*>` component
- All properties must be passed through to the FluentUI component (either explicitly or via `{...restProps}`)
- Do not add properties that have no effect - they confuse users

### Component Demo Pages

All component demo pages follow a consistent structure:
- Located in `src/routes/components/[component-name]/+page.svelte`
- Use Stack, Grid, GridItem, and Card for layout
- Include reference links to FluentUI Web Components Storybook and FluentUI Blazor docs
- Show API documentation tables with properties, types, and descriptions
- Provide multiple usage examples demonstrating different features

## CSS Variable Naming Convention

**IMPORTANT**: CSS custom properties follow a strict component-based naming convention:

### Prefix Structure
Each primary component has its own prefix for CSS variables. Even if similar properties exist across components (like icon gaps), they use separate variables scoped to their component.

**Examples:**
- Sidebar: `--fluent-sidebar-*` (background, text, padding, icon-gap, link-padding, etc.)
- Navbar: `--fluent-navbar-*` (background, text, border, icon-gap, etc.)
- Header: `--fluent-header-*` (background, text, border, etc.)
- Footer: `--fluent-footer-*` (background, text, border, etc.)

### Why Separate Variables?
Even though a sidebar and navbar might both have an "icon gap", they use different variables:
- `--fluent-sidebar-icon-gap` for sidebar icons
- `--fluent-navbar-icon-gap` for navbar icons

**Rationale:**
- Each component can be styled independently
- Themes can override component-specific values
- If a theme wants the same value everywhere, it can set both variables to the same value
- Provides maximum flexibility without coupling components

### Variable Categories
Variables are organized by their component/purpose:
- **Background** - `--fluent-bg-*`
- **Text** - `--fluent-text-*`
- **Border** - `--fluent-border-*`
- **Accent** - `--fluent-accent-*`
- **Navbar** - `--fluent-navbar-*`
- **Sidebar** - `--fluent-sidebar-*`
- **Header** - `--fluent-header-*`
- **Footer** - `--fluent-footer-*`
- **Spacing** - `--fluent-component-*`
- **Typography** - `--fluent-body-*`, `--fluent-heading-*`
- **Animation** - `--fluent-transition`

## Naming Conventions

**IMPORTANT**: This project follows Microsoft FluentUI's naming conventions strictly:

### Property Names
- Always use **camelCase** for property names
- Examples: `horizontalAlign`, `autoUpdateMode`, `topCTAType`, `verticalAlign`
- ❌ Never use: `snake_case`, `PascalCase`, or `kebab-case` for property names

### Property Values
- Always use **lowercase** for single-word values
  - Examples: `"center"`, `"accent"`, `"neutral"`, `"vertical"`, `"horizontal"`
  - ❌ Never use: `"Center"`, `"Accent"`, `"Vertical"`

- Always use **kebab-case** for multi-word values
  - Examples: `"flex-start"`, `"flex-end"`, `"space-between"`, `"space-around"`
  - ❌ Never use: `"FlexStart"`, `"flexStart"`, `"flex_start"`

### Examples

✅ **Correct:**
```svelte
<Stack orientation="vertical" gap="1rem" />
<Grid justify="flex-start" spacing={3} />
<Tooltip position="top" autoUpdateMode="auto" />
<Badge appearance="accent" />
<Toast topCTAType="timestamp" />
```

❌ **Incorrect:**
```svelte
<Stack orientation="Vertical" gap="1rem" />
<Grid justify="FlexStart" spacing={3} />
<Tooltip position="Top" autoUpdateMode="Auto" />
<Badge appearance="Accent" />
<Toast topCTAType="Timestamp" />
```