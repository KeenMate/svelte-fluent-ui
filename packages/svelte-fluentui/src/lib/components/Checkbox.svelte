<script lang="ts">
	import {fluentCheckbox, provideFluentDesignSystem} from "@fluentui/web-components"

	if (!customElements.get('fluent-checkbox')) {
		provideFluentDesignSystem().register(fluentCheckbox())
	}

	type Props = {
		checked: boolean | null;
		withIntermediate?: boolean;
		autofocus?: boolean;
		children?: any;
		disabled?: boolean;
		readonly?: boolean;
		required?: boolean;
		onclick?: (ev: PointerEvent, previousValue: boolean | null) => void
	}

	let {
		    checked  = $bindable(),
		    withIntermediate  = undefined,
		    autofocus = undefined,
		    disabled = undefined,
		    readonly = undefined,
		    required = undefined,
		    children = undefined,
		onclick = undefined
	    }: Props = $props()

	let element: HTMLElement & {
		checkValidity: () => boolean
		reportValidity: () => boolean
		setCustomValidity: (message: string) => void
		setValidity: (flags: any, message: any, anchor: any) => void
	}

	// Expose validation methods
	export function checkValidity() {
		return element?.checkValidity()
	}

	export function reportValidity() {
		return element?.reportValidity()
	}

	export function setCustomValidity(message: string) {
		element?.setCustomValidity(message)
	}

	export function setValidity(flags: any, message: any, anchor: any) {
		element?.setValidity(flags, message, anchor)
	}

	function handleOnClick(ev: PointerEvent) {
		ev.preventDefault()
		ev.stopImmediatePropagation()

		if (readonly || disabled) {
			return
		}

		const previousValue = $state.snapshot(checked)

		if (withIntermediate) {
			// Three-state cycle: true -> null (indeterminate) -> false -> true
			if (previousValue === true) {
				checked = null
			} else if (previousValue === null) {
				checked = false
			} else {
				checked = true
			}
		} else {
			// Two-state toggle: true <-> false
			checked = (ev as any).target.checked
		}

		onclick?.(ev, previousValue)
	}
</script>

<fluent-checkbox
	bind:this={element}
	checked={checked === true}
	indeterminate={checked === null}
	{autofocus}
	{readonly}
	{disabled}
	{required}
	onclick={handleOnClick}
>
	{@render children?.()}
</fluent-checkbox>
