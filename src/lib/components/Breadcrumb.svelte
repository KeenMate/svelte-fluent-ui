<script lang="ts">
	import type {SlotType} from "../types/index.js"
	import {fluentBreadcrumb, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentBreadcrumb()
	)
	
	type Props = {
		children?: SlotType
	}

	let {
		children = undefined
	    }: Props = $props()
</script>

<fluent-breadcrumb >
	{@render children?.()}
</fluent-breadcrumb>
