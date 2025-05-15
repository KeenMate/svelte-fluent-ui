<script lang="ts">
	import "@fluentui/web-components/switch.js"

	interface IProps {
		checked: boolean
		children?: any
	}

	let {
		    checked  = $bindable(),
		    children = undefined
	    }: IProps = $props()
</script>

<fluent-switch>
	<!-- todo: finish Switch -->
</fluent-switch>

