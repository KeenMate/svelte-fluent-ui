<script lang="ts">
	import {fluentTreeView, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentTreeView()
	)

	interface IProps {

	}

	let {}: IProps = $props()
</script>

<fluent-tree-view>
	<!-- todo: finish Tree -->
</fluent-tree-view>

