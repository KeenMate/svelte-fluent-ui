<script lang="ts">
	import {fluentRadio, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentRadio()
	)

	interface IProps {

	}

	let {}: IProps = $props()
</script>

<fluent-radio>
	<!-- todo: finish Radio -->
</fluent-radio>

