# Svelte FluentUI

A comprehensive Svelte component library for the Microsoft FluentUI design system (built against FluentUI web components v2.6.x). Some components are thin wrappers around the `<fluent-*>` web components, while many others — Accordion, Select, Combobox, Autocomplete, QuickGrid, Calendar, DatePicker, TimePicker, InputFile, Tabs, and more — are full custom Svelte implementations styled with FluentUI design tokens, rewritten for better performance, control, and features than the underlying web components provide.

📖 **[Live documentation & showcase → svelte-fluentui.keenmate.dev](https://svelte-fluentui.keenmate.dev)**

## What's New in v1.6.0-rc05

- **`Combobox` — real multi-select with chips, `keepOpen`, and `tagsPosition`** — The `multiple` prop was previously declared but inert (selection was hard-coded single-select). It now works end to end: selected values render as removable chips while the input stays a live filter, clicking a selected row de-selects it, and Backspace on an empty filter removes the last chip. A new `keepOpen` prop (default `true`, multi only) keeps the dropdown open so several values can be picked in a row, and `tagsPosition` (`"inline"` | `"above"` | `"below"`) can move the chips to a wrapping row outside the control — mirroring `Autocomplete`. `value`/`onchange` carry the full array in both modes, and multi-select emits one hidden `<input>` per value for form submission.

- **`Select` & `Combobox` — `readonly` mode** — Both gained a `readonly` prop to match `Autocomplete` (and readonly text fields): the value shows but can't be changed — the dropdown won't open, options can't be toggled, typing is blocked, and chips can't be removed. Unlike `disabled` it stays focusable and un-dimmed, with a neutral-secondary fill signalling it's inert. This also fixed a contrast bug where inline chips blended into the readonly/filled field background — they now get a white fill and a 1px ring.

- **Dropdowns now render above modal dialogs, and dismiss when focus leaves** — An open `Select`/`Combobox`/`Autocomplete` dropdown opened *inside* a dialog used to render underneath it whenever the dialog's z-index sat above the popover layer (the docs' Site settings dialog is at `z-index: 10000`). Portalled dropdowns are now promoted to the browser **top layer** via the Popover API, which paints above all z-indexed content regardless of the number — no ancestor detection, one rule for every consumer, with a z-index fallback for browsers lacking the API. Complementing that, all three controls now also close when focus leaves them (a modal opening, or Tab-ing away), so a page-level dropdown can't linger on top of an unrelated modal.

- **`Autocomplete` — built-in search magnifier that toggles the dropdown** — Matching the FluentUI Blazor look, an accent-coloured magnifier (the real `ic_fluent_search_16_regular` icon) now renders by default at the end of the input as a full-height square button that opens/closes the list. It yields to the clear button, loading spinner, and any custom `endIcon` in that priority order, and can be turned off with `showSearchIcon={false}`.

- **`Autocomplete` — steadier inline-tags layout** — Inline (tags) mode is now two flex boxes — a wrapping chips+input box and a separate end-slot box always at the end — so the magnifier no longer jumps to the row start when a chip wraps or is removed. The end slot is a fixed control-height square that centres whatever it holds, so swapping between clear/spinner/magnifier no longer nudges the glyph or changes the control height. Wrapped chip rows also gained vertical breathing room, and chips picked from async search results now show their real label instead of the raw value id.

- **Chips consolidated into one shared component with an accent ×** — `Autocomplete` and `Combobox` each had their own chip markup, CSS, and tokens, which had drifted apart (grey × in some places, red in others). Both now render a single internal `Chip` component themed via a `--fluent-chip-*` token set, and the remove × is accent-coloured everywhere so it follows the theme accent set by the Site settings "Color" combo.

## What's New in v1.6.0-rc04

- **Grid container queries — fixed intermittent column collapse at wide containers** — In `<Grid container>` mode, grid items could suddenly shrink to their content width and pack to the left at certain container widths, most visibly past the md/lg stops. The cause was a self-referential CSS custom property: `--col` fell back to `var(--col)`, which CSS treats as a dependency cycle (fallbacks count toward cycle detection even when unused), so the variable resolved to an invalid empty value and `flex-basis` degraded to `auto`. Chromium only hit this during incremental style recalc, which is why it surfaced intermittently and looked width-dependent. The fix rewrites the fallback in both `containerQueries.ts` (runtime-generated named-container rules) and `GridItem.svelte` (static default-container rules) to chain through the breakpoint variables (`--md → --sm → --xs → 12`), which never name `--col`. As a belt-and-suspenders guard, `--col` is now registered with `@property` so any future invalid value clamps to full width rather than collapsing.

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
