import type {OptionItem, SelectedValue} from "./index.js"

export type ValueType = string | string[] | null | undefined

export type SelectedOptionSvelteContext = {
	value: SelectedValue
	set(val: ValueType): void
	toggle(val: OptionItem["value"]): void
}

/** Option passed to a Combobox `filter` callback. Extends OptionItem with the
 * optional per-option `data` payload (from `<Option data={...}>`). */
export type ComboboxFilterOption = OptionItem & {
	data?: Record<string, unknown>
}

/** Custom client-side matcher for Combobox. Return true to keep the option
 * visible for the given query. Ignored when `onsearch` is provided (server-side). */
export type ComboboxFilter = (query: string, option: ComboboxFilterOption) => boolean
