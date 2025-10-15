<script lang="ts">
	import {Button, Stack, Card} from "$lib/index.js"

	let loading1 = $state(false)
	let loading2 = $state(false)

	async function handleRefresh(loadingVar: 'loading1' | 'loading2') {
		if (loadingVar === 'loading1') {
			loading1 = true
			await new Promise(resolve => setTimeout(resolve, 2000))
			loading1 = false
		} else {
			loading2 = true
			await new Promise(resolve => setTimeout(resolve, 2000))
			loading2 = false
		}
	}

	// Globe icon SVG
	const globeIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 110 16 8 8 0 010-16zm0 1a7 7 0 00-5.985 10.938A7.967 7.967 0 0110 11a7.967 7.967 0 015.985 2.938A7 7 0 0010 3zm0 14c-1.567 0-3.02-.54-4.167-1.446A6.972 6.972 0 0110 12a6.972 6.972 0 014.167 3.554A6.972 6.972 0 0110 17zM7.5 7.5a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2z"/></svg>`

	// Refresh icon SVG
	const refreshIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3a7 7 0 00-7 7h2a5 5 0 015-5v2l3-3-3-3v2zm7 7a7 7 0 01-7 7v-2a5 5 0 005-5h-2l3-3 3 3h-2z"/></svg>`
</script>

<h1>Button</h1>

<h2>Example</h2>

<Card>
	<Stack orientation="horizontal" gap="0.5rem" style="flex-wrap: wrap;">
		<Button>Button</Button>
		<Button appearance="accent">Accent</Button>
		<Button appearance="lightweight">Lightweight</Button>
		<Button appearance="outline">Outline</Button>
		<Button appearance="stealth">Stealth</Button>
		<Button appearance="accent" style="--accent-fill-rest: #ffd800; --accent-fill-hover: #e6c200; --accent-fill-active: #ccad00; color: #000;">Colored</Button>
		<Button appearance="accent" disabled={loading1} onClick={() => handleRefresh('loading1')}>
			{loading1 ? 'Loading...' : 'Loading'}
		</Button>
	</Stack>
</Card>

<h2>With content and icon</h2>

<Card>
	<Stack orientation="vertical" gap="2rem">
		<div>
			<h3>With icon at Start or End</h3>
			<Stack orientation="horizontal" gap="0.5rem" style="flex-wrap: wrap;">
				<Button>
					{#snippet start()}
						<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
							<path d="M10 2a8 8 0 110 16 8 8 0 010-16zm0 1a7 7 0 00-5.985 10.938A7.967 7.967 0 0110 11a7.967 7.967 0 015.985 2.938A7 7 0 0010 3zm0 14c-1.567 0-3.02-.54-4.167-1.446A6.972 6.972 0 0110 12a6.972 6.972 0 014.167 3.554A6.972 6.972 0 0110 17zM7.5 7.5a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2z"/>
						</svg>
					{/snippet}
					Button
				</Button>

				<Button appearance="accent">
					{#snippet start()}
						<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
							<path d="M10 2a8 8 0 110 16 8 8 0 010-16zm0 1a7 7 0 00-5.985 10.938A7.967 7.967 0 0110 11a7.967 7.967 0 015.985 2.938A7 7 0 0010 3zm0 14c-1.567 0-3.02-.54-4.167-1.446A6.972 6.972 0 0110 12a6.972 6.972 0 014.167 3.554A6.972 6.972 0 0110 17zM7.5 7.5a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2z"/>
						</svg>
					{/snippet}
					Button
				</Button>

				<Button>
					Button
					{#snippet end()}
						<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
							<path d="M10 2a8 8 0 110 16 8 8 0 010-16zm0 1a7 7 0 00-5.985 10.938A7.967 7.967 0 0110 11a7.967 7.967 0 015.985 2.938A7 7 0 0010 3zm0 14c-1.567 0-3.02-.54-4.167-1.446A6.972 6.972 0 0110 12a6.972 6.972 0 014.167 3.554A6.972 6.972 0 0110 17zM7.5 7.5a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2z"/>
						</svg>
					{/snippet}
				</Button>

				<Button appearance="accent">
					Button
					{#snippet end()}
						<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
							<path d="M10 2a8 8 0 110 16 8 8 0 010-16zm0 1a7 7 0 00-5.985 10.938A7.967 7.967 0 0110 11a7.967 7.967 0 015.985 2.938A7 7 0 0010 3zm0 14c-1.567 0-3.02-.54-4.167-1.446A6.972 6.972 0 0110 12a6.972 6.972 0 014.167 3.554A6.972 6.972 0 0110 17zM7.5 7.5a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2z"/>
						</svg>
					{/snippet}
				</Button>
			</Stack>
		</div>

		<div>
			<h3>With icon in default slot</h3>
			<Button aria-label="Globe">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
					<path d="M10 2a8 8 0 110 16 8 8 0 010-16zm0 1a7 7 0 00-5.985 10.938A7.967 7.967 0 0110 11a7.967 7.967 0 015.985 2.938A7 7 0 0010 3zm0 14c-1.567 0-3.02-.54-4.167-1.446A6.972 6.972 0 0110 12a6.972 6.972 0 014.167 3.554A6.972 6.972 0 0110 17zM7.5 7.5a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2z"/>
				</svg>
			</Button>
		</div>

		<div>
			<h3>With icon in the content. By doing it this way, it is possible to specify a <code>color</code> for the icon.</h3>
			<Button>
				<span style="display: flex; align-items: center; gap: 8px;">
					<svg width="24" height="24" viewBox="0 0 20 20" fill="#c50f1f">
						<path d="M10 2a8 8 0 110 16 8 8 0 010-16zm0 1a7 7 0 00-5.985 10.938A7.967 7.967 0 0110 11a7.967 7.967 0 015.985 2.938A7 7 0 0010 3zm0 14c-1.567 0-3.02-.54-4.167-1.446A6.972 6.972 0 0710 12a6.972 6.972 0 014.167 3.554A6.972 6.972 0 0110 17zM7.5 7.5a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2z"/>
					</svg>
					<span>Button</span>
				</span>
			</Button>
		</div>

		<div>
			<h3>With icon and loading</h3>
			<Stack orientation="horizontal" gap="0.5rem" style="flex-wrap: wrap;">
				<Button disabled={loading2} onClick={() => handleRefresh('loading2')}>
					{#snippet start()}
						<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={loading2 ? 'animation: spin 1s linear infinite;' : ''}>
							<path d="M3.75 10a6.25 6.25 0 0 1 11.25-3.75h-2.5a.625.625 0 0 0 0 1.25h3.75a.625.625 0 0 0 .625-.625v-3.75a.625.625 0 0 0-1.25 0v1.91A7.49 7.49 0 0 0 2.5 10a7.5 7.5 0 0 0 14.98.68.625.625 0 0 0-1.25-.1A6.25 6.25 0 0 1 3.75 10Z"/>
						</svg>
					{/snippet}
					Refresh
				</Button>

				<Button appearance="accent" disabled={loading2} onClick={() => handleRefresh('loading2')}>
					{#snippet start()}
						<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={loading2 ? 'animation: spin 1s linear infinite;' : ''}>
							<path d="M3.75 10a6.25 6.25 0 0 1 11.25-3.75h-2.5a.625.625 0 0 0 0 1.25h3.75a.625.625 0 0 0 .625-.625v-3.75a.625.625 0 0 0-1.25 0v1.91A7.49 7.49 0 0 0 2.5 10a7.5 7.5 0 0 0 14.98.68.625.625 0 0 0-1.25-.1A6.25 6.25 0 0 1 3.75 10Z"/>
						</svg>
					{/snippet}
					Refresh
				</Button>
			</Stack>
		</div>
	</Stack>
</Card>

<style>
	h1 {
		font-size: 2rem;
		margin: 0 0 2rem 0;
		font-weight: 600;
	}

	h2 {
		font-size: 1.5rem;
		margin: 2rem 0 1rem 0;
		font-weight: 600;
	}

	h3 {
		font-size: 1.125rem;
		margin: 0 0 1rem 0;
		font-weight: 600;
	}

	code {
		background-color: var(--neutral-layer-2);
		padding: 0.125rem 0.375rem;
		border-radius: 3px;
		font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
		font-size: 0.875em;
	}

	:global {
		@keyframes spin {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}
	}
</style>
