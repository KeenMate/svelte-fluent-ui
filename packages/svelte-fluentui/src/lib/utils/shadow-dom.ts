/**
 * Utility functions for interacting with Shadow DOM in FluentUI web components
 */

/**
 * Sets autocomplete attribute on input/textarea element inside a shadow root.
 *
 * This is needed because FluentUI web components v2.6.x don't support the autocomplete
 * attribute natively. Since FluentUI uses open shadow roots, we can access and modify
 * the internal input elements.
 *
 * @param element - The web component element with shadow root (e.g., fluent-text-field)
 * @param autocomplete - Autocomplete value (e.g., "off", "on", "email", "tel", "username")
 * @param selector - CSS selector for internal element (default: "input", use "textarea" for textarea)
 *
 * @example
 * ```typescript
 * import { setAutocompleteOnShadowInput } from './utils/shadow-dom'
 *
 * $effect(() => {
 *     if (autocomplete !== undefined) {
 *         setAutocompleteOnShadowInput(element, autocomplete);
 *     }
 * })
 * ```
 */
export function setAutocompleteOnShadowInput(
	element: HTMLElement | undefined,
	autocomplete: string,
	selector: string = "input"
): void {
	if (!element) return

	const trySetAttribute = () => {
		const input = element.shadowRoot?.querySelector(selector)
		if (input) {
			input.setAttribute("autocomplete", autocomplete)
		} else if (element.shadowRoot === null) {
			// Shadow root not ready yet, try again after a short delay
			setTimeout(trySetAttribute, 10)
		}
	}

	trySetAttribute()
}
