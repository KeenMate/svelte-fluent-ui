<script lang="ts">
	import {fluentTabPanel, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentTabPanel()
	)

	type Props = {

	}

	let {}: Props = $props()
</script>

<fluent-tab-panel>
	<!-- todo: finish TabPanel -->
</fluent-tab-panel>

