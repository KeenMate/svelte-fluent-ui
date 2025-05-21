<script lang="ts">
	import {fluentMenu, fluentMenuItem, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentMenu(),
		fluentMenuItem()
	)

	type Props = {

	}

	let {}: Props = $props()
</script>

<fluent-menu>
	<!-- todo: finish Menu -->
</fluent-menu>

