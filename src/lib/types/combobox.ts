import type {OptionItem, SelectedValue} from "./index.js"
import {type Readable, writable, type Writable} from "svelte/store"

export type ValueType = string | string[] | null | undefined

export type SelectedOptionSvelteContext = {
	value: SelectedValue
	set(val: ValueType): void
	toggle(val: OptionItem["value"]): void
}
