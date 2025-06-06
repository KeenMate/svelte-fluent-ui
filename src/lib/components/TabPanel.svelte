<script lang="ts">
	import {fluentTabPanel, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"

	provideFluentDesignSystem().register(fluentTabPanel())

	type Props = {
		class?: string
		style?: string
		id?: string
		active?: boolean
		defer?: boolean
		children?: SlotType
		[prop: string]: any
	}

	let {
		class: className = "",
		style = "",
		id = undefined,
		active = true,
		defer = false,
		children = undefined,
		...restProps
	}: Props = $props()
</script>

<fluent-tab-panel class={className} {style} {id} hidden={!active} {...restProps}>
	{#if children}
		{@render children?.()}
	{/if}
</fluent-tab-panel>
