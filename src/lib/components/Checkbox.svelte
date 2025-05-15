<script lang="ts">
	import "@fluentui/web-components/checkbox.js"

	interface IProps {
		checked: boolean
		children?: any
	}

	let {
		    checked  = $bindable(),
		    children = undefined
	    }: IProps = $props()
</script>

<fluent-checkbox>
	<!-- todo: finish Checkbox -->
	{@render children?.()}
</fluent-checkbox>

