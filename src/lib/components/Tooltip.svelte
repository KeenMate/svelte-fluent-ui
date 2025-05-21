<script lang="ts">
	import {fluentTooltip, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentTooltip()
	)

	type Props = {

	}

	let {}: Props = $props()
</script>

<fluent-tooltip>
	<!-- todo: finish Tooltip -->
</fluent-tooltip>

