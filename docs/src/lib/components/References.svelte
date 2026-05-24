<script lang="ts">
	import {Card} from "svelte-fluentui"

	export type ReferenceLink = {
		label: string
		href?: string
		na?: boolean | string
		custom?: boolean | string
	}

	type Props = {
		links: ReferenceLink[]
	}

	let {links}: Props = $props()

	function displayLabel(link: ReferenceLink): string {
		if (link.na) return `${link.label} (N/A)`
		if (link.custom) return `${link.label} (Custom)`
		return link.label
	}

	function tooltip(link: ReferenceLink): string {
		if (typeof link.na === "string") return link.na
		if (link.na) return "Not available in FluentUI Web Components"
		if (typeof link.custom === "string") return link.custom
		if (link.custom) return "Custom component"
		return ""
	}
</script>

<Card>
	<p>
		<strong>References:</strong>
		{#each links as link, i}
			{#if link.href}
				<a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
			{:else}
				<span class="reference-disabled" title={tooltip(link)}>{displayLabel(link)}</span>
			{/if}
			{#if i < links.length - 1}
				<span class="reference-separator" aria-hidden="true">|</span>
			{/if}
		{/each}
	</p>
</Card>

<style>
	.reference-disabled {
		color: var(--neutral-foreground-hint, #999);
		cursor: not-allowed;
	}

	.reference-separator {
		margin: 0 0.4em;
		color: var(--neutral-foreground-hint, #999);
	}
</style>
