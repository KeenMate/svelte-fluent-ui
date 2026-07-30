# Svelte FluentUI

A comprehensive Svelte component library for the Microsoft FluentUI design system (built against FluentUI web components v2.6.x). Some components are thin wrappers around the `<fluent-*>` web components, while many others — Accordion, Select, Combobox, Autocomplete, QuickGrid, Calendar, DatePicker, TimePicker, InputFile, Tabs, and more — are full custom Svelte implementations styled with FluentUI design tokens, rewritten for better performance, control, and features than the underlying web components provide.

📖 **[Live documentation & showcase → svelte-fluentui.keenmate.dev](https://svelte-fluentui.keenmate.dev)**

## What's New in v1.6.0-rc03

- **`QuickGrid` — the floating row toolbar no longer renders off-screen** — On a hovered row the action toolbar (move up/down, add, duplicate, delete) could show up as an empty strip because it was being positioned hundreds of pixels off the left edge of the viewport. The toolbar is placed by `PositioningRegion`, whose `matchWidth` prop defaults to `true` so dropdowns can match their input's width; with the grid *row* as the anchor, Floating UI's `size` middleware stretched the toolbar to the full row width (e.g. 814px) and then computed a large negative `left` to fit that oversized box, pushing it — icons and all — outside the viewport. The toolbar now passes `matchWidth={false}`, so it keeps its natural content width and Floating UI positions it correctly beside the row.

## What's New in v1.6.0-rc02

- **Icons — library-internal icons (like the QuickGrid toolbar) now bundle automatically** — The `svelteFluentUI()` build plugin scans your project for `<Icon>` usage and deliberately skips `node_modules`, so icons that svelte-fluentui's *own* components render — chiefly the QuickGrid row toolbar's `add`/`delete`/`copy`/`arrow_up`/`arrow_down` — were invisible to detection and never shipped, leaving the toolbar an empty row unless you hand-listed every glyph in `fluentui-icons.config.json`. The plugin now also scans its own `components` directory (located relative to the plugin file via `import.meta.url`, so it resolves from both a published `dist/` install and source in dev) and merges those internal icon requirements into the bundle. The whole library statically references only a handful of icons, so the added cost is negligible. Controlled by the new `iconsScanLibrary` option (default `true`); set it `false` to opt out.
- **`QuickGrid` — row-toolbar items accept a custom `iconSnippet` for Font Awesome, inline SVG, or any markup** — Each `rowToolbar` item previously rendered its icon strictly through the built-in `<Icon name={item.icon} />`, so its `icon` field only accepted a FluentUI icon name with no path to a Font Awesome glyph or arbitrary SVG. `RowToolbarItem` now has an optional `iconSnippet?: Snippet` that takes precedence over `icon` when present (and `icon` becomes optional when a snippet is supplied); predefined string items like `'add'`/`'delete'` and existing `icon:`-based items are unchanged. Pass `rowToolbar={[{ id: 'del', title: 'Delete', iconSnippet: trashIcon, onclick }]}` with a `{#snippet trashIcon()}...{/snippet}`.
- **Docs — new "Working with Icons" guide** — A dedicated page walks through how icon detection and bundling actually work, what the scanner can and can't see, the `fluentui-icons.config.json` allowlist in full, the new library-internal auto-detection, and a live `iconSnippet` demo — plus a troubleshooting checklist for blank icons and empty toolbars.

For the full history, see the [CHANGELOG](https://github.com/KeenMate/svelte-fluentui/blob/prod/CHANGELOG.md).

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

## Documentation

- 📖 **[Live showcase & component docs](https://svelte-fluentui.keenmate.dev)** — interactive demos and API tables
- 🧩 **[COMPONENTS.md](https://github.com/KeenMate/svelte-fluentui/blob/prod/COMPONENTS.md)** — full catalogue of available components and per-component highlights
- 💡 **[EXAMPLES.md](https://github.com/KeenMate/svelte-fluentui/blob/prod/EXAMPLES.md)** — copy-paste usage examples (forms, grids, dialogs, toasts, layout, the `portal` action, the z-index scale)
- 🛠 **[DEVELOPMENT.md](https://github.com/KeenMate/svelte-fluentui/blob/prod/DEVELOPMENT.md)** — building the library, running the docs site, and contributing
- 📜 **[CHANGELOG.md](https://github.com/KeenMate/svelte-fluentui/blob/prod/CHANGELOG.md)** — release history

## License

MIT © [KeenMate](https://github.com/KeenMate)

## Credits

Built on top of [Microsoft FluentUI Web Components](https://github.com/microsoft/fluentui) v2.6.x.

Several advanced components — Calendar, DatePicker, TimePicker, InputFile, and Autocomplete — are inspired by [Microsoft FluentUI Blazor](https://www.fluentui-blazor.net/).
