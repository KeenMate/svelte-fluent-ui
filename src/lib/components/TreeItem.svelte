<script lang="ts">
	import {fluentTreeItem, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentTreeItem()
	)

	type Props = {

	}

	let {}: Props = $props()
</script>

<fluent-tree-item>
	<!-- todo: finish TreeItem -->
</fluent-tree-item>

