# Svelte FluentUI

A comprehensive Svelte component library for the Microsoft FluentUI design system (built against FluentUI web components v2.6.x). Some components are thin wrappers around the `<fluent-*>` web components, while many others — Accordion, Select, Combobox, Autocomplete, QuickGrid, Calendar, DatePicker, TimePicker, InputFile, Tabs, and more — are full custom Svelte implementations styled with FluentUI design tokens, rewritten for better performance, control, and features than the underlying web components provide.

📖 **[Live documentation & showcase → svelte-fluentui.keenmate.dev](https://svelte-fluentui.keenmate.dev)**

## What's New in v1.6.0-rc01

- **`Tabs` — `canLeave` guard to block switching away from a tab with unsaved changes** — Give the active `<Tab>` a `canLeave` callback and `Tabs` calls it before navigating anywhere else, cancelling the switch if it returns `false`. Because `Tabs` renders its own tablist and owns every switch, there was no veto point before — clicking another tab simply switched, even mid-edit. The guard now sits at a single chokepoint that covers click, keyboard, swipe, and overflow-menu navigation, and it's async, so you can `await confirm(...)` or a save prompt instead of only blocking synchronously. Assigning `activeId` directly still bypasses it by design — that's your own navigation to gate.
- **`Tabs` — `canClose` guard to confirm before a tab's × button destroys it** — Separate from `canLeave` because leaving keeps a tab alive while closing throws it away: `canClose` runs before the close button fires `oncloseclick`, and a `false` (or a `Promise<boolean>` resolving false) cancels the close. It guards the specific tab being closed rather than the active one, and it's async-capable for confirm dialogs. The closable-tabs demo now confirms on close for every file except `Notes.txt`, which is left unguarded to show the opt-out.
- **`Tabs` — docs corrected and the dead `overflow` prop removed** — The page used to claim Tabs are "built on `<fluent-tab>`", but the Svelte rewrite renders native `<button role="tab">` elements and only reaches for a FluentUI web component (`<fluent-menu>`) in the overflow menu — the description now reflects that. The long-deprecated `overflow` prop (it warned and did nothing, replaced by `responsive="menu"`) is gone from both API tables and its redundant demo, and new `canLeave` / `canClose` rows and demos were added.

## What's New in v1.5.0

The first stable release of the 1.5.0 line (promoted from the rc01–rc08 series). The highlights across the whole line:

- **`Combobox` / `Select` / `Option` — rebuilt as fast, portalled, groupable custom controls** — `Option` now renders a plain themed `<div role="option">` instead of upgrading a `<fluent-option>` per row, cutting a ~60-option `Combobox` open from ~185ms to ~12ms, and `Combobox` was rewritten (like `Select`) on a `PositioningRegion` portal so its dropdown escapes `overflow` ancestors (e.g. a `Card`) and caps to the viewport instead of growing unbounded. The family also gained grouped options (`OptionGroup` + an `OptionItem.group` field), PageUp/PageDown navigation, an empty-state message, server-side `onsearch` / custom `filter` callbacks, and per-instance `maxDropdownHeight` / `dropdownWidth` sizing.
- **`Accordion` / `AccordionItem` — reworked into a fully custom control** — Both dropped their `<fluent-accordion>` / `<fluent-accordion-item>` wrappers for plain themed elements (no shadow-DOM upgrade cost) behind a drop-in API, unlocking real control over layout: `togglePosition` (chevron side), `gap`, a per-item `disabled`, and an animated expand/collapse whose collapsed region is `inert`.
- **`Icon` — delivered through the new `svelteFluentUI` Vite plugin** — Icons no longer `fetch()` from a `/node_modules/…` URL that 404'd only in production; the plugin generates a `virtual:fluentui-icons` module so only the icons you use ship as part of normal `/_app/*` output, in either `inline` (baked into a cached chunk) or `asset` (hashed files) mode. The scanner is size/variant-aware and reads dynamic `name={…}` literals, and the plugin plus its options were renamed under the `svelteFluentUI` / `icons*` namespace.
- **New badge family — `Label`, `CompositeBadge`, `BadgeGroup`, and a beefed-up `Badge`** — Three new tag/chip components (a tinted-outline `Label`, a three-section `[icon][label][button]` `CompositeBadge`, and an overflow-collapsing `BadgeGroup` with an optional expand toggle), plus `Badge` gains `size` / `pill` / `icon` and text truncation (including start-side ellipsis for paths and hierarchies) — all on a shared `--fluent-color-*` semantic palette.
- **`CommandPalette` — promoted to a published, data-driven component** — The docs-only, `goto`-wired palette is now a first-class library export (with a `CommandPaletteTrigger` search pill): framework-agnostic navigation/action items, layered fuzzy scoring with highlighting, grouped results, `bind:open`, and a configurable global shortcut.
- **`Grid` — container-query breakpoints** — An opt-in `container` mode resolves `xs`/`sm`/`md`… against a Grid's own width instead of the viewport, so it reflows inside sidebars, panels, and splitters, with app-wide and per-Grid breakpoint configuration delivered CSP-safely via constructed stylesheets.
- **`Dialog` — focus-trap freeze and modal scroll-lock fixes** — Two open dialogs no longer ping-pong focus into a stack-overflow `RangeError` (browser freeze), and modal dialogs now lock body scroll so wheeling over the dialog no longer scrolls the page behind it.

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
