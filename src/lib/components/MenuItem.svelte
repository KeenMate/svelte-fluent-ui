<script lang="ts">
	import {fluentMenuItem, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentMenuItem()
	)

	interface IProps {

	}

	let {}: IProps = $props()
</script>

<fluent-menu-item>
	<!-- todo: finish MenuItem -->
</fluent-menu-item>

