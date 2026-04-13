/**
 * Move an element out of its current DOM position into another container
 * (defaults to `document.body`) for the lifetime of the action. Useful for
 * overlays — modals, popovers, tooltips — that must escape any ancestor
 * `transform` / `filter` / `position: fixed` stacking context to honor the
 * library's z-index scale.
 *
 * Usage:
 *   <div use:portal>...</div>           // appends to <body>
 *   <div use:portal={'#layer-root'}>    // appends to a specific selector / element
 */
export type PortalTarget = HTMLElement | string

export function portal(node: HTMLElement, target: PortalTarget = document.body) {
	function resolve(t: PortalTarget): HTMLElement | null {
		if (typeof t === "string") return document.querySelector(t)
		return t ?? null
	}

	function mount(t: PortalTarget) {
		const host = resolve(t)
		if (!host) {
			console.warn("portal: target not found", t)
			return
		}
		host.appendChild(node)
	}

	mount(target)

	return {
		update(newTarget: PortalTarget) {
			mount(newTarget)
		},
		destroy() {
			node.parentNode?.removeChild(node)
		}
	}
}
