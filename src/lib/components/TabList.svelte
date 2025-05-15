<script lang="ts">
	import "@fluentui/web-components/tablist.js"

	interface IProps {
		children?: any
	}

	let {
		    children = undefined
	    }: IProps = $props()
</script>

<fluent-tablist>
	<!-- todo: finish Tablist -->
	{@render children?.()}
</fluent-tablist>

