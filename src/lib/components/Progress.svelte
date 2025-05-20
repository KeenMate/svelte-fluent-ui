<script lang="ts">
	import {fluentProgress, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentProgress()
	)

	interface IProps {

	}

	let {}: IProps = $props()
</script>

<fluent-progress-bar>
	<!-- todo: finish ProgressBar -->
</fluent-progress-bar>

