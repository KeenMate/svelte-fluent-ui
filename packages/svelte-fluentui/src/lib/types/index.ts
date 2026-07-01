export type SlotType = any

export type OptionItem = {
	value: string
	label: string
	disabled?: boolean
	/** Optional group heading. Options sharing a `group` are rendered together
	 * under a non-interactive header (Combobox `options` array). */
	group?: string
}

export type SelectedValue = OptionItem["value"][] | undefined | null

export type FluentAccordionSvelteContext = {
	// in case of expand mode = "single" value will be an array of length 1 or null if nothing is expanded
	value: string[] | null | undefined
}
