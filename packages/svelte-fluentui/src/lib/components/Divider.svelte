<script lang="ts">
	import {fluentDivider, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentDivider()
	)

	type Props = {

	}

	let {}: Props = $props()
</script>

<fluent-divider>
	<!-- todo: finish Divider -->
</fluent-divider>

