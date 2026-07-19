# Svelte FluentUI

A comprehensive Svelte component library for the Microsoft FluentUI design system (built against FluentUI web components v2.6.x). Some components are thin wrappers around the `<fluent-*>` web components, while many others — Accordion, Select, Combobox, Autocomplete, QuickGrid, Calendar, DatePicker, TimePicker, InputFile, Tabs, and more — are full custom Svelte implementations styled with FluentUI design tokens, rewritten for better performance, control, and features than the underlying web components provide.

📖 **[Live documentation & showcase → svelte-fluentui.keenmate.dev](https://svelte-fluentui.keenmate.dev)**

## What's New in v1.5.0-rc06

- **`Accordion` / `AccordionItem` — reworked into a fully custom control** — Both components used to wrap `<fluent-accordion>` / `<fluent-accordion-item>`, which meant layout, spacing, and toggle placement were locked behind the web components' shadow DOM, and every open paid a custom-element upgrade cost. They are now built from plain themed elements styled with FluentUI design tokens — the same approach as the `Select` / `Combobox` / `Option` family — giving full control over layout and behaviour with no shadow-DOM upgrade. The public API stays a drop-in for the old wrappers (`value`, `multi`, `AccordionItem`'s `id` / `header` / `headingLevel` / `expanded`, and the `heading` / `start` / `end` / `icon` / `children` snippets), and single/multi expand, roving-focus keyboard navigation (Arrow / Home / End), and the full ARIA wiring (`role=heading` / `aria-level`, `aria-expanded`, `aria-controls` ↔ `role=region`) are preserved.
- **`Accordion` — `togglePosition` and `gap` props** — The rework unlocks native control over the chevron side and item spacing. `togglePosition="start"` moves the expand/collapse chevron to the leading (left in LTR) edge; it defaults to `"end"` (right, unchanged). `gap` sets the spacing between items to any CSS length (e.g. `gap="0.75rem"`). And in `multi` mode you can now bind `value` to an array of every item id to open all panels at once, with `null` collapsing everything.
- **`AccordionItem` — `disabled` prop** — A disabled item can't be toggled and is skipped by keyboard navigation, so arrow-key roving focus steps over it cleanly rather than landing on an inert header.
- **`Accordion` — animated expand/collapse** — Panels now open and close with a smooth height transition (a `grid-template-rows` 0fr→1fr animation) instead of the old wrapper's instant snap, and the collapsed content region is marked `inert` so it leaves both the tab order and the accessibility tree while hidden.
- **`QuickGrid` — row toolbar renders real FluentUI icons** — The floating row toolbar (`showRowToolbar` / `rowToolbar`) previously rendered each item's `icon` as raw text and shipped Unicode glyphs (`↑ ↓ + ⧉ −`) that render inconsistently across brand fonts — under a DHL-themed consumer app they came out invisible, leaving a wide empty toolbar. Toolbar items now render through `<Icon name={item.icon} size={16} />`, and the predefined icons are FluentUI names (`add`, `delete`, `copy`, `arrow_up`, `arrow_down`). **Breaking for custom `rowToolbar` items:** the `icon` field is now a FluentUI icon name (e.g. `'arrow_up'`), not a display glyph.

## What's New in v1.5.0-rc05

- **`Combobox` / `Select` / `Autocomplete` — control the dropdown's height and width independently of the input** — All three custom dropdowns portal their listbox out via `PositioningRegion`, but the listbox height was capped only to the viewport-available space and its width was locked to the control, with no per-instance override. Two new string props fix that. `maxDropdownHeight` (e.g. `"240px"`, `"50vh"`) sets a ceiling — the listbox height becomes `min(available-viewport-space, maxDropdownHeight)`, so it still shrinks to stay on-screen but never grows past your value. `dropdownWidth` (e.g. `"360px"`) gives the list its own width so it can be wider than a narrow input (to show long labels) or narrower, while the control keeps its own `width`; when unset the list matches the control exactly as before. On `Select` both apply to single-select mode (multi mode still uses `maxVisibleOptions`), and `Autocomplete`'s dropdown is now viewport-aware too (its old hardcoded 300px is now the `maxDropdownHeight` default). Each demo page gains slider-driven examples for both.

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
