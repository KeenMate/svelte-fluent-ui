<script lang="ts">
	import {fluentBadge, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentBadge()
	)

	interface IProps {

	}

	let {}: IProps = $props()
</script>

<fluent-badge>
	<!-- todo: finish Badge -->
</fluent-badge>

