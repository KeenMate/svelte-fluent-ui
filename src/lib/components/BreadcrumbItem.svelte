<script lang="ts">
	import type {SlotType} from "../types/index.js"
	import {fluentBreadcrumbItem, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentBreadcrumbItem()
	)

	type Props = {
		href?: string
		separator?: SlotType
		children?: SlotType
		[prop: string]: any
	}

	let {
		href = undefined,
    separator = undefined,
		children = undefined,
		...restProps
	    }: Props = $props()
</script>

<fluent-breadcrumb-item
	{...restProps}
	{href}
>
	{@render separator?.()}
	{@render children?.()}
</fluent-breadcrumb-item>
