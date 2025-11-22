import type {OptionItem, SelectedValue} from "./index.js"

export type ValueType = string | string[] | null | undefined

export type SelectedOptionSvelteContext = {
	value: SelectedValue
	set(val: ValueType): void
	toggle(val: OptionItem["value"]): void
}
