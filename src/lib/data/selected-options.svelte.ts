import type {OptionItem, SelectedValue} from "../types/index.js"
import type {ValueType} from "../types/combobox.js"

export function createSelectedOptions(initialValue: ValueType, isMulti?: boolean) {
	const toContextValue = (val: ValueType): SelectedValue => {
		if (val instanceof Array) {
			return val
		}
		if (isMulti) {
			return (val && typeof val === "string")
				? [val]
				: null
		} else {
			return (val && typeof val === "string")
				? [val]
				: null
		}
	}

	let ctx = $state({
			value: toContextValue(initialValue),
			toContextValue,
			set(val: ValueType) {
				this.value = toContextValue(val)
			},
			toggle(val: OptionItem["value"]) {
				if (!val) {
					return
				}

				let newValue = $state.snapshot(ctx.value)

				if (newValue) {
					if (isMulti) {
						if (!newValue.includes(val)) {
							newValue.push(val)
						} else {
							newValue = newValue.filter(x => x !== val)
						}
					} else {
						newValue = newValue[0] === val
							? []
							: [val]
					}
				} else {
					newValue = [val]
				}

				console.log("toggle", {result: newValue, val})
				ctx.value = newValue
			}
		}
	)

	return ctx
}
