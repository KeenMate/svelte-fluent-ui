<script lang="ts">
	import {fluentTab, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentTab()
	)

	interface IProps {

	}

	let {}: IProps = $props()
</script>

<fluent-tab>
	<!-- todo: finish Tab -->
</fluent-tab>

