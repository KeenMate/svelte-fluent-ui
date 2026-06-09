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
	}

	let {
		href = undefined,
    separator = undefined,
		children = undefined
	    }: Props = $props()
</script>

<fluent-breadcrumb-item
	{...(href ? { href } : {})}
>
	{#if separator}
		<span slot="separator">
			{@render separator?.()}
		</span>
	{/if}

	{@render children?.()}
</fluent-breadcrumb-item>
