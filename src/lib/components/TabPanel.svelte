<script lang="ts">
	import {fluentTabPanel, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentTabPanel()
	)

	interface IProps {

	}

	let {}: IProps = $props()
</script>

<fluent-tab-panel>
	<!-- todo: finish TabPanel -->
</fluent-tab-panel>

