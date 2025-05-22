<script lang="ts">
	import {fluentCheckbox, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentCheckbox()
	)

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

	let intermediate = $state(false)

	function handleOnClick(ev: PointerEvent) {
		ev.preventDefault()
		ev.stopImmediatePropagation()

		if (readonly || disabled) {
			return
		}

		const previousValue = $state.snapshot(checked)
		// intermediate state not working
		// const newChecked = (ev as any).target.checked
		// if (withIntermediate) {
		// 	if (previousValue && !intermediate) {
		// 		console.log("setting intermediate")
		// 		intermediate = true
		// 	} else {
		// 		console.log("regular update checked")
		// 		checked = newChecked
		// 		intermediate = false
		// 	}
		// } else {
		// 	checked = newChecked
		// }
		checked = (ev as any).target.checked

		onClick?.(ev, previousValue)
	}
</script>

<fluent-checkbox
	{checked}
	{readonly}
	{disabled}
	onclick={handleOnClick}
>
	{@render children?.()}
</fluent-checkbox>
