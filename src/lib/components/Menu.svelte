<script lang="ts">
	import {fluentMenu, fluentMenuItem, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentMenu(),
		fluentMenuItem()
	)

	interface IProps {

	}

	let {}: IProps = $props()
</script>

<fluent-menu>
	<!-- todo: finish Menu -->
</fluent-menu>

