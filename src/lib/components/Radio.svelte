<script lang="ts">
	import {fluentRadio, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentRadio()
	)

	type Props = {

	}

	let {}: Props = $props()
</script>

<fluent-radio>
	<!-- todo: finish Radio -->
</fluent-radio>

