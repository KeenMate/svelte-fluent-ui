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
	setAttributeOnShadowInput(element, "autocomplete", autocomplete, selector)
}

/**
 * Sets (or removes, when value is `null`/`undefined`) an arbitrary attribute on the input/textarea
 * inside a FluentUI web component's open shadow root. Same retry-on-not-ready strategy as
 * `setAutocompleteOnShadowInput`.
 *
 * Use this when FluentUI 2.6 doesn't forward a native attribute to the inner input (e.g. `maxlength`,
 * `minlength`, `pattern`, `inputmode`, `step`). Most consumers won't need this directly — the wrapper
 * components expose props that call this internally.
 */
export function setAttributeOnShadowInput(
	element: HTMLElement | undefined,
	name: string,
	value: string | number | null | undefined,
	selector: string = "input"
): void {
	if (!element) return

	const trySetAttribute = () => {
		const input = element.shadowRoot?.querySelector(selector)
		if (input) {
			if (value == null) input.removeAttribute(name)
			else input.setAttribute(name, String(value))
		} else if (element.shadowRoot === null) {
			setTimeout(trySetAttribute, 10)
		}
	}

	trySetAttribute()
}
