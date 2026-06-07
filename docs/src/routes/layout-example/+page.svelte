<script lang="ts">
	import {Stack, Card} from "svelte-fluentui"
	import {Meta} from "$lib/components"
</script>

<Stack orientation="vertical" gap="2rem">
	<Meta
		title="Layout Example"
		description="A complete application layout walkthrough using Svelte FluentUI's Layout, BodyContent, Footer, Grid, NavMenu, and related components."
		keywords="svelte, fluentui, layout, example, application, page, template"
	/>

	<div>
		<h1>Layout Example</h1>
		<p>Learn how to build application layouts using Svelte FluentUI components.</p>
	</div>

	<Card>
		<h2>Documentation Site Layout</h2>
		<p>This documentation site itself is built using Svelte FluentUI layout components. Here's the complete structure:</p>

		<h3>Full Layout Structure</h3>
		<pre><code>&lt;script&gt;
  import &#123;
    Layout,
    BodyContent,
    Footer,
    Grid,
    GridItem,
    NavMenu,
    NavGroup,
    NavLinkItem,
    Button
  &#125; from '@keenmate/svelte-fluentui'
&lt;/script&gt;

&lt;Layout orientation="vertical" style="min-height: 100vh;"&gt;
  &lt;!-- Top Navigation Bar --&gt;
  &lt;div class="topnav"&gt;
    &lt;a href="/" class="topnav-brand"&gt;Svelte FluentUI&lt;/a&gt;
    &lt;div class="topnav-actions"&gt;
      &lt;Button appearance="stealth" onClick=&#123;toggleTheme&#125;&gt;
        &#123;$theme === "light" ? "🌙" : "☀️"&#125;
      &lt;/Button&gt;
    &lt;/div&gt;
  &lt;/div&gt;

  &lt;!-- Main Content Area with Sidebar --&gt;
  &lt;BodyContent&gt;
    &lt;Grid spacing=&#123;0&#125;&gt;
      &lt;!-- Sidebar --&gt;
      &lt;GridItem xs=&#123;12&#125; md=&#123;3&#125; lg=&#123;2&#125;&gt;
        &lt;div class="sidebar"&gt;
          &lt;NavMenu&gt;
            &lt;NavGroup&gt;
              &lt;NavLinkItem href="/"&gt;Home&lt;/NavLinkItem&gt;
              &lt;NavLinkItem href="/getting-started"&gt;Getting Started&lt;/NavLinkItem&gt;
            &lt;/NavGroup&gt;
          &lt;/NavMenu&gt;
        &lt;/div&gt;
      &lt;/GridItem&gt;

      &lt;!-- Main Content --&gt;
      &lt;GridItem xs=&#123;12&#125; md=&#123;9&#125; lg=&#123;10&#125;&gt;
        &lt;div class="content"&gt;
          &lt;!-- Your page content goes here --&gt;
        &lt;/div&gt;
      &lt;/GridItem&gt;
    &lt;/Grid&gt;
  &lt;/BodyContent&gt;

  &lt;!-- Footer --&gt;
  &lt;Footer&gt;
    © 2025 Svelte FluentUI - Built with Fluent UI Web Components
  &lt;/Footer&gt;
&lt;/Layout&gt;</code></pre>
	</Card>

	<Card>
		<h2>Key Components Explained</h2>

		<h3>Layout</h3>
		<p>The root container that holds all page sections. Set <code>orientation="vertical"</code> for a top-to-bottom layout.</p>
		<pre><code>&lt;Layout orientation="vertical" style="min-height: 100vh;"&gt;
  &lt;!-- All content --&gt;
&lt;/Layout&gt;</code></pre>

		<h3>BodyContent</h3>
		<p>The main content wrapper that sits between header/nav and footer.</p>
		<pre><code>&lt;BodyContent&gt;
  &lt;!-- Main content and sidebar --&gt;
&lt;/BodyContent&gt;</code></pre>

		<h3>Grid & GridItem</h3>
		<p>A 12-column responsive grid system. GridItem accepts responsive breakpoints:</p>
		<ul>
			<li><code>xs</code> - Extra small screens (default)</li>
			<li><code>sm</code> - Small screens (640px+)</li>
			<li><code>md</code> - Medium screens (768px+)</li>
			<li><code>lg</code> - Large screens (1024px+)</li>
			<li><code>xl</code> - Extra large screens (1280px+)</li>
		</ul>
		<pre><code>&lt;Grid spacing=&#123;0&#125;&gt;
  &lt;GridItem xs=&#123;12&#125; md=&#123;3&#125; lg=&#123;2&#125;&gt;
    &lt;!-- Sidebar: full width on mobile, 3 cols on tablet, 2 cols on desktop --&gt;
  &lt;/GridItem&gt;

  &lt;GridItem xs=&#123;12&#125; md=&#123;9&#125; lg=&#123;10&#125;&gt;
    &lt;!-- Content: full width on mobile, 9 cols on tablet, 10 cols on desktop --&gt;
  &lt;/GridItem&gt;
&lt;/Grid&gt;</code></pre>

		<h3>Footer</h3>
		<p>A footer section that appears at the bottom of the layout.</p>
		<pre><code>&lt;Footer&gt;
  © 2025 Your App Name
&lt;/Footer&gt;</code></pre>
	</Card>

	<Card>
		<h2>Navigation Menu Structure</h2>
		<p>Build hierarchical navigation menus with NavMenu, NavGroup, and NavLinkItem:</p>
		<pre><code>&lt;NavMenu&gt;
  &lt;NavGroup&gt;
    &#123;#snippet linkIcon()&#125;
      &lt;span class="nav-icon"&gt;🏠&lt;/span&gt;
    &#123;/snippet&#125;
    &#123;#snippet linkText()&#125;
      Home
    &#123;/snippet&#125;

    &lt;NavLinkItem href="/"&gt;Dashboard&lt;/NavLinkItem&gt;
    &lt;NavLinkItem href="/settings"&gt;Settings&lt;/NavLinkItem&gt;
  &lt;/NavGroup&gt;

  &lt;NavGroup&gt;
    &#123;#snippet linkIcon()&#125;
      &lt;span class="nav-icon"&gt;📚&lt;/span&gt;
    &#123;/snippet&#125;
    &#123;#snippet linkText()&#125;
      Documentation
    &#123;/snippet&#125;

    &lt;NavLinkItem href="/getting-started"&gt;Getting Started&lt;/NavLinkItem&gt;
    &lt;NavLinkItem href="/components"&gt;Components&lt;/NavLinkItem&gt;
  &lt;/NavGroup&gt;
&lt;/NavMenu&gt;</code></pre>
	</Card>

	<Card>
		<h2>Responsive Behavior</h2>
		<p>The layout automatically adapts to different screen sizes:</p>

		<h3>Desktop (1024px+)</h3>
		<ul>
			<li>Sidebar takes 2 columns (16.67% width)</li>
			<li>Main content takes 10 columns (83.33% width)</li>
			<li>Side-by-side layout</li>
		</ul>

		<h3>Tablet (768px - 1023px)</h3>
		<ul>
			<li>Sidebar takes 3 columns (25% width)</li>
			<li>Main content takes 9 columns (75% width)</li>
			<li>Side-by-side layout</li>
		</ul>

		<h3>Mobile (&lt;768px)</h3>
		<ul>
			<li>Both sidebar and content take full width (12 columns)</li>
			<li>Stacked vertically</li>
			<li>Sidebar typically hidden via CSS</li>
		</ul>
	</Card>

	<Card>
		<h2>Styling the Layout</h2>
		<p>Add custom styles to fine-tune the appearance:</p>
		<pre><code>&lt;style&gt;
  .topnav &#123;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--neutral-layer-1);
    border-bottom: 1px solid var(--neutral-stroke-layer-rest);
    padding: 0 1.5rem;
    height: 60px;
  &#125;

  .sidebar &#123;
    border-right: 1px solid var(--neutral-stroke-layer-rest);
    background: var(--neutral-layer-2);
    min-height: calc(100vh - 60px);
    position: sticky;
    top: 0;
    padding: var(--fluent-sidebar-padding);
  &#125;

  .content &#123;
    padding: 2rem;
  &#125;

  @media (max-width: 768px) &#123;
    .sidebar &#123;
      display: none;
    &#125;

    .content &#123;
      padding: 1rem;
    &#125;
  &#125;
&lt;/style&gt;</code></pre>
	</Card>

	<Card>
		<h2>Alternative: Simple Centered Layout</h2>
		<p>For simpler pages without a sidebar, use a centered layout:</p>
		<pre><code>&lt;Layout orientation="vertical" style="min-height: 100vh;"&gt;
  &lt;!-- Header --&gt;
  &lt;div class="header"&gt;
    &lt;h1&gt;My App&lt;/h1&gt;
  &lt;/div&gt;

  &lt;!-- Centered Content --&gt;
  &lt;BodyContent&gt;
    &lt;Grid&gt;
      &lt;GridItem xs=&#123;12&#125; lg=&#123;8&#125; offset=&#123;2&#125;&gt;
        &lt;div style="padding: 2rem;"&gt;
          &lt;!-- Your content here --&gt;
        &lt;/div&gt;
      &lt;/GridItem&gt;
    &lt;/Grid&gt;
  &lt;/BodyContent&gt;

  &lt;!-- Footer --&gt;
  &lt;Footer&gt;
    © 2025 My App
  &lt;/Footer&gt;
&lt;/Layout&gt;</code></pre>
	</Card>

	<Card>
		<h2>Stack for Vertical Spacing</h2>
		<p>Use Stack to create consistent vertical spacing between content sections:</p>
		<pre><code>&lt;Stack orientation="vertical" gap="2rem"&gt;
  &lt;Card&gt;
    &lt;h2&gt;Section 1&lt;/h2&gt;
    &lt;p&gt;Content here...&lt;/p&gt;
  &lt;/Card&gt;

  &lt;Card&gt;
    &lt;h2&gt;Section 2&lt;/h2&gt;
    &lt;p&gt;Content here...&lt;/p&gt;
  &lt;/Card&gt;

  &lt;Card&gt;
    &lt;h2&gt;Section 3&lt;/h2&gt;
    &lt;p&gt;Content here...&lt;/p&gt;
  &lt;/Card&gt;
&lt;/Stack&gt;</code></pre>
	</Card>

	<Card>
		<h2>Try It Yourself</h2>
		<p>Copy the code examples above and customize them for your needs. Key things to remember:</p>
		<ul>
			<li>Use <code>Layout</code> as the root container</li>
			<li>Use <code>Grid</code> and <code>GridItem</code> for responsive columns</li>
			<li>GridItem columns must add up to 12 for each row</li>
			<li>Use <code>Stack</code> for consistent spacing</li>
			<li>NavMenu components handle hierarchical navigation</li>
			<li>Customize with CSS variables for theming</li>
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
		margin: 0 0 1rem 0;
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
