<script lang="ts">
	import {fluentRadioGroup, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentRadioGroup()
	)

	interface IProps {

	}

	let {}: IProps = $props()
</script>

<fluent-radio-group>
	<!-- todo: finish RadioGroup -->
</fluent-radio-group>

