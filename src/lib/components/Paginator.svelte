<script lang="ts">
	import {fluentButton, provideFluentDesignSystem} from "@fluentui/web-components"
	import type {SlotType} from "../types/index.js"

	provideFluentDesignSystem().register(fluentButton())

	type Props = {
		class?: string
		style?: string
		disabled?: boolean
		totalItemCount?: number
		currentPageIndex?: number
		lastPageIndex?: number
		canGoBack?: boolean
		canGoForwards?: boolean
		onFirst?: () => void
		onPrevious?: () => void
		onNext?: () => void
		onLast?: () => void
		summaryTemplate?: SlotType
		paginationTextTemplate?: SlotType
	}

	let {
		class: className = "",
		style = "",
		disabled = false,
		totalItemCount = undefined,
		currentPageIndex = 0,
		lastPageIndex = 0,
		canGoBack = true,
		canGoForwards = true,
		onFirst = undefined,
		onPrevious = undefined,
		onNext = undefined,
		onLast = undefined,
		summaryTemplate = undefined,
		paginationTextTemplate = undefined
	}: Props = $props()
</script>

<div class="paginator {className}" {style} >
	{#if totalItemCount !== undefined}
		<div class="summary">
			{#if summaryTemplate}
				{@render summaryTemplate?.()}
			{:else}
				<strong>{totalItemCount}</strong> items
			{/if}
		</div>
	{/if}

	<nav role="navigation" class="paginator-nav">
		<fluent-button
			onclick={() => onFirst?.()}
			disabled={!canGoBack || disabled}
			title="Go to first page"
			aria-label="Go to first page"
		>
			<span>&laquo;</span>
		</fluent-button>

		<fluent-button
			onclick={() => onPrevious?.()}
			disabled={!canGoBack || disabled}
			title="Go to previous page"
			aria-label="Go to previous page"
		>
			<span>&lsaquo;</span>
		</fluent-button>

		<div class="pagination-text">
			{#if paginationTextTemplate}
				{@render paginationTextTemplate?.()}
			{:else}
				Page <strong>{currentPageIndex + 1}</strong> of <strong>{lastPageIndex + 1}</strong>
			{/if}
		</div>

		<fluent-button
			onclick={() => onNext?.()}
			disabled={!canGoForwards || disabled}
			title="Go to next page"
			aria-label="Go to next page"
		>
			<span>&rsaquo;</span>
		</fluent-button>

		<fluent-button
			onclick={() => onLast?.()}
			disabled={!canGoForwards || disabled}
			title="Go to last page"
			aria-label="Go to last page"
		>
			<span>&raquo;</span>
		</fluent-button>
	</nav>
</div>

<style>
	.paginator {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.summary {
		font-size: 0.9rem;
	}

	.paginator-nav {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.pagination-text {
		margin: 0 0.5rem;
	}
</style>
