<script lang="ts">
	import {fluentTreeView, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentTreeView()
	)

	type Props = {

	}

	let {}: Props = $props()
</script>

<fluent-tree-view>
	<!-- todo: finish Tree -->
</fluent-tree-view>

