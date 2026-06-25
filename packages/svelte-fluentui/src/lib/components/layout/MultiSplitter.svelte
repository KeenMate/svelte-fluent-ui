<!--
 * MultiSplitter
 *
 * Resizable container with N panes (N ≥ 2). Drag a gutter to resize,
 * arrow keys nudge size when a gutter is focused, double-click toggles
 * minimize when an adjacent pane opts in via `minimize` prop.
 *
 * Ported from pureadmin.io's splitter (packages/core/src/js/splitter.js)
 * into Svelte 5. Behaviour notes inline; the original is the canonical
 * reference for the rebalance / accordion / snap-to-rail subtleties.
 *
 * Drag model is REBALANCE (not boundary-coupled): each gutter resizes its
 * primary neighbour (edge-closer side) and the matching opposite delta is
 * distributed across the contiguous block of non-rail panes on the
 * secondary side. Rail panes stay pinned at railSize and don't participate.
-->

<script lang="ts" module>
	export type {MultiSplitterContext, PaneHandle, PaneRegistration} from "../../types/multi-splitter.js"

	export type MultiSplitterResizeDetail = {index: number; pane: HTMLElement; size: number}
	export type MultiSplitterToggleDetail = {index: number; pane: HTMLElement}
</script>

<script lang="ts">
	import {setContext, onMount} from "svelte"
	import type {SlotType} from "../../types/index.js"
	import type {MultiSplitterContext, PaneHandle, PaneRegistration} from "../../types/multi-splitter.js"

	type Orientation = "horizontal" | "vertical"

	type Props = {
		children?: SlotType
		orientation?: Orientation
		/** localStorage persistence key — saves under "fluent-multi-splitter:<id>". */
		id?: string
		/** Keyboard step in px when a gutter is focused. */
		step?: number
		/** Rail width in px when a pane is minimized. */
		railSize?: number
		/** Drag-to-rail snap threshold as ratio of the drag-start size (0–1). */
		minimizeThreshold?: number
		width?: string
		height?: string
		class?: string
		style?: string
		/** Logs drag / minimize transitions to console (development aid). */
		debug?: boolean
		onresize?: (detail: MultiSplitterResizeDetail) => void
		oncollapse?: (detail: MultiSplitterToggleDetail) => void
		onexpand?: (detail: MultiSplitterToggleDetail) => void
	}

	let {
		children = undefined,
		orientation = "horizontal",
		id: persistId = undefined,
		step = 10,
		railSize = 40,
		minimizeThreshold = 0.40,
		width = undefined,
		height = undefined,
		class: className = "",
		style = "",
		debug = false,
		onresize = undefined,
		oncollapse = undefined,
		onexpand = undefined
	}: Props = $props()

	const STORAGE_PREFIX = "fluent-multi-splitter:"

	const isVertical = $derived(orientation === "vertical")
	const clientAxis = $derived<"clientHeight" | "clientWidth">(isVertical ? "clientHeight" : "clientWidth")
	const clientCoord = $derived<"clientX" | "clientY">(isVertical ? "clientY" : "clientX")

	let rootEl: HTMLDivElement | undefined = $state()
	let panes: PaneHandle[] = $state([])

	// Class form so `state` can carry a `$state` field — Svelte 5 disallows
	// `$state(...)` inside object literals, but allows it as a class field.
	class PaneHandleImpl implements PaneHandle {
		id: number
		state = $state({isMin: false})
		constructor(id: number) { this.id = id }
	}

	// Per-handle non-reactive working state. Hot drag loop reads from here.
	type PaneInternal = {
		el: HTMLElement
		getGutterEl: () => HTMLElement | undefined
		canMin: boolean
		rawSize?: string
		rawMin?: string
		rawMax?: string
		size: number
		min: number
		max: number
		lastNonZero: number
	}
	const internals = new Map<PaneHandle, PaneInternal>()
	let accordionActive = false
	let nextHandleId = 0

	function log(...args: unknown[]) {
		if (!debug) return
		console.log("[multi-splitter:" + (persistId || "anon") + "]", ...args)
	}

	function parseSize(raw: string | undefined, totalPx: number): number | null {
		if (raw == null || raw === "") return null
		const s = String(raw).trim()
		if (s.endsWith("%")) {
			const pct = parseFloat(s)
			return isNaN(pct) ? null : (pct / 100) * totalPx
		}
		if (s.endsWith("px")) {
			const px = parseFloat(s)
			return isNaN(px) ? null : px
		}
		const n = parseFloat(s)
		if (!isNaN(n) && /^-?\d*\.?\d+$/.test(s)) return n
		return null
	}

	function readStorage(): {sizes?: number[]; lasts?: number[]; minimized?: boolean[]} | null {
		if (!persistId) return null
		try {
			const raw = localStorage.getItem(STORAGE_PREFIX + persistId)
			if (!raw) return null
			const parsed = JSON.parse(raw)
			if (typeof parsed !== "object" || parsed === null || parsed.v !== 2) return null
			return parsed
		} catch { return null }
	}

	function writeStorage() {
		if (!persistId) return
		const sizes = panes.map(h => internals.get(h)!.size)
		const lasts = panes.map(h => internals.get(h)!.lastNonZero)
		const minimized = panes.map(h => h.state.isMin)
		try { localStorage.setItem(STORAGE_PREFIX + persistId, JSON.stringify({v: 2, sizes, lasts, minimized})) }
		catch { /* quota/privacy mode */ }
	}

	function gapPx(): number {
		if (!rootEl) return 0
		const cs = getComputedStyle(rootEl)
		const raw = isVertical ? cs.rowGap : cs.columnGap
		const px = parseFloat(raw)
		return isNaN(px) ? 0 : px
	}

	function paddingPx(): number {
		if (!rootEl) return 0
		const cs = getComputedStyle(rootEl)
		const start = isVertical ? cs.paddingTop : cs.paddingLeft
		const end = isVertical ? cs.paddingBottom : cs.paddingRight
		return (parseFloat(start) || 0) + (parseFloat(end) || 0)
	}

	function gutterTotal(): number {
		// Sum across all rendered gutters (last pane has none). Reads measured
		// size so a per-instance --gutter-size override is honoured.
		let t = 0
		for (let i = 0; i < panes.length - 1; i++) {
			const g = internals.get(panes[i])!.getGutterEl()
			if (g) t += g[clientAxis]
		}
		return t
	}

	function totalAvailable(): number {
		if (!rootEl) return 0
		const N = panes.length
		// Flex `gap` lands between every adjacent child. Panes + gutters
		// alternate, so 2(N-1) boundaries.
		const gapCount = 2 * (N - 1)
		return rootEl[clientAxis] - paddingPx() - gutterTotal() - (gapCount * gapPx())
	}

	function resolveConstraints(): number {
		if (!rootEl) return 0
		const rootSize = rootEl[clientAxis]
		const total = totalAvailable()
		for (const h of panes) {
			const p = internals.get(h)!
			let mn = parseSize(p.rawMin, rootSize)
			let mx = parseSize(p.rawMax, rootSize)
			if (mn == null) mn = 0
			if (mx == null) mx = total
			if (mx > total) mx = total
			if (mn > mx) mn = mx
			p.min = mn
			p.max = mx
		}
		return total
	}

	// Clamp each pane to [min, max] and redistribute shortfall/excess to
	// unclamped panes proportionally. `pinned` excludes panes from the flex
	// pool (used to keep rail panes locked or constrain to absorber sets).
	function clampToConstraints(total: number, pinned: boolean[]) {
		const N = panes.length
		const arr = panes.map(h => internals.get(h)!)
		for (let pass = 0; pass < N + 1; pass++) {
			let sum = 0
			for (const p of arr) sum += p.size
			const diff = total - sum
			if (Math.abs(diff) < 0.5) break
			const flexable: number[] = []
			let flexableWeight = 0
			for (let j = 0; j < N; j++) {
				if (pinned[j]) continue
				const p = arr[j]
				const headroom = diff > 0 ? (p.max - p.size) : (p.size - p.min)
				if (headroom > 0.5) {
					flexable.push(j)
					flexableWeight += p.size > 0 ? p.size : 1
				}
			}
			if (flexable.length === 0) break
			for (const idx of flexable) {
				const p = arr[idx]
				const share = diff * ((p.size > 0 ? p.size : 1) / flexableWeight)
				let next = p.size + share
				if (next < p.min) next = p.min
				if (next > p.max) next = p.max
				p.size = next
			}
		}
	}

	// Programmatic-reflow window: panes shift under the resting cursor when
	// applySizes runs outside a drag — neutralise hover/selection flashes for
	// ~250 ms via the --reflowing class. Shared timer; later calls extend
	// the window rather than letting an earlier timer clear it too soon.
	let reflowTimer: ReturnType<typeof setTimeout> | null = null
	const REFLOW_MS = 250
	function markReflow() {
		if (!rootEl) return
		if (rootEl.classList.contains("fluent-multi-splitter--dragging")) return
		rootEl.classList.add("fluent-multi-splitter--reflowing")
		if (reflowTimer != null) clearTimeout(reflowTimer)
		reflowTimer = setTimeout(() => {
			rootEl?.classList.remove("fluent-multi-splitter--reflowing")
			reflowTimer = null
		}, REFLOW_MS)
	}

	function applySizes(opts: {persist?: boolean} = {}) {
		const N = panes.length
		for (let i = 0; i < N; i++) {
			const h = panes[i]
			const p = internals.get(h)!
			p.el.style.flexBasis = p.size + "px"
			// lastNonZero captures the last "expanded" size for restore. Only
			// trust values at or above the pane's min (so a drag-from-rail
			// that couldn't move the boundary doesn't overwrite the original
			// expanded width with the rail-floor value).
			if (p.size >= p.min && !h.state.isMin) {
				p.lastNonZero = p.size
			}
			// Fire onresize when size changed materially. Pre-applySizes the
			// caller already wrote p.size; we don't track previous-frame
			// size, so fire unconditionally and let consumers debounce.
			onresize?.({index: i, pane: p.el, size: p.size})
		}

		// Update each gutter's ARIA. Uses left-pane size for valuenow.
		for (let g = 0; g < N - 1; g++) {
			const p = internals.get(panes[g])!
			const gut = p.getGutterEl()
			if (!gut) continue
			gut.setAttribute("aria-valuenow", String(Math.round(p.size)))
			gut.setAttribute("aria-valuemin", String(Math.round(p.min)))
			gut.setAttribute("aria-valuemax", String(Math.round(p.max)))
		}

		if (opts.persist !== false) writeStorage()
		markReflow()
	}

	function nonMinCount(): number {
		let c = 0
		for (const h of panes) if (!h.state.isMin) c++
		return c
	}

	// Absorbers for a drag on gutter `g` (between panes g and g+1) with the
	// given primary index. Two modes:
	//   CLASSIC: immediate secondary is non-rail → only that one absorbs.
	//   TUNNEL: immediate secondary is rail → skip rails, collect the
	//     contiguous non-rail block beyond. Lets slack punch through a rail
	//     wall, which is the only way drag-from-rail can grow the primary
	//     when its immediate neighbour is also rail.
	function computeAbsorbers(g: number, primary: number): number[] {
		const N = panes.length
		const absorbers: number[] = []
		let sawRail = false
		if (primary === g) {
			// Secondary side = right of gutter; walk from g+1 forward.
			for (let i = g + 1; i < N; i++) {
				if (panes[i].state.isMin) {
					if (absorbers.length > 0) break
					sawRail = true
					continue
				}
				absorbers.push(i)
				if (!sawRail) break
			}
		} else {
			// Secondary side = left of gutter; walk from g backward.
			for (let j = g; j >= 0; j--) {
				if (panes[j].state.isMin) {
					if (absorbers.length > 0) break
					sawRail = true
					continue
				}
				absorbers.push(j)
				if (!sawRail) break
			}
		}
		return absorbers
	}

	function pinnedForAbsorbers(absorbers: number[]): boolean[] {
		const pinned = new Array(panes.length).fill(true) as boolean[]
		for (const i of absorbers) pinned[i] = false
		return pinned
	}

	// Pick the primary neighbour for gutter `g`: side closer to its
	// container edge. LTR/RTL tiebreaker on ties.
	function primaryNeighbour(g: number): number {
		const N = panes.length
		const leftDist = g
		const rightDist = N - 2 - g
		if (leftDist < rightDist) return g
		if (rightDist < leftDist) return g + 1
		return rootEl && getComputedStyle(rootEl).direction === "rtl" ? (g + 1) : g
	}

	// ---------- Drag state (per active drag) ----------
	let activePointerId: number | null = null
	let dragGutterIdx = -1
	let dragStartCoord = 0
	let dragStartPrimary = 0
	let primaryIdx = -1
	let primarySign = 1
	let primaryStartedMin = false
	let primaryInEscape = false
	let primaryCanSnap = false
	let primaryMaxReached = 0
	let everMoved = false
	const TAP_PX = 2
	let pendingMove: number | null = null
	let rafScheduled = false

	function snapThreshold(anchor: number): number {
		return Math.max(railSize * 1.5, railSize + (anchor - railSize) * minimizeThreshold)
	}

	function processMove() {
		rafScheduled = false
		if (pendingMove == null) return
		const coord = pendingMove
		pendingMove = null
		const primary = internals.get(panes[primaryIdx])!
		const primaryHandle = panes[primaryIdx]
		const delta = coord - dragStartCoord
		let newPrimary = dragStartPrimary + (primarySign * delta)

		// SNAP-INTO-RAIL: only after primary committed to expanded (snap gate).
		if (primary.canMin && primaryCanSnap) {
			if (newPrimary < snapThreshold(primaryMaxReached) && nonMinCount() > 1) {
				log("SNAP-INTO-RAIL primary=" + primaryIdx)
				const absorbers = computeAbsorbers(dragGutterIdx, primaryIdx)
				primaryHandle.state.isMin = true
				primary.size = railSize
				clampToConstraints(totalAvailable(), pinnedForAbsorbers(absorbers))
				applySizes({persist: false})
				oncollapse?.({index: primaryIdx, pane: primary.el})
				return
			}
		}

		// DRAG-OUT-OF-RAIL: snapped mid-drag, user dragged back past threshold.
		// Gated by !primaryStartedMin: if primary was railed BEFORE the drag began,
		// the user must dblclick (or click the rail body) to expand it — drag won't.
		if (!primaryStartedMin && primaryHandle.state.isMin && newPrimary >= snapThreshold(primaryMaxReached)) {
			log("DRAG-OUT-OF-RAIL primary=" + primaryIdx)
			primaryHandle.state.isMin = false
			primaryInEscape = true
			onexpand?.({index: primaryIdx, pane: primary.el})
		}

		// While still railed, this frame is a no-op — skip floor/max/rebalance
		// so the cursor in the snap zone doesn't re-clamp primary up to min.
		if (primaryHandle.state.isMin) return

		const floor = ((primaryStartedMin && !primaryCanSnap) || primaryInEscape) ? railSize : primary.min
		if (newPrimary < floor) newPrimary = floor
		if (newPrimary > primary.max) newPrimary = primary.max

		if (primaryInEscape && newPrimary >= primary.min) primaryInEscape = false
		if (!primaryCanSnap && newPrimary >= primary.min) primaryCanSnap = true
		if (newPrimary > primaryMaxReached) primaryMaxReached = newPrimary

		primary.size = newPrimary
		const total = totalAvailable()
		const absorbers = computeAbsorbers(dragGutterIdx, primaryIdx)
		clampToConstraints(total, pinnedForAbsorbers(absorbers))

		// Post-check: if absorbers couldn't absorb fully, pull primary back
		// by the overshoot so the layout fits.
		let sum = 0
		for (const h of panes) sum += internals.get(h)!.size
		if (Math.abs(sum - total) > 0.5) {
			primary.size -= (sum - total)
			if (primary.size < floor) primary.size = floor
			if (primary.size > primary.max) primary.size = primary.max
		}
		applySizes({persist: false})
	}

	function onWindowPointerMove(e: PointerEvent) {
		if (e.pointerId !== activePointerId) return
		const delta = e[clientCoord] - dragStartCoord
		if (!everMoved && Math.abs(delta) >= TAP_PX) {
			everMoved = true
		}
		// Asymmetric drag against an already-railed primary:
		//   inward  (would shrink primary) → no-op, pane stays railed.
		//   outward (would grow  primary) → release rail, drag grows the pane.
		// `primarySign * delta > 0` is the outward direction (matches the
		// formula in processMove: newPrimary = dragStartPrimary + primarySign*delta).
		if (primaryStartedMin && panes[primaryIdx]?.state.isMin) {
			if (primarySign * delta <= 0) return
			if (Math.abs(delta) < TAP_PX) return
			const handle = panes[primaryIdx]
			handle.state.isMin = false
			const primary = internals.get(handle)!
			onexpand?.({index: primaryIdx, pane: primary.el})
		}
		pendingMove = e[clientCoord]
		if (rafScheduled) return
		rafScheduled = true
		requestAnimationFrame(processMove)
	}

	function onWindowPointerUp(e: PointerEvent) {
		if (e.pointerId !== activePointerId) return
		// Flush pending rAF so a last-millisecond move doesn't fire after we
		// make end-of-drag decisions.
		if (rafScheduled && pendingMove != null) processMove()
		rafScheduled = false
		pendingMove = null

		const primary = internals.get(panes[primaryIdx])
		const primaryHandle = panes[primaryIdx]
		const gut = internals.get(panes[dragGutterIdx])?.getGutterEl()
		try { gut?.releasePointerCapture(e.pointerId) } catch { /* */ }
		activePointerId = null
		rootEl?.classList.remove("fluent-multi-splitter--dragging")
		gut?.classList.remove("fluent-multi-splitter-gutter--active")
		window.removeEventListener("pointermove", onWindowPointerMove)
		window.removeEventListener("pointerup", onWindowPointerUp)
		window.removeEventListener("pointercancel", onWindowPointerUp)

		// (Tap-restore on the gutter is intentionally NOT implemented — a press
		// without drag does nothing on the gutter itself. To expand a railed
		// pane: dblclick the gutter, drag past the jitter threshold, or click
		// the rail pane body (handlePaneClick in MultiSplitterPane).
		// pa-splitter's TAP-RESTORE was here but the UX was surprising —
		// users expected drag-to-be-explicit.)

		// RAIL-STAYED: started rail, never grew above rail → restore isMin.
		let anyChange = false
		if (primary && primaryHandle && primaryStartedMin && Math.abs(primary.size - railSize) < 1 && !primaryHandle.state.isMin) {
			log("RAIL-STAYED primary=" + primaryIdx)
			primaryHandle.state.isMin = true
			anyChange = true
		}

		// CLAMP-TO-MIN: any non-rail pane below its min gets bumped; remainder
		// redistributed across all non-rail panes.
		let anyBelowMin = false
		for (const h of panes) {
			const p = internals.get(h)!
			if (!h.state.isMin && p.size < p.min - 0.5) { anyBelowMin = true; break }
		}
		if (anyBelowMin) {
			log("CLAMP-TO-MIN")
			for (const h of panes) {
				const p = internals.get(h)!
				if (!h.state.isMin && p.size < p.min) p.size = p.min
			}
			const pinned = panes.map(h => h.state.isMin)
			clampToConstraints(totalAvailable(), pinned)
			applySizes({persist: false})
		} else if (anyChange) {
			applySizes({persist: false})
		}
		cleanupDrag()
		writeStorage()
	}

	function cleanupDrag() {
		primaryStartedMin = false
		primaryInEscape = false
		primaryCanSnap = false
		primaryMaxReached = 0
		primaryIdx = -1
		dragGutterIdx = -1
	}

	function handleGutterPointerDown(e: PointerEvent, handle: PaneHandle) {
		if (e.button != null && e.button !== 0) return
		const g = panes.indexOf(handle)
		if (g < 0 || g >= panes.length - 1) return

		// Defensive sweep: clear --active from every gutter before claiming this one.
		for (const h of panes) {
			const gel = internals.get(h)!.getGutterEl()
			gel?.classList.remove("fluent-multi-splitter-gutter--active")
		}

		dragGutterIdx = g
		primaryIdx = primaryNeighbour(g)
		primarySign = (primaryIdx === g) ? 1 : -1
		const primary = internals.get(panes[primaryIdx])!
		const primaryHandle = panes[primaryIdx]
		primaryStartedMin = primaryHandle.state.isMin
		// If primary started railed, onWindowPointerMove only releases `isMin`
		// when the drag goes outward (would grow the pane). Inward drag is
		// fully inert — the rail stays put and the gutter doesn't move.
		// Dblclick / rail body click still work as alternative expand gestures.
		primaryInEscape = false
		primaryCanSnap = !primaryStartedMin
		everMoved = false
		activePointerId = e.pointerId
		dragStartCoord = e[clientCoord]
		dragStartPrimary = primary.size
		primaryMaxReached = dragStartPrimary

		log("pointerdown gutter=" + g + " primary=" + primaryIdx + " sign=" + primarySign)

		const gut = internals.get(handle)!.getGutterEl()
		try { gut?.setPointerCapture(e.pointerId) } catch { /* iOS */ }
		rootEl?.classList.add("fluent-multi-splitter--dragging")
		gut?.classList.add("fluent-multi-splitter-gutter--active")
		// Listen on window — pointermove can leave the gutter element during
		// fast drags, especially when crossing iframe boundaries.
		window.addEventListener("pointermove", onWindowPointerMove)
		window.addEventListener("pointerup", onWindowPointerUp)
		window.addEventListener("pointercancel", onWindowPointerUp)
		e.preventDefault()
	}

	function handleGutterKeydown(e: KeyboardEvent, handle: PaneHandle) {
		const g = panes.indexOf(handle)
		if (g < 0 || g >= panes.length - 1) return
		switch (e.key) {
			case "ArrowLeft":
			case "ArrowUp":
				shiftPrimary(g, -step); e.preventDefault(); break
			case "ArrowRight":
			case "ArrowDown":
				shiftPrimary(g, step); e.preventDefault(); break
			case "Home": {
				const p = primaryNeighbour(g)
				setPrimaryTo(g, internals.get(panes[p])!.min); e.preventDefault(); break
			}
			case "End": {
				const p = primaryNeighbour(g)
				setPrimaryTo(g, internals.get(panes[p])!.max); e.preventDefault(); break
			}
			case "Enter":
			case " ": {
				const p = primaryNeighbour(g)
				const other = p === g ? g + 1 : g
				if (internals.get(panes[p])!.canMin) togglePane(p)
				else if (internals.get(panes[other])!.canMin) togglePane(other)
				e.preventDefault(); break
			}
		}
	}

	function handleGutterDblClick(e: MouseEvent, handle: PaneHandle) {
		const g = panes.indexOf(handle)
		if (g < 0 || g >= panes.length - 1) return
		e.preventDefault()
		const p = primaryNeighbour(g)
		const other = p === g ? g + 1 : g
		if (internals.get(panes[p])!.canMin) togglePane(p)
		else if (internals.get(panes[other])!.canMin) togglePane(other)
	}

	function handlePaneClick(_e: MouseEvent, handle: PaneHandle) {
		// Click on a railed pane → restore. Click on an expanded pane is a no-op
		// here (consumers can listen to onclick on their own content normally).
		const i = panes.indexOf(handle)
		if (i < 0) return
		if (handle.state.isMin) {
			log("rail click i=" + i)
			restorePane(i)
		}
	}

	function shiftPrimary(g: number, gutterDelta: number) {
		const primary = primaryNeighbour(g)
		const primaryHandle = panes[primary]
		if (primaryHandle.state.isMin) return
		const sign = (primary === g) ? 1 : -1
		setPrimaryTo(g, internals.get(primaryHandle)!.size + sign * gutterDelta)
	}

	function setPrimaryTo(g: number, newSize: number) {
		const primary = primaryNeighbour(g)
		const primaryHandle = panes[primary]
		if (primaryHandle.state.isMin) return
		const p = internals.get(primaryHandle)!
		let target = newSize
		if (target < p.min) target = p.min
		if (target > p.max) target = p.max
		p.size = target
		const total = totalAvailable()
		const absorbers = computeAbsorbers(g, primary)
		clampToConstraints(total, pinnedForAbsorbers(absorbers))
		let sum = 0
		for (const h of panes) sum += internals.get(h)!.size
		if (Math.abs(sum - total) > 0.5) {
			p.size -= (sum - total)
			if (p.size < p.min) p.size = p.min
			if (p.size > p.max) p.size = p.max
		}
		applySizes()
	}

	function minimizePane(i: number) {
		const handle = panes[i]
		const p = internals.get(handle)!
		if (!p.canMin || handle.state.isMin) return
		if (nonMinCount() <= 1) return
		log("minimizePane i=" + i)
		handle.state.isMin = true
		p.size = railSize
		const pinned = panes.map(h => h.state.isMin)
		clampToConstraints(totalAvailable(), pinned)
		applySizes()
		oncollapse?.({index: i, pane: p.el})
	}

	function restorePane(i: number) {
		const handle = panes[i]
		const p = internals.get(handle)!
		if (!handle.state.isMin) return
		// ACCORDION SWEEP: in accordion mode, restoring one auto-rails the
		// other minimizable panes so exactly one stays open.
		if (accordionActive) {
			for (let j = 0; j < panes.length; j++) {
				if (j !== i) {
					const hj = panes[j]
					const pj = internals.get(hj)!
					if (pj.canMin && !hj.state.isMin) {
						hj.state.isMin = true
						pj.size = railSize
						oncollapse?.({index: j, pane: pj.el})
					}
				}
			}
		}
		handle.state.isMin = false
		// Target: remembered size, never below min. Compute floor first so
		// the deficit math reflects the actual restore amount.
		let target = p.lastNonZero > 0 ? p.lastNonZero : Math.max(p.min, railSize * 4)
		if (target < p.min) target = p.min
		const total = totalAvailable()
		let currentSum = 0
		let fromOthers = 0
		for (let j = 0; j < panes.length; j++) {
			const pj = internals.get(panes[j])!
			currentSum += pj.size
			if (j !== i && !panes[j].state.isMin) fromOthers += pj.size - pj.min
		}
		const emptySpace = Math.max(0, total - currentSum)
		const available = fromOthers + emptySpace
		const deficit = target - p.size
		if (deficit > available) target = p.size + available
		log("restorePane i=" + i, {target, available, deficit, lastNonZero: p.lastNonZero})
		p.size = target
		let newSum = 0
		for (const h of panes) newSum += internals.get(h)!.size
		if (newSum > total + 0.5) {
			const pinned = panes.map(h => h.state.isMin)
			pinned[i] = true
			clampToConstraints(total, pinned)
		} else if (accordionActive) {
			expandNonMinToFill()
		}
		applySizes()
		onexpand?.({index: i, pane: p.el})
	}

	function togglePane(i: number) {
		if (panes[i].state.isMin) restorePane(i)
		else minimizePane(i)
	}

	// ---- Accordion mode ----
	function requiredForAllExpanded(): number {
		let sum = 0
		for (const h of panes) sum += internals.get(h)!.min
		const gapCount = 2 * (panes.length - 1)
		return sum + gutterTotal() + (gapCount * gapPx()) + paddingPx()
	}

	function shouldBeAccordion(): boolean {
		if (!rootEl) return false
		let minimizable = 0
		for (const h of panes) if (internals.get(h)!.canMin) minimizable++
		if (minimizable < 2) return false
		return rootEl[clientAxis] < requiredForAllExpanded()
	}

	function enterAccordion() {
		if (accordionActive) return
		accordionActive = true
		rootEl?.classList.add("fluent-multi-splitter--accordion")
		// Keep priority: non-minimizable > first currently-expanded minimizable > pane 0.
		let keepIdx = -1
		for (let i = 0; i < panes.length; i++) {
			if (!internals.get(panes[i])!.canMin) { keepIdx = i; break }
		}
		if (keepIdx === -1) {
			for (let i = 0; i < panes.length; i++) {
				if (internals.get(panes[i])!.canMin && !panes[i].state.isMin) { keepIdx = i; break }
			}
		}
		if (keepIdx === -1) keepIdx = 0
		log("enterAccordion keepIdx=" + keepIdx)
		for (let k = 0; k < panes.length; k++) {
			if (k !== keepIdx) {
				const h = panes[k]
				const p = internals.get(h)!
				if (p.canMin && !h.state.isMin) {
					h.state.isMin = true
					p.size = railSize
				}
			}
		}
		expandNonMinToFill()
		applySizes()
	}

	function exitAccordion() {
		if (!accordionActive) return
		accordionActive = false
		rootEl?.classList.remove("fluent-multi-splitter--accordion")
		log("exitAccordion")
	}

	// In accordion mode the expanded pane(s) ignore `max` and consume all
	// remaining space — mins are still respected.
	function expandNonMinToFill() {
		const total = totalAvailable()
		let sum = 0
		const flexable: number[] = []
		let flexableWeight = 0
		for (let i = 0; i < panes.length; i++) {
			const p = internals.get(panes[i])!
			sum += p.size
			if (!panes[i].state.isMin) {
				flexable.push(i)
				flexableWeight += p.size > 0 ? p.size : 1
			}
		}
		const diff = total - sum
		if (flexable.length === 0 || Math.abs(diff) < 0.5) return
		for (const idx of flexable) {
			const p = internals.get(panes[idx])!
			const weight = (p.size > 0 ? p.size : 1) / flexableWeight
			let next = p.size + diff * weight
			if (next < p.min) next = p.min
			p.size = next
		}
	}

	// ---------- Context ----------
	const ctx: MultiSplitterContext = {
		get orientation() { return orientation },
		registerPane(opts: PaneRegistration): PaneHandle {
			const handle = new PaneHandleImpl(nextHandleId++)
			internals.set(handle, {
				el: opts.el,
				getGutterEl: opts.getGutterEl,
				canMin: opts.canMin,
				rawSize: opts.size,
				rawMin: opts.min,
				rawMax: opts.max,
				size: 0,
				min: 0,
				max: 0,
				lastNonZero: 0
			})
			panes = [...panes, handle]
			// Pane is flex-item; we drive size via flex-basis exclusively.
			opts.el.style.flex = "0 0 auto"
			scheduleInit()
			return handle
		},
		unregisterPane(handle: PaneHandle) {
			internals.delete(handle)
			panes = panes.filter(p => p !== handle)
		},
		indexOf(handle: PaneHandle): number {
			return panes.indexOf(handle)
		},
		isLast(handle: PaneHandle): boolean {
			return panes.length > 0 && panes[panes.length - 1] === handle
		},
		isMinimized(handle: PaneHandle): boolean {
			return handle.state.isMin
		},
		onGutterPointerDown: handleGutterPointerDown,
		onGutterKeydown: handleGutterKeydown,
		onGutterDblClick: handleGutterDblClick,
		onPaneClick: handlePaneClick
	}
	setContext<MultiSplitterContext>("multi-splitter", ctx)

	// ---------- Initial size resolution ----------
	// Panes register one-by-one in onMount; we want to apply initial sizing
	// AFTER all panes have registered (so totalAvailable is correct). Schedule
	// a microtask + rAF: the microtask coalesces multiple registrations,
	// rAF gives the browser a chance to lay out a 0-sized container (hidden
	// parent / modal not yet open) before we clamp.
	let initScheduled = false
	let initApplied = false
	function scheduleInit() {
		if (initScheduled) return
		initScheduled = true
		queueMicrotask(() => {
			requestAnimationFrame(() => {
				initScheduled = false
				if (panes.length < 2 || !rootEl) return
				// Install observer + toggle delegation immediately, even if
				// the container hasn't been laid out yet (mounted inside a
				// hidden tab panel etc). When the container transitions
				// 0 → non-zero, the observer's `!initApplied` branch runs
				// applyInitialSizes for the first time. Otherwise sizes
				// get clamped to 0 at mount and the panes render smashed
				// on first reveal.
				setupResizeObserver()
				setupToggleDelegation()
				applyInitialSizes()
			})
		})
	}

	function applyInitialSizes() {
		if (!rootEl || initApplied) return
		const initialTotal = resolveConstraints()
		// Defer until the container is actually laid out. Mounting inside a
		// hidden tab panel returns total=0 here; the ResizeObserver retries
		// this when the container reveals.
		if (initialTotal <= 0) return
		const N = panes.length
		const rootSizeRef = rootEl[clientAxis]
		const saved = readStorage()

		const explicitSum = {value: 0}
		const unspecified: number[] = []
		for (let p = 0; p < N; p++) {
			const internal = internals.get(panes[p])!
			const v = parseSize(internal.rawSize, rootSizeRef)
			if (v == null) {
				internal.size = 0
				unspecified.push(p)
			} else {
				internal.size = v
				explicitSum.value += v
			}
		}
		const leftover = initialTotal - explicitSum.value
		if (unspecified.length > 0) {
			const share = leftover / unspecified.length
			for (const u of unspecified) internals.get(panes[u])!.size = Math.max(0, share)
		} else if (Math.abs(leftover) > 0.5) {
			// All sized but don't sum — give delta to the last pane.
			internals.get(panes[N - 1])!.size += leftover
		}
		for (const h of panes) {
			const p = internals.get(h)!
			p.lastNonZero = p.size
		}

		// Overlay saved state (forgiving: matching-index entries are trusted,
		// extras ignored, missing slots fall through to attribute defaults).
		const startupMinimized: boolean[] = new Array(N).fill(false)
		if (saved?.sizes) {
			for (let s = 0; s < Math.min(N, saved.sizes.length); s++) {
				if (typeof saved.sizes[s] === "number") internals.get(panes[s])!.size = saved.sizes[s]
				if (saved.lasts && typeof saved.lasts[s] === "number" && saved.lasts[s] > internals.get(panes[s])!.min) {
					internals.get(panes[s])!.lastNonZero = saved.lasts[s]
				}
				if (saved.minimized?.[s]) startupMinimized[s] = !!internals.get(panes[s])!.canMin
			}
		}

		// "At least one expanded pane" invariant.
		let allMin = true
		for (let sm = 0; sm < N; sm++) if (!startupMinimized[sm]) { allMin = false; break }
		if (allMin) startupMinimized[0] = false

		for (let m = 0; m < N; m++) {
			if (startupMinimized[m]) {
				panes[m].state.isMin = true
				internals.get(panes[m])!.size = railSize
			}
		}
		const pinned = panes.map(h => h.state.isMin)
		clampToConstraints(initialTotal, pinned)
		applySizes({persist: false})
		if (shouldBeAccordion()) enterAccordion()
		initApplied = true
	}

	// ---------- Toggle delegation ----------
	let toggleListenerInstalled = false
	function setupToggleDelegation() {
		if (toggleListenerInstalled || !rootEl) return
		toggleListenerInstalled = true
		rootEl.addEventListener("click", (e) => {
			const target = e.target as HTMLElement | null
			if (!target) return
			const toggle = target.closest("[data-multisplitter-toggle]")
			if (!toggle) return
			// Only the nearest splitter ancestor handles its own toggles.
			if (toggle.closest(".fluent-multi-splitter") !== rootEl) return
			// Find which pane owns this toggle.
			let paneEl: HTMLElement | null = null
			for (const h of panes) {
				if (internals.get(h)!.el.contains(toggle)) { paneEl = internals.get(h)!.el; break }
			}
			if (!paneEl) return
			const idx = panes.findIndex(h => internals.get(h)!.el === paneEl)
			if (idx < 0 || !internals.get(panes[idx])!.canMin) return
			e.preventDefault()
			e.stopPropagation()
			togglePane(idx)
		})
	}

	// ---------- ResizeObserver ----------
	let resizeObserver: ResizeObserver | null = null
	function setupResizeObserver() {
		if (resizeObserver || !rootEl || typeof ResizeObserver === "undefined") return
		let lastTotal = totalAvailable()
		resizeObserver = new ResizeObserver(() => {
			if (!rootEl) return
			const total = resolveConstraints()
			if (Math.abs(total - lastTotal) < 0.5) return
			// Container hidden (display:none, tab switched away, parent
			// detached). Record the new total but leave pane sizes alone —
			// running clampToConstraints/scale against total=0 would zero
			// every flex-basis and the user would lose their layout on the
			// next reveal.
			if (total <= 0) { lastTotal = total; return }
			// Deferred init: container was hidden at mount time, now we
			// finally have a real box to size against.
			if (!initApplied) {
				applyInitialSizes()
				lastTotal = total
				return
			}
			// Reveal after hide (lastTotal was 0). Fall through to the
			// scale path so pane sizes get rescaled if the container width
			// changed while hidden.
			const wantAccordion = shouldBeAccordion()
			if (wantAccordion && !accordionActive) {
				enterAccordion()
				lastTotal = total
				return
			}
			if (!wantAccordion && accordionActive) exitAccordion()
			// Scale non-min pool; min panes hold at railSize.
			let oldNonMinSum = 0
			let railBudget = 0
			for (const h of panes) {
				const p = internals.get(h)!
				if (h.state.isMin) railBudget += p.size
				else oldNonMinSum += p.size
			}
			const newNonMinTotal = total - railBudget
			if (oldNonMinSum > 0 && newNonMinTotal > 0) {
				const scale = newNonMinTotal / oldNonMinSum
				for (const h of panes) {
					if (!h.state.isMin) internals.get(h)!.size *= scale
				}
			}
			if (accordionActive) expandNonMinToFill()
			else clampToConstraints(total, panes.map(h => h.state.isMin))
			applySizes({persist: false})
			lastTotal = total
		})
		resizeObserver.observe(rootEl)
	}

	onMount(() => {
		return () => {
			resizeObserver?.disconnect()
			if (reflowTimer != null) clearTimeout(reflowTimer)
		}
	})

	const computedStyle = $derived.by(() => {
		const parts: string[] = []
		if (width) parts.push(`width: ${width}`)
		if (height) parts.push(`height: ${height}`)
		if (style) parts.push(style)
		return parts.join("; ")
	})
</script>

<div
	bind:this={rootEl}
	class="fluent-multi-splitter fluent-multi-splitter--{orientation} {className}"
	style={computedStyle}
>
	{@render children?.()}
</div>

<style>
	/* ===== Root container =====
	 * Width fills the parent. Height is intentionally NOT 100% — the splitter
	 * sizes to its tallest pane (via default flex `align-items: stretch`),
	 * which means all panes end up equal height = tallest natural content
	 * height. Consumers who want a fixed-area splitter (IDE-style) can pass
	 * the `height` prop or wrap in a sized container.
	 *
	 * pa-splitter's original default was `height: 100%`, which forces every
	 * consumer to give the splitter a sized parent. Content-driven is the
	 * less surprising default for ad-hoc usage; fill-parent is one prop away. */
	.fluent-multi-splitter {
		display: flex;
		width: 100%;
		min-width: 0;
		min-height: 0;
		overflow: hidden;
		box-sizing: border-box;
	}

	.fluent-multi-splitter--horizontal {
		flex-direction: row;
	}

	.fluent-multi-splitter--vertical {
		flex-direction: column;
	}

	/* While dragging: kill text selection and pointer events on pane content
	 * (so dragging over an iframe / canvas doesn't get hijacked). Sibling
	 * gutters also stop hover-firing as cursor passes over them during drag. */
	.fluent-multi-splitter--dragging {
		user-select: none;
	}
	.fluent-multi-splitter--dragging :global(.fluent-multi-splitter-pane) {
		pointer-events: none;
	}
	.fluent-multi-splitter--dragging :global(.fluent-multi-splitter-gutter:not(.fluent-multi-splitter-gutter--active)) {
		pointer-events: none;
	}
	.fluent-multi-splitter--dragging :global(.fluent-multi-splitter-gutter:not(.fluent-multi-splitter-gutter--active):focus-visible) {
		box-shadow: none;
	}

	/* Programmatic reflow window — added for ~250 ms after applySizes runs
	 * outside a drag. Suppresses the gutter-hover flash that fires when a
	 * gutter slides under the resting cursor during reflow. */
	.fluent-multi-splitter--reflowing {
		user-select: none;
	}
	.fluent-multi-splitter--reflowing :global(.fluent-multi-splitter-gutter) {
		transition: none;
	}
	.fluent-multi-splitter--reflowing :global(.fluent-multi-splitter-gutter:hover),
	.fluent-multi-splitter--reflowing :global(.fluent-multi-splitter-gutter:focus-visible) {
		background-color: transparent;
		box-shadow: none;
	}

	/* ===== Pane ===== */
	/* Make the pane a flex column so direct `.card` children can flex-grow
	 * to fill the pane height. Without this, the card sits at its natural
	 * content height and leaves whitespace below in vertical splitters
	 * (where the pane's height is driven by flex-basis from drag) and in
	 * horizontal splitters with mixed-height content (where the pane is
	 * stretched to match the tallest sibling).
	 *
	 * Note: `flex: 1 1 auto` (not `1 1 0`) keeps the card's natural content
	 * height as the basis, so the splitter's content-driven sizing still
	 * resolves correctly when no height prop is set. */
	:global(.fluent-multi-splitter-pane) {
		display: flex;
		flex-direction: column;
		overflow: auto;
		min-width: 0;
		min-height: 0;
		box-sizing: border-box;
	}

	:global(.fluent-multi-splitter-pane:not(.fluent-multi-splitter-pane--minimized) > .card) {
		flex: 1 1 auto;
		min-height: 0;
	}

	:global(.fluent-multi-splitter-pane--minimized) {
		cursor: pointer;
		overflow: hidden;
	}

	/* Rail-title rotation hook: any element marked [data-multisplitter-rail-title]
	 * inside a minimized pane rotates to vertical writing. */
	:global(.fluent-multi-splitter-pane--minimized [data-multisplitter-rail-title]) {
		writing-mode: sideways-rl;
	}
	:global(.fluent-multi-splitter-pane--minimized [data-multisplitter-rail-title] i),
	:global(.fluent-multi-splitter-pane--minimized [data-multisplitter-rail-title] svg) {
		writing-mode: initial;
	}

	/* Auto-adaptation for Card: when a `.card` (the svelte-fluentui Card
	 * component) is rendered inside a minimized pane, fill the rail and
	 * treat its first child as the rail title — hide the rest. Mirrors
	 * pa-splitter's `_cards.scss` integration so consumers using <Card>
	 * don't need data-multisplitter-rail-title on their headings.
	 *
	 * Pane carries its own orientation class (--horizontal / --vertical)
	 * set from its parent splitter's orientation via context, so nested
	 * splitters with different orientations don't cross-contaminate styles
	 * (an earlier version walked up to ANY orientation ancestor, which
	 * picked up the outer splitter for nested-inner panes).
	 *
	 * Specificity: three classes on the rail pane + `.card` = (0,4,0),
	 * beats Card.svelte's own `.card { padding }` rule (0,2,0). */

	/* Common: hide everything in the rail card except the first child. */
	:global(.fluent-multi-splitter-pane.fluent-multi-splitter-pane--minimized .card > *) {
		display: none;
	}
	:global(.fluent-multi-splitter-pane.fluent-multi-splitter-pane--minimized .card > :first-child) {
		display: block;
		white-space: nowrap;
		margin: 0;
	}

	/* Horizontal-splitter rail (narrow + tall) — title rotated vertically.
	 * Long-axis padding matches Card.svelte's default (`design-unit * 5px`,
	 * = 20px) so the title's distance from the top edge stays consistent
	 * between expanded and railed states — toggling minimize doesn't shift
	 * the icon. Short axis stays narrow to fit the 40px rail. */
	:global(.fluent-multi-splitter-pane--horizontal.fluent-multi-splitter-pane--minimized .card) {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: calc(var(--design-unit, 4) * 5px) calc(var(--design-unit, 4) * 1px);
		margin: 0;
		overflow: hidden;
	}
	:global(.fluent-multi-splitter-pane--horizontal.fluent-multi-splitter-pane--minimized .card > :first-child) {
		writing-mode: sideways-rl;
	}
	:global(.fluent-multi-splitter-pane--horizontal.fluent-multi-splitter-pane--minimized .card > :first-child i),
	:global(.fluent-multi-splitter-pane--horizontal.fluent-multi-splitter-pane--minimized .card > :first-child svg) {
		writing-mode: initial;
	}

	/* Vertical-splitter rail (wide + short) — title stays horizontal.
	 * Long-axis padding matches Card.svelte's default so the title's distance
	 * from the left edge is consistent across expanded/railed states. */
	:global(.fluent-multi-splitter-pane--vertical.fluent-multi-splitter-pane--minimized .card) {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: calc(var(--design-unit, 4) * 1px) calc(var(--design-unit, 4) * 5px);
		margin: 0;
		overflow: hidden;
	}

	/* ===== Gutter ===== */
	:global(.fluent-multi-splitter-gutter) {
		position: relative;
		flex: 0 0 auto;
		background-color: var(--neutral-stroke-divider-rest, #e0e0e0);
		transition: background-color 0.1s ease, box-shadow 0.1s ease;
		touch-action: none;
		outline: none;
	}

	.fluent-multi-splitter--horizontal :global(> .fluent-multi-splitter-gutter) {
		cursor: col-resize;
		width: var(--fluent-multi-splitter-gutter-size, 6px);
		height: auto;
		align-self: stretch;
	}

	.fluent-multi-splitter--vertical :global(> .fluent-multi-splitter-gutter) {
		cursor: row-resize;
		width: auto;
		height: var(--fluent-multi-splitter-gutter-size, 6px);
		align-self: stretch;
	}

	/* Center grip indicator. */
	:global(.fluent-multi-splitter-gutter::before) {
		content: "";
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: var(--neutral-stroke-rest, #d1d1d1);
		border-radius: 2px;
		transition: background-color 0.1s ease;
	}

	.fluent-multi-splitter--horizontal :global(> .fluent-multi-splitter-gutter::before) {
		width: 2px;
		height: 24px;
	}
	.fluent-multi-splitter--vertical :global(> .fluent-multi-splitter-gutter::before) {
		width: 24px;
		height: 2px;
	}

	:global(.fluent-multi-splitter-gutter:hover) {
		background-color: var(--accent-fill-rest, #0078d4);
	}
	:global(.fluent-multi-splitter-gutter:hover::before) {
		background-color: var(--neutral-foreground-on-accent-rest, #ffffff);
	}
	:global(.fluent-multi-splitter-gutter:focus-visible) {
		box-shadow: inset 0 0 0 2px var(--accent-fill-rest, #0078d4);
	}
	:global(.fluent-multi-splitter-gutter--active) {
		background-color: var(--accent-fill-rest, #0078d4) !important;
	}
	:global(.fluent-multi-splitter-gutter--active::before) {
		background-color: var(--neutral-foreground-on-accent-rest, #ffffff);
	}
</style>
