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
	}

	let {
		class: className = "",
		style = "",
		id = undefined,
		active = true,
		defer = false,
		children = undefined
	}: Props = $props()
</script>

<fluent-tab-panel class={className} {style} {id} hidden={!active} >
	{#if children}
		{@render children?.()}
	{/if}
</fluent-tab-panel>
