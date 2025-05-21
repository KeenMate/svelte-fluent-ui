<script lang="ts">
	import {fluentBadge, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentBadge()
	)

	type Props = {

	}

	let {}: Props = $props()
</script>

<fluent-badge>
	<!-- todo: finish Badge -->
</fluent-badge>

