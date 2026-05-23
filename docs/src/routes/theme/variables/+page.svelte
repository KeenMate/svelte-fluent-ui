<script lang="ts">
	import {QuickGrid, Stack, Card} from "svelte-fluentui"
	import {Meta} from "$lib/components"

	type CSSVariable = {
		name: string
		category: string
		defaultValue: string
		description: string
	}

	const variables: CSSVariable[] = [
		// Background Colors
		{
			name: "--fluent-bg-primary",
			category: "Background",
			defaultValue: "#ffffff (light) / #1b1a19 (dark)",
			description: "Primary background color for main content areas"
		},
		{
			name: "--fluent-bg-secondary",
			category: "Background",
			defaultValue: "#faf9f8 (light) / #252423 (dark)",
			description: "Secondary background color for cards and containers"
		},
		{
			name: "--fluent-bg-tertiary",
			category: "Background",
			defaultValue: "#f3f2f1 (light) / #323130 (dark)",
			description: "Tertiary background color for subtle backgrounds"
		},

		// Text Colors
		{
			name: "--fluent-text-primary",
			category: "Text",
			defaultValue: "#323130 (light) / #faf9f8 (dark)",
			description: "Primary text color for body content"
		},
		{
			name: "--fluent-text-secondary",
			category: "Text",
			defaultValue: "#605e5c (light) / #d2d0ce (dark)",
			description: "Secondary text color for less prominent text"
		},
		{
			name: "--fluent-text-tertiary",
			category: "Text",
			defaultValue: "#a19f9d (light) / #a19f9d (dark)",
			description: "Tertiary text color for subtle/disabled text"
		},
		{
			name: "--fluent-text-inverse",
			category: "Text",
			defaultValue: "#ffffff (light) / #11100f (dark)",
			description: "Inverse text color for high-contrast backgrounds"
		},

		// Border Colors
		{
			name: "--fluent-border-primary",
			category: "Border",
			defaultValue: "#e1dfdd (light) / #484644 (dark)",
			description: "Primary border color for dividers and outlines"
		},
		{
			name: "--fluent-border-secondary",
			category: "Border",
			defaultValue: "#edebe9 (light) / #323130 (dark)",
			description: "Secondary border color for subtle borders"
		},

		// Accent Colors
		{
			name: "--fluent-accent-primary",
			category: "Accent",
			defaultValue: "#0078d4 (light) / #0086f0 (dark)",
			description: "Primary accent color for interactive elements"
		},
		{
			name: "--fluent-accent-hover",
			category: "Accent",
			defaultValue: "#106ebe (light) / #0078d4 (dark)",
			description: "Accent color on hover state"
		},
		{
			name: "--fluent-accent-active",
			category: "Accent",
			defaultValue: "#005a9e (light) / #106ebe (dark)",
			description: "Accent color on active/pressed state"
		},

		// Navbar
		{
			name: "--fluent-navbar-bg",
			category: "Navbar",
			defaultValue: "#ffffff (light) / #1b1a19 (dark)",
			description: "Background color for navigation bar"
		},
		{
			name: "--fluent-navbar-text",
			category: "Navbar",
			defaultValue: "#323130 (light) / #faf9f8 (dark)",
			description: "Text color for navigation bar items"
		},
		{
			name: "--fluent-navbar-border",
			category: "Navbar",
			defaultValue: "#e1dfdd (light) / #484644 (dark)",
			description: "Border color for navigation bar"
		},

		// Sidebar
		{
			name: "--fluent-sidebar-bg",
			category: "Sidebar",
			defaultValue: "#f3f2f1 (light) / #000000 (dark)",
			description: "Background color for sidebar navigation"
		},
		{
			name: "--fluent-sidebar-text",
			category: "Sidebar",
			defaultValue: "#323130 (light) / #faf9f8 (dark)",
			description: "Text color for sidebar items"
		},
		{
			name: "--fluent-sidebar-border",
			category: "Sidebar",
			defaultValue: "#e1dfdd (light) / #484644 (dark)",
			description: "Border color for sidebar"
		},
		{
			name: "--fluent-sidebar-hover",
			category: "Sidebar",
			defaultValue: "#edebe9 (light) / #201f1e (dark)",
			description: "Background color for sidebar items on hover"
		},
		{
			name: "--fluent-sidebar-active",
			category: "Sidebar",
			defaultValue: "#e1dfdd (light) / #252423 (dark)",
			description: "Background color for active sidebar items"
		},

		// Header
		{
			name: "--fluent-header-bg",
			category: "Header",
			defaultValue: "#ffffff (light) / #1b1a19 (dark)",
			description: "Background color for page header"
		},
		{
			name: "--fluent-header-text",
			category: "Header",
			defaultValue: "#323130 (light) / #faf9f8 (dark)",
			description: "Text color for header content"
		},
		{
			name: "--fluent-header-border",
			category: "Header",
			defaultValue: "#e1dfdd (light) / #484644 (dark)",
			description: "Border color for header"
		},

		// Footer
		{
			name: "--fluent-footer-bg",
			category: "Footer",
			defaultValue: "#ffffff (light) / #1b1a19 (dark)",
			description: "Background color for page footer"
		},
		{
			name: "--fluent-footer-text",
			category: "Footer",
			defaultValue: "#323130 (light) / #faf9f8 (dark)",
			description: "Text color for footer content"
		},
		{
			name: "--fluent-footer-border",
			category: "Footer",
			defaultValue: "#e1dfdd (light) / #484644 (dark)",
			description: "Border color for footer"
		},

		// Component Spacing
		{
			name: "--fluent-component-padding",
			category: "Spacing",
			defaultValue: "12px",
			description: "Default padding for components"
		},
		{
			name: "--fluent-component-margin",
			category: "Spacing",
			defaultValue: "12px",
			description: "Default margin for components"
		},
		{
			name: "--fluent-component-gap",
			category: "Spacing",
			defaultValue: "12px",
			description: "Default gap for flex/grid layouts"
		},

		// Sidebar (continued)
		{
			name: "--fluent-sidebar-link-padding",
			category: "Sidebar",
			defaultValue: "12px",
			description: "Padding for sidebar navigation links (set to 0 in DHL theme for Microsoft-style)"
		},
		{
			name: "--fluent-sidebar-padding",
			category: "Sidebar",
			defaultValue: "16px",
			description: "Overall padding around the sidebar"
		},
		{
			name: "--fluent-sidebar-icon-gap",
			category: "Sidebar",
			defaultValue: "8px",
			description: "Gap between sidebar icon and text"
		},

		// Typography
		{
			name: "--fluent-body-font-size",
			category: "Typography",
			defaultValue: "14px",
			description: "Font size for body text"
		},
		{
			name: "--fluent-body-font-weight",
			category: "Typography",
			defaultValue: "400",
			description: "Font weight for body text"
		},
		{
			name: "--fluent-heading-font-weight",
			category: "Typography",
			defaultValue: "600",
			description: "Font weight for headings"
		},

		// Borders
		{
			name: "--fluent-border-radius",
			category: "Border",
			defaultValue: "4px",
			description: "Border radius for components"
		},
		{
			name: "--fluent-border-width",
			category: "Border",
			defaultValue: "1px",
			description: "Border width for components"
		},

		// Transitions
		{
			name: "--fluent-transition",
			category: "Animation",
			defaultValue: "0.15s",
			description: "Transition duration for animations"
		}
	]

	const columns = [
		{field: "name", title: "CSS Variable", sortable: true, filterable: true},
		{field: "category", title: "Category", sortable: true, filterable: true},
		{field: "defaultValue", title: "Default Value", sortable: true, filterable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<Stack orientation="vertical" gap="1rem">
	<Meta
		title="CSS Variables"
		description="Complete reference of CSS custom properties for theming Svelte FluentUI — backgrounds, text, borders, accents, navbar, sidebar, header, and footer."
		keywords="svelte, fluentui, css variables, theme, theming, design tokens, customization"
	/>

	<h1>CSS Variables</h1>

	<Card>
		<p>
			This page documents all CSS custom properties available in the Svelte FluentUI theme system.
			These variables can be overridden per theme using the <code>data-theme</code> attribute.
		</p>
		<p>
			<strong>Available themes:</strong>
			<code>light</code> (default),
			<code>dark</code>,
			<code>dhl</code>
		</p>
	</Card>

	<Card>
		<h2>Theme Variables Reference</h2>
		<QuickGrid
			items={variables}
			columns={columns}
			sortable
			filterable
			striped
			pageable
			pageSize={20}
		/>
	</Card>

	<Card>
		<h2>Usage Example</h2>
		<pre><code>&lt;!-- Set theme on html or body element --&gt;
&lt;html data-theme="dark"&gt;

&lt;!-- Override a variable in your CSS --&gt;
&lt;style&gt;
  .my-custom-component &#123;
    background-color: var(--fluent-bg-primary);
    color: var(--fluent-text-primary);
    padding: var(--fluent-component-padding);
    border-radius: var(--fluent-border-radius);
  &#125;
&lt;/style&gt;

&lt;!-- Override a variable inline --&gt;
&lt;div style="--fluent-nav-link-padding: 8px;"&gt;
  &lt;NavMenu&gt;...&lt;/NavMenu&gt;
&lt;/div&gt;</code></pre>
	</Card>
</Stack>

<style>
	code {
		background-color: var(--fluent-bg-secondary);
		padding: 2px 6px;
		border-radius: 3px;
		font-family: 'Consolas', 'Monaco', monospace;
		font-size: 0.9em;
	}

	pre {
		background-color: var(--fluent-bg-secondary);
		padding: 16px;
		border-radius: var(--fluent-border-radius);
		overflow-x: auto;
	}

	pre code {
		background-color: transparent;
		padding: 0;
	}
</style>
