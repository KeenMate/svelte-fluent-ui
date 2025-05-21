<script lang="ts">
	import {
		fluentAnchor, provideFluentDesignSystem
	}
		from
			"@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentAnchor()
	)

	type Props = {

	}

	let {}: Props = $props()
</script>

<fluent-anchor>
	<!-- todo: finish AnchorButton -->
</fluent-anchor>

