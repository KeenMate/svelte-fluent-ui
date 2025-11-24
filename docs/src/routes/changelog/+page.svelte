<script lang="ts">
	import {Stack} from 'svelte-fluentui';
	import {onMount} from 'svelte';

	let changelogHtml = '';

	onMount(async () => {
		try {
			// Fetch the changelog markdown file
			const response = await fetch('/CHANGELOG.md');
			const markdown = await response.text();

			// Simple markdown to HTML conversion
			changelogHtml = convertMarkdownToHtml(markdown);
		} catch (error) {
			console.error('Failed to load changelog:', error);
			changelogHtml = '<p>Failed to load changelog</p>';
		}
	});

	function convertMarkdownToHtml(markdown: string): string {
		let html = markdown;

		// Headers
		html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
		html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
		html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

		// Bold
		html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

		// Links
		html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

		// Code blocks
		html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

		// List items
		html = html.replace(/^- (.+)$/gm, '<li>$1</li>');

		// Wrap consecutive list items in ul
		html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => '<ul>' + match + '</ul>');

		// Paragraphs
		html = html.split('\n\n').map(para => {
			if (para.trim() && !para.match(/^<[hul]/)) {
				return '<p>' + para.replace(/\n/g, ' ') + '</p>';
			}
			return para;
		}).join('\n');

		return html;
	}
</script>

<svelte:head>
	<title>Changelog - Svelte FluentUI</title>
</svelte:head>

<Stack orientation="vertical" gap="2rem">
	<div>
		<h1 style="margin-top: 0;">Changelog</h1>
		<p>All notable changes to Svelte FluentUI are documented here.</p>
	</div>

	<div class="changelog-content">
		{@html changelogHtml}
	</div>
</Stack>

<style>
	.changelog-content :global(h1) {
		font-size: 2rem;
		margin: 2rem 0 1rem 0;
		color: var(--accent-fill-rest);
	}

	.changelog-content :global(h2) {
		font-size: 1.5rem;
		margin: 1.5rem 0 0.5rem 0;
		color: var(--accent-fill-rest);
		border-bottom: 2px solid var(--neutral-stroke-rest);
		padding-bottom: 0.5rem;
	}

	.changelog-content :global(h3) {
		font-size: 1.2rem;
		margin: 1rem 0 0.5rem 0;
		color: var(--neutral-foreground-rest);
	}

	.changelog-content :global(p) {
		margin: 0.5rem 0;
		line-height: 1.6;
	}

	.changelog-content :global(ul) {
		margin: 0.5rem 0 1rem 1.5rem;
		line-height: 1.8;
	}

	.changelog-content :global(li) {
		margin: 0.25rem 0;
	}

	.changelog-content :global(code) {
		background: var(--neutral-layer-2);
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-family: 'Consolas', 'Monaco', monospace;
		font-size: 0.9em;
	}

	.changelog-content :global(strong) {
		color: var(--accent-fill-rest);
		font-weight: 600;
	}

	.changelog-content :global(a) {
		color: var(--accent-fill-rest);
		text-decoration: none;
	}

	.changelog-content :global(a:hover) {
		text-decoration: underline;
	}
</style>
