<script lang="ts">
	import {fluentRadioGroup, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentRadioGroup()
	)

	type Props = {

	}

	let {}: Props = $props()
</script>

<fluent-radio-group>
	<!-- todo: finish RadioGroup -->
</fluent-radio-group>

