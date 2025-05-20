<script lang="ts">
	import {fluentSwitch, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentSwitch()
	)

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

