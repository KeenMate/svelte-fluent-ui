/**
 * Shared types for MultiSplitter / MultiSplitterPane communication via the
 * "multi-splitter" Svelte context.
 *
 * PaneHandle is intentionally opaque from the pane's POV — it just holds it
 * and passes it back to context methods for identity. The parent owns all
 * working state attached to the handle.
 */

export type PaneRegistration = {
	el: HTMLElement
	getGutterEl: () => HTMLElement | undefined
	size?: string
	min?: string
	max?: string
	canMin: boolean
}

export type PaneHandle = {
	/** Opaque identity. Carries reactive `isMin` for the pane to read. */
	readonly id: number
	readonly state: {isMin: boolean}
}

export type MultiSplitterContext = {
	readonly orientation: "horizontal" | "vertical"
	registerPane(opts: PaneRegistration): PaneHandle
	unregisterPane(handle: PaneHandle): void
	indexOf(handle: PaneHandle): number
	isLast(handle: PaneHandle): boolean
	isMinimized(handle: PaneHandle): boolean
	onGutterPointerDown(e: PointerEvent, handle: PaneHandle): void
	onGutterKeydown(e: KeyboardEvent, handle: PaneHandle): void
	onGutterDblClick(e: MouseEvent, handle: PaneHandle): void
	onPaneClick(e: MouseEvent, handle: PaneHandle): void
}
