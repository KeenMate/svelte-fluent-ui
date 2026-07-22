# Svelte FluentUI

A comprehensive Svelte component library for the Microsoft FluentUI design system (built against FluentUI web components v2.6.x). Some components are thin wrappers around the `<fluent-*>` web components, while many others — Accordion, Select, Combobox, Autocomplete, QuickGrid, Calendar, DatePicker, TimePicker, InputFile, Tabs, and more — are full custom Svelte implementations styled with FluentUI design tokens, rewritten for better performance, control, and features than the underlying web components provide.

📖 **[Live documentation & showcase → svelte-fluentui.keenmate.dev](https://svelte-fluentui.keenmate.dev)**

## What's New in v1.5.0

The first stable release of the 1.5.0 line (promoted from the rc01–rc08 series). The highlights across the whole line:

- **`Combobox` / `Select` / `Option` — rebuilt as fast, portalled, groupable custom controls** — `Option` now renders a plain themed `<div role="option">` instead of upgrading a `<fluent-option>` per row, cutting a ~60-option `Combobox` open from ~185ms to ~12ms, and `Combobox` was rewritten (like `Select`) on a `PositioningRegion` portal so its dropdown escapes `overflow` ancestors (e.g. a `Card`) and caps to the viewport instead of growing unbounded. The family also gained grouped options (`OptionGroup` + an `OptionItem.group` field), PageUp/PageDown navigation, an empty-state message, server-side `onsearch` / custom `filter` callbacks, and per-instance `maxDropdownHeight` / `dropdownWidth` sizing.
- **`Accordion` / `AccordionItem` — reworked into a fully custom control** — Both dropped their `<fluent-accordion>` / `<fluent-accordion-item>` wrappers for plain themed elements (no shadow-DOM upgrade cost) behind a drop-in API, unlocking real control over layout: `togglePosition` (chevron side), `gap`, a per-item `disabled`, and an animated expand/collapse whose collapsed region is `inert`.
- **`Icon` — delivered through the new `svelteFluentUI` Vite plugin** — Icons no longer `fetch()` from a `/node_modules/…` URL that 404'd only in production; the plugin generates a `virtual:fluentui-icons` module so only the icons you use ship as part of normal `/_app/*` output, in either `inline` (baked into a cached chunk) or `asset` (hashed files) mode. The scanner is size/variant-aware and reads dynamic `name={…}` literals, and the plugin plus its options were renamed under the `svelteFluentUI` / `icons*` namespace.
- **New badge family — `Label`, `CompositeBadge`, `BadgeGroup`, and a beefed-up `Badge`** — Three new tag/chip components (a tinted-outline `Label`, a three-section `[icon][label][button]` `CompositeBadge`, and an overflow-collapsing `BadgeGroup` with an optional expand toggle), plus `Badge` gains `size` / `pill` / `icon` and text truncation (including start-side ellipsis for paths and hierarchies) — all on a shared `--fluent-color-*` semantic palette.
- **`CommandPalette` — promoted to a published, data-driven component** — The docs-only, `goto`-wired palette is now a first-class library export (with a `CommandPaletteTrigger` search pill): framework-agnostic navigation/action items, layered fuzzy scoring with highlighting, grouped results, `bind:open`, and a configurable global shortcut.
- **`Grid` — container-query breakpoints** — An opt-in `container` mode resolves `xs`/`sm`/`md`… against a Grid's own width instead of the viewport, so it reflows inside sidebars, panels, and splitters, with app-wide and per-Grid breakpoint configuration delivered CSP-safely via constructed stylesheets.
- **`Dialog` — focus-trap freeze and modal scroll-lock fixes** — Two open dialogs no longer ping-pong focus into a stack-overflow `RangeError` (browser freeze), and modal dialogs now lock body scroll so wheeling over the dialog no longer scrolls the page behind it.

## What's New in v1.5.0-rc08

- **`Autocomplete` — the dropdown now opens when initial options arrive after focus** — With `showInitialOptions` and an autofocused control, the on-focus handler ran before the background fetch had populated `options`, so the dropdown stayed shut; when the data later resolved, nothing re-opened it and the loaded items sat inaccessible until you typed — which needlessly re-ran the (often server-side) search. A reactive effect now opens the dropdown on the `options` empty→populated transition while the input is focused with an empty query. It's gated on that transition, so pressing `Escape` to dismiss it while still focused doesn't immediately re-open, and it respects disabled/readonly and existing single-select values.
- **`Accordion` — `end`-slot content no longer sits flush against the card edge with `togglePosition="start"`** — The heading is a 4-column grid whose order flips with `togglePosition`: in the default (`end`) mode the chevron was the rightmost cell and its margin supplied the right-edge inset. With the toggle on the leading edge, the `end` slot becomes rightmost but had no trailing inset of its own, so chips / badges / buttons in it pressed against the card border. The `end` slot now carries a matching `padding-inline-end` (8px, via `--design-unit`) in start-toggle mode, restoring the inset the chevron used to provide.
- **`Label` — resolved a `.fluent-label` class-name collision that shifted the tag chip off-centre** — The `Label` tag/chip component and the canonical form-field label helper (bold, block, sits above stacked inputs) both used the class `.fluent-label`; the helper's `margin-bottom: 0.25rem` leaked into every `<Label>`, nudging the chip up off the centre line inside a flex row. The form-field helper is renamed to **`.fluent-field-label`** (the honest name), freeing `.fluent-label` for the `Label` component alone and removing the collision at the source. **Potentially breaking** for anyone who hand-wrote `class="fluent-label"` to borrow the form-field label styling — switch those to `class="fluent-field-label"`.

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
