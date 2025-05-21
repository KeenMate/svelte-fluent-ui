<script lang="ts">
	import {fluentCheckbox, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentCheckbox()
	)

	type Props = {
		autofocus: boolean;
		checked: boolean;
		children?: any;
		disabled?: boolean;
		required: boolean;
		value: string;

		checkValidity?: () => boolean;
		reportValidity?: () => boolean;
		setCustomValidity: (message: string) => any;
		setValidity?: (flags: any, message: any, anchor: any) => void;
	}

	let {
		    checked  = $bindable(),
		    disabled = undefined,
		    children = undefined
	    }: Props = $props()
</script>

<fluent-checkbox
	{checked}
	{disabled}
	oncheckedchanged={ev => checked = ev.checked}
>
	<!-- todo: finish Checkbox -->
	{@render children?.()}
</fluent-checkbox>
