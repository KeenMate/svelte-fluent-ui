<script lang="ts">
	import {fluentTextArea, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentTextArea()
	)

	type Props = {

	}

	let {}: Props = $props()
</script>

<fluent-textarea>
	<!-- todo: finish Textarea -->
</fluent-textarea>

