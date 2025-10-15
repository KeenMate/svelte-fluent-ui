<script lang="ts">
	import {Stack, Card} from "$lib/index.js"
</script>

<Stack orientation="vertical" gap="2rem">
	<div>
		<h1>Getting Started</h1>
		<p>Learn how to install and use Svelte FluentUI in your project.</p>
	</div>

	<Card>
		<h2>Installation</h2>
		<p>Install the package via npm:</p>
		<pre><code>npm install @keenmate/svelte-fluentui</code></pre>
		<p>Or using pnpm:</p>
		<pre><code>pnpm add @keenmate/svelte-fluentui</code></pre>
		<p>Or using yarn:</p>
		<pre><code>yarn add @keenmate/svelte-fluentui</code></pre>
	</Card>

	<Card>
		<h2>Basic Usage</h2>
		<p>Import and use components in your Svelte files:</p>
		<pre><code>&lt;script&gt;
  import &#123; Button, TextField, Card &#125; from '@keenmate/svelte-fluentui'
&lt;/script&gt;

&lt;Card&gt;
  &lt;h2&gt;Welcome to Svelte FluentUI&lt;/h2&gt;
  &lt;TextField placeholder="Enter your name" /&gt;
  &lt;Button appearance="accent"&gt;Submit&lt;/Button&gt;
&lt;/Card&gt;</code></pre>
	</Card>

	<Card>
		<h2>Setting up FluentUI Theme</h2>
		<p>To properly style the components, you need to import the main stylesheet and set up the FluentUI theme:</p>

		<h3>1. Import Styles</h3>
		<p>In your main layout file (e.g., <code>+layout.svelte</code>):</p>
		<pre><code>&lt;script&gt;
  import '@keenmate/svelte-fluentui/styles'
&lt;/script&gt;</code></pre>

		<h3>2. Set Base Layer Luminance</h3>
		<p>Configure the theme luminance for light/dark mode support:</p>
		<pre><code>&lt;script&gt;
  import &#123; onMount &#125; from 'svelte'
  import &#123; baseLayerLuminance, StandardLuminance &#125; from '@fluentui/web-components'

  onMount(() =&gt; &#123;
    // For light mode
    baseLayerLuminance.setValueFor(
      document.body,
      StandardLuminance.LightMode
    )

    // For dark mode, use:
    // baseLayerLuminance.setValueFor(
    //   document.body,
    //   StandardLuminance.DarkMode
    // )
  &#125;)
&lt;/script&gt;</code></pre>
	</Card>

	<Card>
		<h2>Component Categories</h2>
		<p>Svelte FluentUI includes the following component categories:</p>

		<h3>Forms & Inputs</h3>
		<p>TextField, TextArea, NumberField, Checkbox, Radio, Switch, Select, Combobox, Listbox, Search, Calendar</p>

		<h3>Buttons & Actions</h3>
		<p>Button, Anchor</p>

		<h3>Layout</h3>
		<p>Layout, Grid, GridItem, Stack, Spacer, MultiSplitter, BodyContent</p>

		<h3>Navigation</h3>
		<p>NavMenu, NavGroup, NavLinkItem, AppBar, Breadcrumbs, Tabs, Accordion</p>

		<h3>Display</h3>
		<p>Card, Badge</p>

		<h3>Feedback</h3>
		<p>Dialog, Toast, Tooltip</p>

		<h3>Data Display</h3>
		<p>DataGrid, QuickGrid, Paginator, Toolbar</p>
	</Card>

	<Card>
		<h2>TypeScript Support</h2>
		<p>All components are written in TypeScript and include full type definitions. You'll get autocomplete and type checking out of the box.</p>
	</Card>

	<Card>
		<h2>Next Steps</h2>
		<ul>
			<li>Browse the <a href="/">component list</a> to see all available components</li>
			<li>Check out the <a href="/theme/variables">CSS Variables</a> documentation to customize the theme</li>
			<li>Visit the <a href="https://github.com/KeenMate/svelte-fluentui" target="_blank" rel="noopener noreferrer">GitHub repository</a> for examples and source code</li>
			<li>Refer to <a href="https://docs.microsoft.com/en-us/fluent-ui/web-components/" target="_blank" rel="noopener noreferrer">FluentUI Web Components documentation</a> for detailed API information</li>
		</ul>
	</Card>
</Stack>

<style>
	h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin: 0 0 0.5rem 0;
	}

	h2 {
		font-size: 1.75rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 1.5rem 0 0.75rem 0;
	}

	h3:first-of-type {
		margin-top: 0;
	}

	p {
		margin: 0 0 1rem 0;
		line-height: 1.6;
	}

	pre {
		background: var(--neutral-layer-2, #f5f5f5);
		border: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		border-radius: 4px;
		padding: 1rem;
		overflow-x: auto;
		margin: 1rem 0;
	}

	code {
		font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
		font-size: 0.9rem;
	}

	p code {
		background: var(--neutral-layer-2, #f5f5f5);
		border: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		border-radius: 3px;
		padding: 0.2rem 0.4rem;
		font-size: 0.85rem;
	}

	ul {
		margin: 0;
		padding-left: 1.5rem;
		line-height: 1.8;
	}

	li {
		margin-bottom: 0.5rem;
	}

	a {
		color: var(--accent-fill-rest, #0078d4);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
