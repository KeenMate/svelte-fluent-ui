<script lang="ts">
	import {fluentTextArea, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentTextArea()
	)

	interface IProps {

	}

	let {}: IProps = $props()
</script>

<fluent-textarea>
	<!-- todo: finish Textarea -->
</fluent-textarea>

