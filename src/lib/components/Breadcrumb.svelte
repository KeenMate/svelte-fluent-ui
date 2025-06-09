<script lang="ts">
	import type {SlotType} from "../types/index.js"
	import {fluentBreadcrumb, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentBreadcrumb()
	)
	
	type Props = {
		children?: SlotType
		[prop: string]: any
	}

	let {
		children = undefined,
		...restProps
	    }: Props = $props()
</script>

<fluent-breadcrumb {...restProps}>
	{@render children?.()}
</fluent-breadcrumb>
