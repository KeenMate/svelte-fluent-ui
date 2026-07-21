# Svelte FluentUI

A comprehensive Svelte component library for the Microsoft FluentUI design system (built against FluentUI web components v2.6.x). Some components are thin wrappers around the `<fluent-*>` web components, while many others — Accordion, Select, Combobox, Autocomplete, QuickGrid, Calendar, DatePicker, TimePicker, InputFile, Tabs, and more — are full custom Svelte implementations styled with FluentUI design tokens, rewritten for better performance, control, and features than the underlying web components provide.

📖 **[Live documentation & showcase → svelte-fluentui.keenmate.dev](https://svelte-fluentui.keenmate.dev)**

## What's New in v1.5.0-rc08

- **`Autocomplete` — the dropdown now opens when initial options arrive after focus** — With `showInitialOptions` and an autofocused control, the on-focus handler ran before the background fetch had populated `options`, so the dropdown stayed shut; when the data later resolved, nothing re-opened it and the loaded items sat inaccessible until you typed — which needlessly re-ran the (often server-side) search. A reactive effect now opens the dropdown on the `options` empty→populated transition while the input is focused with an empty query. It's gated on that transition, so pressing `Escape` to dismiss it while still focused doesn't immediately re-open, and it respects disabled/readonly and existing single-select values.
- **`Accordion` — `end`-slot content no longer sits flush against the card edge with `togglePosition="start"`** — The heading is a 4-column grid whose order flips with `togglePosition`: in the default (`end`) mode the chevron was the rightmost cell and its margin supplied the right-edge inset. With the toggle on the leading edge, the `end` slot becomes rightmost but had no trailing inset of its own, so chips / badges / buttons in it pressed against the card border. The `end` slot now carries a matching `padding-inline-end` (8px, via `--design-unit`) in start-toggle mode, restoring the inset the chevron used to provide.
- **`Label` — resolved a `.fluent-label` class-name collision that shifted the tag chip off-centre** — The `Label` tag/chip component and the canonical form-field label helper (bold, block, sits above stacked inputs) both used the class `.fluent-label`; the helper's `margin-bottom: 0.25rem` leaked into every `<Label>`, nudging the chip up off the centre line inside a flex row. The form-field helper is renamed to **`.fluent-field-label`** (the honest name), freeing `.fluent-label` for the `Label` component alone and removing the collision at the source. **Potentially breaking** for anyone who hand-wrote `class="fluent-label"` to borrow the form-field label styling — switch those to `class="fluent-field-label"`.

## What's New in v1.5.0-rc07

- **`Icon` / `svelteFluentUI` — icons now travel through Vite's normal output, not a `/node_modules/…` URL** — The `Icon` component used to `fetch()` each SVG at runtime from a literal `/node_modules/@fluentui/svg-icons/icons/…` path that the host had to serve, so any icon the scanner missed 404'd **only in production** (rendering the ⚠️ fallback) — which is exactly how the Accordion custom-toggle demo lost `subtract`. The plugin now generates a `virtual:fluentui-icons` module the component imports, so only the icons you actually use ship as part of the standard `/_app/*` output. Two delivery modes via `svelteFluentUI({ iconsMode })`: `inline` (default) bakes each icon's SVG markup into a shared cached JS chunk (zero runtime requests); `asset` emits each icon as a hashed `/_app/*` file fetched on demand (smaller bundle). Dev and prod now resolve icons identically, so a missing icon fails the same way in both — before deploy, not after.
- **Vite plugin renamed `fluentuiIcons` → `svelteFluentUI`, icon options namespaced** — It's the library's plugin (icons being its first concern, with room to grow), so every icon-specific option now carries an `icons` prefix: `mode`→`iconsMode`, `include`→`iconsInclude`, `sizes`→`iconsSizes`, `variants`→`iconsVariants`, `configFile`→`iconsConfigFile`, `scanExtensions`→`iconsScanExtensions` (`verbose` unchanged). Migration is a rename: `import { svelteFluentUI } from 'svelte-fluentui/vite'` and update the option keys.
- **`Icon` — the scanner is size/variant-aware and reads dynamic `name={…}` literals** — It reads each `<Icon>` tag's `size`, `variant`, and `hoverEffect` so only the exact `name_size_variant` tuples you render are bundled (no size → default 24; dynamic `size={expr}` → all configured sizes). It also extracts quoted literals from dynamic expressions, so ternaries (`name={active ? "star_filled" : "star"}`) and concatenations are detected automatically; fully computed names still need `iconsInclude`.
- **`Icon` — no more phantom icons from unrelated `name:` properties** — The programmatic-usage scanner used to match a bare `name: "…"` in any object literal, so API-doc tables full of `{ name: "options", type: … }`, form schemas, and column configs pulled phantom icons into the bundle whenever a property value collided with a real icon name. It now only honours the `icon:` / `iconName:` convention — in the docs this dropped the detected-icon count from 266 to 88.
- **`Icon` — default and per-icon size/variant control via the config file and `iconsInclude`** — `fluentui-icons.config.json` (`.js`/`.ts`) now accepts an object form `{ sizes, variants, icons }`. Top-level `sizes`/`variants` cap the fallback bundled for any icon whose size can't be determined statically — chiefly data-driven `<Icon name={item.icon} size={20} />`, which would otherwise pull every size; `"sizes": [16, 20]` alone roughly halved the docs' inlined file count. Each entry in `icons` (and in the `iconsInclude` option) can also be an object `{ name, sizes, variants }` that caps that one icon, including its auto-detected usage.

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
