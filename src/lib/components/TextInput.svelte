<script lang="ts">
	import "@fluentui/web-components/text-input.js"

	interface IProps {
		value: string
		placeholder?: string
		appearance: string
		autocomplete: string
		autofocus: string
		controlSize: string
		dirname: string
		disabled: string
		form: string
		list: string
		maxlength: string
		minlength: string
		multiple: string
		name: string
		pattern: string
		readOnly: string
		required: string
		type: string
	}

	let {
		    value = $bindable()
	    }: IProps = $props()
</script>

<fluent-text-input>
	<!-- todo: finish TextInput -->
</fluent-text-input>

