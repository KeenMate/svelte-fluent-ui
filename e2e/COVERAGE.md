# E2E Test Coverage Checklist

Tracks which features of `svelte-fluentui` have end-to-end test coverage in
`e2e/`. Each row is one user-observable feature. Status legend:

- `✗` — no coverage
- `△` — partial coverage (some paths)
- `✓` — covered

When a row is marked `✓`/`△`, the **Spec** column points at the file under
`e2e/` and **Fixture** at the dedicated page under
`docs/src/routes/test/<feature>/+page.svelte`.

**Scoping rule:** test our code (the wrappers' glue, custom components, layout
logic, theming hooks) — not Microsoft's FluentUI internals. For wrapper
components, assertions cover prop pass-through, two-way binding, event
forwarding, slot rendering, label rendering, `class`/`style` merging, and our
workarounds (shadow-DOM attribute injection, tri-state, validation
delegation). Visual rendering inside `<fluent-*>` elements is FluentUI's job.

**Portaled overlays:** dropdowns, popovers, menus, tooltips, and modal dialogs
use `PositioningRegion` (`use:portal`), so they get reparented to
`document.body` at runtime. Wrap-scoped locators won't find them. Use
page-scoped locators (`page.locator(".options-list")`, etc.) — only one
overlay is open at a time so there's no ambiguity. Fixtures whose overlays
open on mount (via `$effect`) need to live on their own route so they don't
collide with overlays from other test interactions on the shared page.
Affects Autocomplete, DatePicker, TimePicker, Menu, ContextMenu, Tooltip,
Dialog.

**Driving `oninput`:** prefer `input.click()` + `input.pressSequentially(text,
{delay: 30})` over `input.fill(text)`. Playwright's `.fill()` doesn't
reliably dispatch `input` events for Svelte 5 component inputs in this
codebase — see FINDINGS.md #2. `.pressSequentially` simulates real
keystrokes and works consistently.

**SPA hydration timing:** for routes that rely on mount-time `$effect`, use
`page.goto(url, {waitUntil: "networkidle"})` + `locator.waitFor({state:
"attached"})` before asserting on effect-driven state. See FINDINGS.md #4.

See `FINDINGS.md` for component bugs/limitations discovered while writing
specs (keepOpen, etc.).

---

## 1. Custom components — full behavioral coverage

| Component | Status | Spec | Fixture |
| --- | :---: | --- | --- |
| Autocomplete | ✓ | `autocomplete.spec.ts` | `autocomplete/+page.svelte`, `autocomplete/initial-query/+page.svelte` |
| InputFile | ✗ | | |
| QuickGrid — sort & filter | ✗ | | |
| QuickGrid — pagination | ✗ | | |
| QuickGrid — selection | ✗ | | |
| QuickGrid — tree / expandedPaths | ✗ | | |
| DatePicker | ✗ | | |
| Calendar | ✗ | | |
| TimePicker | ✗ | | |
| Paginator | ✗ | | |
| Tab / Tabs | ✗ | | |
| Toast + ToastContainer + store | ✗ | | |
| Card | ✗ | | |

## 2. Layout / nav — interactive behavior

| Component | Status | Spec | Fixture |
| --- | :---: | --- | --- |
| MultiSplitter (drag resize) | ✗ | | |
| TopNav (mobile toggle, sidebar) | ✗ | | |
| AppBar / NavMenu / NavGroup / NavLinkItem / NavItem | ✗ | | |

## 3. Field / validation

| Component | Status | Spec | Fixture |
| --- | :---: | --- | --- |
| Field | ✗ | | |
| ValidationSummary | ✗ | | |

## 4. Theming

| Feature | Status | Spec | Fixture |
| --- | :---: | --- | --- |
| FluentUI design tokens (`accentBaseColor.setValueFor`, `baseLayerLuminance`, `neutralBaseColor`, etc.) at document scope | ✗ | | |
| Design tokens at per-element scope | ✗ | | |
| CSS custom property overrides (`--accent-fill-rest`, `--neutral-foreground-rest`, etc.) | ✗ | | |

## 5. Wrapper plumbing — grouped specs

Each spec asserts only wrapper-specific concerns: prop pass-through,
two-way binding via `$bindable`, event forwarding (Svelte-5 lowercase
convention), `class`/`style` merge, slot rendering (`start`/`end`/`labelTemplate`),
label rendering + position, our workarounds, validation method delegation.
We do not assert behavior inside the underlying `<fluent-*>` element.

| Group | Wrappers | Status | Spec | Fixture |
| --- | --- | :---: | --- | --- |
| Form fields | TextField, Textarea, NumberField, Search | ✗ | `wrappers-form-fields.spec.ts` | `wrappers-form-fields/` |
| Toggles | Checkbox (incl. tri-state both orderings), Switch, Radio, RadioGroup | ✗ | `wrappers-toggles.spec.ts` | `wrappers-toggles/` |
| Pickers | Select, Combobox, Listbox, Option, Slider | ✗ | `wrappers-pickers.spec.ts` | `wrappers-pickers/` |
| Buttons | Button, Anchor, MenuButton | ✗ | `wrappers-buttons.spec.ts` | `wrappers-buttons/` |
| Dialogs & menus | Dialog, Menu, MenuItem, ContextMenu, Tooltip | ✗ | `wrappers-dialogs-menus.spec.ts` | `wrappers-dialogs-menus/` |
| Disclosure | Accordion, AccordionItem, Tree, TreeItem, DataGrid + Row + Cell | ✗ | `wrappers-disclosure.spec.ts` | `wrappers-disclosure/` |
| Misc | Badge, Divider, Progress, Breadcrumb, BreadcrumbItem, Toolbar, Alert, Icon | ✗ | `wrappers-misc.spec.ts` | `wrappers-misc/` |
