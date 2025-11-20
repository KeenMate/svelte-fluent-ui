<script lang="ts">
	import {Stack, Card} from "svelte-fluentui"
</script>

<Stack orientation="vertical" gap="2rem">
	<div>
		<h1>Getting Started</h1>
		<p>Learn how to install and use Svelte FluentUI in your project.</p>
	</div>

	<Card>
		<h2>Installation</h2>
		<p>Install the package via npm:</p>
		<pre><code>npm install svelte-fluentui @fluentui/web-components</code></pre>
		<p>Or using pnpm:</p>
		<pre><code>pnpm add svelte-fluentui @fluentui/web-components</code></pre>
		<p>Or using yarn:</p>
		<pre><code>yarn add svelte-fluentui @fluentui/web-components</code></pre>
		<p class="note"><strong>Note:</strong> <code>@fluentui/web-components</code> is a peer dependency required for the library to work.</p>
	</Card>

	<Card>
		<h2>Basic Usage</h2>
		<p>Import and use components in your Svelte files:</p>
		<pre><code>&lt;script&gt;
  import &#123; Button, TextField, Card &#125; from 'svelte-fluentui'
&lt;/script&gt;

&lt;Card&gt;
  &lt;h2&gt;Welcome to Svelte FluentUI&lt;/h2&gt;
  &lt;TextField placeholder="Enter your name" /&gt;
  &lt;Button appearance="accent"&gt;Submit&lt;/Button&gt;
&lt;/Card&gt;</code></pre>
	</Card>

	<Card>
		<h2>Setting up Styles</h2>
		<p>Svelte FluentUI requires styles to be imported in your application. You have two options depending on your needs:</p>

		<h3>Option 1: Import SCSS (Recommended)</h3>
		<p>Use this approach if you want to customize variables or need full styling flexibility. Make sure your project is configured to process SCSS files.</p>
		<pre><code>&lt;script&gt;
  // In your main layout file (e.g., +layout.svelte)
  import 'svelte-fluentui/styles.scss'
&lt;/script&gt;</code></pre>
		<p><strong>Benefits:</strong></p>
		<ul>
			<li>Can override SCSS variables</li>
			<li>Full theming capabilities</li>
			<li>Better integration with custom styles</li>
		</ul>

		<h3>Option 2: Import Compiled CSS</h3>
		<p>Use this if you don't need to customize variables or if SCSS processing is not available:</p>
		<pre><code>&lt;script&gt;
  // In your main layout file (e.g., +layout.svelte)
  import 'svelte-fluentui/styles'
&lt;/script&gt;</code></pre>
		<p><strong>Limitations:</strong></p>
		<ul>
			<li>Cannot override SCSS variables</li>
			<li>Uses default theme values</li>
		</ul>
	</Card>

	<Card>
		<h2>Customizing Styles with SCSS Variables</h2>
		<p>If you need to override theme variables, import individual SCSS modules using Sass <code>@use</code> syntax with the <code>with</code> clause:</p>
		<pre><code>// Create a custom-theme.scss file
@use 'svelte-fluentui/fluent-ui';
@use 'svelte-fluentui/theme' with (
  $navbar-bg-light: #FFCC00,
  $sidebar-bg: #333,
  $accent-color: #0078d4
);
@use 'svelte-fluentui/layout';
@use 'svelte-fluentui/nav';
@use 'svelte-fluentui/components';</code></pre>
		<p>Then import your custom theme instead of the main styles:</p>
		<pre><code>&lt;script&gt;
  import './custom-theme.scss'
&lt;/script&gt;</code></pre>
		<p><strong>Available SCSS Modules:</strong></p>
		<ul>
			<li><code>svelte-fluentui/fluent-ui</code> - FluentUI web components base styles</li>
			<li><code>svelte-fluentui/theme</code> - Theme system and CSS variables</li>
			<li><code>svelte-fluentui/layout</code> - Layout component styles</li>
			<li><code>svelte-fluentui/nav</code> - Navigation component styles</li>
			<li><code>svelte-fluentui/components</code> - Custom component styles</li>
		</ul>
		<p>View all available SCSS variables in the <a href="/theme/variables">CSS Variables documentation</a>.</p>
	</Card>

	<Card>
		<h2>Setting up FluentUI Theme</h2>
		<p>Configure the FluentUI design system luminance for light/dark mode support:</p>
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
		<h2>Complete Setup Example</h2>
		<p>Here's a complete example of setting up Svelte FluentUI in your main layout:</p>
		<pre><code>&lt;!-- +layout.svelte --&gt;
&lt;script lang="ts"&gt;
  import &#123; onMount &#125; from 'svelte'
  import &#123; Layout, ToastContainer &#125; from 'svelte-fluentui'
  import &#123; baseLayerLuminance, StandardLuminance &#125; from '@fluentui/web-components'

  // Import styles (SCSS for customization, or '/styles' for CSS)
  import 'svelte-fluentui/styles.scss'

  onMount(() =&gt; &#123;
    baseLayerLuminance.setValueFor(document.body, StandardLuminance.LightMode)
  &#125;)

  let &#123;children&#125; = $props()
&lt;/script&gt;

&lt;Layout&gt;
  &#123;@render children()&#125;
&lt;/Layout&gt;

&lt;!-- Optional: Add ToastContainer for programmatic toasts --&gt;
&lt;ToastContainer /&gt;</code></pre>
	</Card>

	<Card>
		<h2>Component Categories</h2>
		<p>Svelte FluentUI includes the following component categories:</p>

		<h3>Forms & Inputs</h3>
		<p>TextField, TextArea, NumberField, Checkbox, Radio, Switch, Select, Combobox, Listbox, Search, Calendar, DatePicker, TimePicker, InputFile, Autocomplete</p>

		<h3>Buttons & Actions</h3>
		<p>Button, Anchor</p>

		<h3>Layout</h3>
		<p>Layout, Grid, GridItem, Stack, Spacer, MultiSplitter, BodyContent, Header, Footer</p>

		<h3>Navigation</h3>
		<p>NavMenu, NavGroup, NavLinkItem, AppBar, AppBarItem, Breadcrumbs, Tabs, Accordion</p>

		<h3>Display</h3>
		<p>Card, Badge, Divider</p>

		<h3>Feedback</h3>
		<p>Dialog, Toast, Toast Service, Tooltip, Progress</p>

		<h3>Data Display</h3>
		<p>DataGrid, QuickGrid, Paginator, Toolbar, Tree</p>
	</Card>

	<Card>
		<h2>TypeScript Support</h2>
		<p>All components are written in TypeScript and include full type definitions. You'll get autocomplete and type checking out of the box.</p>
		<pre><code>import type &#123; ButtonAppearance &#125; from 'svelte-fluentui'

const appearance: ButtonAppearance = 'accent'</code></pre>
	</Card>

	<Card>
		<h2>Importing Constants and Enums</h2>
		<p>The library exports various constants and enums for component configuration:</p>
		<pre><code>import &#123; Button &#125; from 'svelte-fluentui'
import &#123; AppBarOrientation, ButtonAppearance &#125; from 'svelte-fluentui/constants'

&lt;Button appearance=&#123;ButtonAppearance.Accent&#125;&gt;Click Me&lt;/Button&gt;</code></pre>
	</Card>

	<Card>
		<h2>Next Steps</h2>
		<ul>
			<li>Browse the <a href="/components">component list</a> to see all available components</li>
			<li>Check out the <a href="/theme/variables">CSS Variables</a> documentation to customize the theme</li>
			<li>Learn about <a href="/components/toast-service">Toast Service</a> for programmatic notifications</li>
			<li>Visit the <a href="https://github.com/KeenMate/svelte-fluentui" target="_blank" rel="noopener noreferrer">GitHub repository</a> for examples and source code</li>
			<li>Refer to <a href="https://www.fluentui-blazor.net/" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a> and <a href="https://developer.microsoft.com/en-us/fluentui" target="_blank" rel="noopener noreferrer">FluentUI</a> for design patterns and inspiration</li>
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

	p.note {
		background: var(--neutral-layer-2, #f5f5f5);
		border-left: 3px solid var(--accent-fill-rest, #0078d4);
		padding: 0.75rem 1rem;
		border-radius: 4px;
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
