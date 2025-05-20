<script lang="ts">
	import {fluentDialog, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentDialog()
	)

	interface IProps {

	}

	let {}: IProps = $props()
</script>

<fluent-dialog>
	<!-- todo: finish Dialog -->
</fluent-dialog>

