<!--<script lang="ts" generics="TItem">-->
<!--	import {-->
<!--		fluentDataGrid,-->
<!--		fluentDataGridCell,-->
<!--		fluentDataGridRow,-->
<!--		provideFluentDesignSystem-->
<!--	} from "@fluentui/web-components"-->
<!--	import type {SlotType, SvelteFluentUISvelteContext} from "../types/index.js"-->
<!--	import {getContext} from "svelte"-->

<!--	provideFluentDesignSystem().register(-->
<!--		fluentDataGrid(),-->
<!--		fluentDataGridCell(),-->
<!--		fluentDataGridRow(),-->
<!--	)-->

<!--	type Props = {-->
<!--		noTabbing?: boolean-->
<!--		generateHeader?: boolean-->
<!--		rowsData?: any-->
<!--		columnDefinitions?: any-->
<!--		focusRowIndex?: number-->
<!--		focusColumnIndex?: number-->
<!--		items: TItem[] | null-->
<!--		children?: SlotType-->
<!--	}-->

<!--	let {-->
<!--		    items,-->
<!--		    noTabbing = undefined,-->
<!--		    generateHeader = undefined,-->
<!--		    rowsData = undefined,-->
<!--		    columnDefinitions = undefined,-->
<!--		    focusRowIndex = $bindable(undefined),-->
<!--		    focusColumnIndex = $bindable(undefined),-->
<!--		    children = undefined-->
<!--	    }: Props = $props()-->

<!--	const ctx = getContext<SvelteFluentUISvelteContext>("svelte-fluent-ui")-->

<!--	let element: (HTMLElement & { rowsData: TItem[] | null }) | undefined = $state(undefined)-->

<!--	$effect(() => {-->
<!--		if (!element) {-->
<!--			return-->
<!--		}-->

<!--		element.rowsData = items-->
<!--	})-->
<!--</script>-->

<!--<fluent-data-grid-->
<!--	bind:this={element}-->
<!--&gt;-->
<!--	{@render children?.()}-->
<!--</fluent-data-grid>-->

DATAGRID NOT PLANNED
