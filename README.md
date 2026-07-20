# Svelte FluentUI

A comprehensive Svelte component library for the Microsoft FluentUI design system (built against FluentUI web components v2.6.x). Some components are thin wrappers around the `<fluent-*>` web components, while many others — Accordion, Select, Combobox, Autocomplete, QuickGrid, Calendar, DatePicker, TimePicker, InputFile, Tabs, and more — are full custom Svelte implementations styled with FluentUI design tokens, rewritten for better performance, control, and features than the underlying web components provide.

📖 **[Live documentation & showcase → svelte-fluentui.keenmate.dev](https://svelte-fluentui.keenmate.dev)**

## What's New in v1.5.0-rc07

- **`Icon` / `svelteFluentUI` — icons now travel through Vite's normal output, not a `/node_modules/…` URL** — The `Icon` component used to `fetch()` each SVG at runtime from a literal `/node_modules/@fluentui/svg-icons/icons/…` path that the host had to serve, so any icon the scanner missed 404'd **only in production** (rendering the ⚠️ fallback) — which is exactly how the Accordion custom-toggle demo lost `subtract`. The plugin now generates a `virtual:fluentui-icons` module the component imports, so only the icons you actually use ship as part of the standard `/_app/*` output. Two delivery modes via `svelteFluentUI({ iconsMode })`: `inline` (default) bakes each icon's SVG markup into a shared cached JS chunk (zero runtime requests); `asset` emits each icon as a hashed `/_app/*` file fetched on demand (smaller bundle). Dev and prod now resolve icons identically, so a missing icon fails the same way in both — before deploy, not after.
- **Vite plugin renamed `fluentuiIcons` → `svelteFluentUI`, icon options namespaced** — It's the library's plugin (icons being its first concern, with room to grow), so every icon-specific option now carries an `icons` prefix: `mode`→`iconsMode`, `include`→`iconsInclude`, `sizes`→`iconsSizes`, `variants`→`iconsVariants`, `configFile`→`iconsConfigFile`, `scanExtensions`→`iconsScanExtensions` (`verbose` unchanged). Migration is a rename: `import { svelteFluentUI } from 'svelte-fluentui/vite'` and update the option keys.
- **`Icon` — the scanner is size/variant-aware and reads dynamic `name={…}` literals** — It reads each `<Icon>` tag's `size`, `variant`, and `hoverEffect` so only the exact `name_size_variant` tuples you render are bundled (no size → default 24; dynamic `size={expr}` → all configured sizes). It also extracts quoted literals from dynamic expressions, so ternaries (`name={active ? "star_filled" : "star"}`) and concatenations are detected automatically; fully computed names still need `iconsInclude`.
- **`Icon` — no more phantom icons from unrelated `name:` properties** — The programmatic-usage scanner used to match a bare `name: "…"` in any object literal, so API-doc tables full of `{ name: "options", type: … }`, form schemas, and column configs pulled phantom icons into the bundle whenever a property value collided with a real icon name. It now only honours the `icon:` / `iconName:` convention — in the docs this dropped the detected-icon count from 266 to 88.
- **`Icon` — default and per-icon size/variant control via the config file and `iconsInclude`** — `fluentui-icons.config.json` (`.js`/`.ts`) now accepts an object form `{ sizes, variants, icons }`. Top-level `sizes`/`variants` cap the fallback bundled for any icon whose size can't be determined statically — chiefly data-driven `<Icon name={item.icon} size={20} />`, which would otherwise pull every size; `"sizes": [16, 20]` alone roughly halved the docs' inlined file count. Each entry in `icons` (and in the `iconsInclude` option) can also be an object `{ name, sizes, variants }` that caps that one icon, including its auto-detected usage.

## What's New in v1.5.0-rc06

- **`Accordion` / `AccordionItem` — reworked into a fully custom control** — Both components used to wrap `<fluent-accordion>` / `<fluent-accordion-item>`, which meant layout, spacing, and toggle placement were locked behind the web components' shadow DOM, and every open paid a custom-element upgrade cost. They are now built from plain themed elements styled with FluentUI design tokens — the same approach as the `Select` / `Combobox` / `Option` family — giving full control over layout and behaviour with no shadow-DOM upgrade. The public API stays a drop-in for the old wrappers (`value`, `multi`, `AccordionItem`'s `id` / `header` / `headingLevel` / `expanded`, and the `heading` / `start` / `end` / `icon` / `children` snippets), and single/multi expand, roving-focus keyboard navigation (Arrow / Home / End), and the full ARIA wiring (`role=heading` / `aria-level`, `aria-expanded`, `aria-controls` ↔ `role=region`) are preserved.
- **`Accordion` — `togglePosition` and `gap` props** — The rework unlocks native control over the chevron side and item spacing. `togglePosition="start"` moves the expand/collapse chevron to the leading (left in LTR) edge; it defaults to `"end"` (right, unchanged). `gap` sets the spacing between items to any CSS length (e.g. `gap="0.75rem"`). And in `multi` mode you can now bind `value` to an array of every item id to open all panels at once, with `null` collapsing everything.
- **`AccordionItem` — `disabled` prop** — A disabled item can't be toggled and is skipped by keyboard navigation, so arrow-key roving focus steps over it cleanly rather than landing on an inert header.
- **`Accordion` — animated expand/collapse** — Panels now open and close with a smooth height transition (a `grid-template-rows` 0fr→1fr animation) instead of the old wrapper's instant snap, and the collapsed content region is marked `inert` so it leaves both the tab order and the accessibility tree while hidden.
- **`QuickGrid` — row toolbar renders real FluentUI icons** — The floating row toolbar (`showRowToolbar` / `rowToolbar`) previously rendered each item's `icon` as raw text and shipped Unicode glyphs (`↑ ↓ + ⧉ −`) that render inconsistently across brand fonts — under a DHL-themed consumer app they came out invisible, leaving a wide empty toolbar. Toolbar items now render through `<Icon name={item.icon} size={16} />`, and the predefined icons are FluentUI names (`add`, `delete`, `copy`, `arrow_up`, `arrow_down`). **Breaking for custom `rowToolbar` items:** the `icon` field is now a FluentUI icon name (e.g. `'arrow_up'`), not a display glyph.

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
