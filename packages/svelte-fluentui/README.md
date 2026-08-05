# Svelte FluentUI

A comprehensive Svelte component library for the Microsoft FluentUI design system (built against FluentUI web components v2.6.x). Some components are thin wrappers around the `<fluent-*>` web components, while many others — Accordion, Select, Combobox, Autocomplete, QuickGrid, Calendar, DatePicker, TimePicker, InputFile, Tabs, and more — are full custom Svelte implementations styled with FluentUI design tokens, rewritten for better performance, control, and features than the underlying web components provide.

📖 **[Live documentation & showcase → svelte-fluentui.keenmate.dev](https://svelte-fluentui.keenmate.dev)**

## What's New in v1.6.0-rc04

- **Grid container queries — fixed intermittent column collapse at wide containers** — In `<Grid container>` mode, grid items could suddenly shrink to their content width and pack to the left at certain container widths, most visibly past the md/lg stops. The cause was a self-referential CSS custom property: `--col` fell back to `var(--col)`, which CSS treats as a dependency cycle (fallbacks count toward cycle detection even when unused), so the variable resolved to an invalid empty value and `flex-basis` degraded to `auto`. Chromium only hit this during incremental style recalc, which is why it surfaced intermittently and looked width-dependent. The fix rewrites the fallback in both `containerQueries.ts` (runtime-generated named-container rules) and `GridItem.svelte` (static default-container rules) to chain through the breakpoint variables (`--md → --sm → --xs → 12`), which never name `--col`. As a belt-and-suspenders guard, `--col` is now registered with `@property` so any future invalid value clamps to full width rather than collapsing.

## What's New in v1.6.0-rc03

- **`QuickGrid` — the floating row toolbar no longer renders off-screen** — On a hovered row the action toolbar (move up/down, add, duplicate, delete) could show up as an empty strip because it was being positioned hundreds of pixels off the left edge of the viewport. The toolbar is placed by `PositioningRegion`, whose `matchWidth` prop defaults to `true` so dropdowns can match their input's width; with the grid *row* as the anchor, Floating UI's `size` middleware stretched the toolbar to the full row width (e.g. 814px) and then computed a large negative `left` to fit that oversized box, pushing it — icons and all — outside the viewport. The toolbar now passes `matchWidth={false}`, so it keeps its natural content width and Floating UI positions it correctly beside the row.

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
