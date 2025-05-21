<script lang="ts">
	import {fluentSwitch, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentSwitch()
	)

	type Props = {
		checked: boolean
		children?: any
	}

	let {
		    checked  = $bindable(),
		    children = undefined
	    }: Props = $props()
</script>

<fluent-switch>
	<!-- todo: finish Switch -->
</fluent-switch>

