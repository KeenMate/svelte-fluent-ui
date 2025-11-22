<script lang="ts">
	import {Divider} from 'svelte-fluentui'
</script>

<div style="padding: 2rem;">
	<h1>🔥 Divider HMR Test</h1>

	<div style="margin-top: 2rem;">
		<p>Section 1</p>
		<Divider />
		<p>Section 2</p>
		<Divider />
		<p>Section 3</p>
	</div>

	<div style="margin-top: 3rem; padding: 1rem; background: #f0f0f0; border-radius: 8px;">
		<h3>🔥 Test Hot Reload:</h3>
		<ol style="margin: 1rem 0;">
			<li>Edit <code>packages/svelte-fluentui/src/lib/components/Divider.svelte</code></li>
			<li>Add some styling or change the component</li>
			<li>Watch this page update instantly without refresh!</li>
		</ol>
	</div>
</div>

<style>
	code {
		background: #e0e0e0;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		font-family: monospace;
	}
</style>
