<script lang="ts">
	import {fluentAnchor, provideFluentDesignSystem
	}
	from
	"@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentAnchor()
	)

	interface IProps {

	}

	let {}: IProps = $props()
</script>

<fluent-anchor>
	<!-- todo: finish AnchorButton -->
</fluent-anchor>

