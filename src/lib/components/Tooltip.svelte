<script lang="ts">
	import {fluentTooltip, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentTooltip()
	)

	interface IProps {

	}

	let {}: IProps = $props()
</script>

<fluent-tooltip>
	<!-- todo: finish Tooltip -->
</fluent-tooltip>

