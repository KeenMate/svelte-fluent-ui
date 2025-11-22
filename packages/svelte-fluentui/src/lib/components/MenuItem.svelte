<script lang="ts">
	import {fluentMenuItem, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentMenuItem()
	)

	type Props = {

	}

	let {}: Props = $props()
</script>

<fluent-menu-item>
	<!-- todo: finish MenuItem -->
</fluent-menu-item>

