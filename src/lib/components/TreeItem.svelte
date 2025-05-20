<script lang="ts">
	import {fluentTreeItem, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentTreeItem()
	)

	interface IProps {

	}

	let {}: IProps = $props()
</script>

<fluent-tree-item>
	<!-- todo: finish TreeItem -->
</fluent-tree-item>

