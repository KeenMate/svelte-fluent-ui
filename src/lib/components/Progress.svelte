<script lang="ts">
	import {fluentProgress, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentProgress()
	)

	type Props = {

	}

	let {}: Props = $props()
</script>

<fluent-progress-bar>
	<!-- todo: finish ProgressBar -->
</fluent-progress-bar>

