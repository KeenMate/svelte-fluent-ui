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

		checkValidity?: () => boolean;
		reportValidity?: () => boolean;
		setCustomValidity?: (message: string) => any;
		setValidity?: (flags: any, message: any, anchor: any) => void;
		onClick?: (ev: PointerEvent, previousValue: boolean | null) => void
	}

	let {
		    checked  = $bindable(),
		    withIntermediate  = undefined,
		    disabled = undefined,
		    readonly = undefined,
		    children = undefined,
		onClick = undefined
	    }: Props = $props()

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

		onClick?.(ev, previousValue)
	}
</script>

<fluent-checkbox
	checked={checked === true}
	indeterminate={checked === null}
	{readonly}
	{disabled}
	onclick={handleOnClick}
>
	{@render children?.()}
</fluent-checkbox>
