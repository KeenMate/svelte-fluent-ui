<script lang="ts">
	import {fluentDivider, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentDivider()
	)

	interface IProps {

	}

	let {}: IProps = $props()
</script>

<fluent-divider>
	<!-- todo: finish Divider -->
</fluent-divider>

