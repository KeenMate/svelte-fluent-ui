# Svelte FluentUI

A comprehensive Svelte component library for the Microsoft FluentUI design system (built against FluentUI web components v2.6.x). Some components are thin wrappers around the `<fluent-*>` web components, while many others — Accordion, Select, Combobox, Autocomplete, QuickGrid, Calendar, DatePicker, TimePicker, InputFile, Tabs, and more — are full custom Svelte implementations styled with FluentUI design tokens, rewritten for better performance, control, and features than the underlying web components provide.

📖 **[Live documentation & showcase → svelte-fluentui.keenmate.dev](https://svelte-fluentui.keenmate.dev)**

## What's New in v1.6.0-rc06

- **`DataGrid` — `gridTemplateColumns` prop for explicit column widths** — The `DataGrid` wrapper had no way to set a column layout, so hand-composed grids fell back to FluentUI's auto-generation (one `1fr` per cell derived from the first row), which offers no control over widths. The new `gridTemplateColumns` prop maps to the `<fluent-data-grid grid-template-columns>` attribute — FluentUI then applies it to every row — so you can write `gridTemplateColumns="1fr 1fr"` or `"2fr 100px"` when composing `DataGridRow`/`DataGridCell` by hand.

- **`CommandPaletteTrigger` rebuilt on the native `Button`** — The search-pill launcher was a hand-rolled `<button>` styled only with design tokens, carrying its own hover/focus/press styling. It now renders through the library's `Button` (`<fluent-button>`, `appearance="neutral"`), so it's a real Fluent element that inherits Fluent's interaction states. The search-box look is composed from the button's slots — magnifier in `start`, placeholder in the default slot, shortcut hint in `end` — with two `::part` overrides relaxing the control's centred layout so the placeholder fills and the `⌘K`/`Ctrl K` chip pins to the trailing edge. The public API (`placeholder`, `shortcut`, `size`, `class`, `onclick`) is unchanged.

- **Theme switching no longer animates a laggy colour fade on some controls** — Toggling light↔dark repainted most of the page in one step, but a handful of controls (`Combobox`, `Autocomplete`, `Select` in combo style, `InputFile` dropzones, `CommandPaletteTrigger`, and the Fluent `switch` track) carry short `transition`s on `background`/`border-color` for hover feedback. Those couldn't tell a hover change from a theme-token change, so on a swap they animated the old palette → new palette over ~0.1–0.2s, reading as a glitch. The theme swap now adds a short-lived `.fluent-theme-switching` class to `<html>` for two animation frames and a global rule disables every transition for that window — including the shadow-DOM switch track via `fluent-switch::part(switch)` — so the palette flips in one step, then interaction transitions resume immediately.

- **`DataGrid` — header cells no longer jam to the left, out of line with the data** — Two global CSS selector leaks collided with FluentUI's own class names on the data-grid host elements. The layout `Header` component's bare `.header` rule leaked onto the grid's header *row* (FluentUI tags it `class="header"`) and forced `display: flex` over the row's shadow `display: grid`, collapsing the header cells; and a bare Blazor-legacy `.column-header` rule hijacked the header *cells* (`class="column-header"`), replacing their padding with 1px and centering the text. Both rules are now tag-qualified (`header.header`, `th.column-header`) so they only match the real elements they were meant for, and the header lines up with its columns again.

- **`Toast` (declarative component) is visible again** — The declarative `<Toast>` rendered a bare `.fluent-toast` element, which defaults to `opacity: 0` and translated off-screen and only becomes visible once the `fluent-toast--show` modifier is added (the programmatic `ToastService` adds it; the component never did). Every `<Toast>` therefore painted fully hidden. It now renders with the `--show` modifier so it's visible in place, and its card border — which used an undefined `--neutral-stroke-1` token that dropped the border entirely — now uses the theme-aware `--neutral-stroke-rest`.

- **Dark mode — Fluent text inputs match the custom controls' border** — `Search`/`TextField`/`NumberField`/`Textarea` paint their border from FluentUI's input-recipe tokens, which render as a faint side border plus a subtle underline; on a dark background the sides all but vanish, so a `Search` box sat next to an `Autocomplete` with a clearly visible full box and the two didn't match. The web components now paint the same full 1px box from the theme-aware `--neutral-stroke-rest` (via `::part(root)`/`::part(control)`), so every field shares one border treatment in both light and dark. Focus and validation accents are untouched.

## What's New in v1.6.0-rc05

- **`Combobox` — real multi-select with chips, `keepOpen`, and `tagsPosition`** — The `multiple` prop was previously declared but inert (selection was hard-coded single-select). It now works end to end: selected values render as removable chips while the input stays a live filter, clicking a selected row de-selects it, and Backspace on an empty filter removes the last chip. A new `keepOpen` prop (default `true`, multi only) keeps the dropdown open so several values can be picked in a row, and `tagsPosition` (`"inline"` | `"above"` | `"below"`) can move the chips to a wrapping row outside the control — mirroring `Autocomplete`. `value`/`onchange` carry the full array in both modes, and multi-select emits one hidden `<input>` per value for form submission.

- **`Select` & `Combobox` — `readonly` mode** — Both gained a `readonly` prop to match `Autocomplete` (and readonly text fields): the value shows but can't be changed — the dropdown won't open, options can't be toggled, typing is blocked, and chips can't be removed. Unlike `disabled` it stays focusable and un-dimmed, with a neutral-secondary fill signalling it's inert. This also fixed a contrast bug where inline chips blended into the readonly/filled field background — they now get a white fill and a 1px ring.

- **Dropdowns now render above modal dialogs, and dismiss when focus leaves** — An open `Select`/`Combobox`/`Autocomplete` dropdown opened *inside* a dialog used to render underneath it whenever the dialog's z-index sat above the popover layer (the docs' Site settings dialog is at `z-index: 10000`). Portalled dropdowns are now promoted to the browser **top layer** via the Popover API, which paints above all z-indexed content regardless of the number — no ancestor detection, one rule for every consumer, with a z-index fallback for browsers lacking the API. Complementing that, all three controls now also close when focus leaves them (a modal opening, or Tab-ing away), so a page-level dropdown can't linger on top of an unrelated modal.

- **`Autocomplete` — built-in search magnifier that toggles the dropdown** — Matching the FluentUI Blazor look, an accent-coloured magnifier (the real `ic_fluent_search_16_regular` icon) now renders by default at the end of the input as a full-height square button that opens/closes the list. It yields to the clear button, loading spinner, and any custom `endIcon` in that priority order, and can be turned off with `showSearchIcon={false}`.

- **`Autocomplete` — steadier inline-tags layout** — Inline (tags) mode is now two flex boxes — a wrapping chips+input box and a separate end-slot box always at the end — so the magnifier no longer jumps to the row start when a chip wraps or is removed. The end slot is a fixed control-height square that centres whatever it holds, so swapping between clear/spinner/magnifier no longer nudges the glyph or changes the control height. Wrapped chip rows also gained vertical breathing room, and chips picked from async search results now show their real label instead of the raw value id.

- **Chips consolidated into one shared component with an accent ×** — `Autocomplete` and `Combobox` each had their own chip markup, CSS, and tokens, which had drifted apart (grey × in some places, red in others). Both now render a single internal `Chip` component themed via a `--fluent-chip-*` token set, and the remove × is accent-coloured everywhere so it follows the theme accent set by the Site settings "Color" combo.

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
