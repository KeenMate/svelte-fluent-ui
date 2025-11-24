<script lang="ts">
	import {Stack, Card} from "svelte-fluentui"

	type Props = {
		title: string
		description?: string
		gap?: string
		references?: any
		children: any
	}

	let {title, description, gap = "2rem", references, children}: Props = $props()
</script>

<Stack orientation="vertical" {gap}>
	<div class="page-header">
		<h1>{title}</h1>
		{#if description}
			<p class="description">{description}</p>
		{/if}
	</div>

	{#if references}
		<Card class="reference-card">
			<h3>References</h3>
			{@render references()}
		</Card>
	{/if}

	{@render children()}
</Stack>

<style>
	.page-header h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin: 0 0 0.5rem 0;
	}

	.page-header .description {
		font-size: 1.125rem;
		line-height: 1.6;
		margin: 0;
		color: var(--neutral-foreground-hint, #605e5c);
	}

	:global(.reference-card) {
		background: var(--neutral-layer-2, #faf9f8);
		border: 1px solid var(--neutral-stroke-rest, #e0e0e0);
	}

	:global(.reference-card h3) {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 0.75rem 0;
	}

	:global(.reference-card p) {
		margin: 0.5rem 0;
		line-height: 1.6;
	}

	:global(.reference-card a) {
		color: var(--accent-fill-rest, #0078d4);
		text-decoration: none;
	}

	:global(.reference-card a:hover) {
		text-decoration: underline;
	}

	:global(.reference-card strong) {
		font-weight: 600;
		margin-right: 0.5rem;
	}
</style>
