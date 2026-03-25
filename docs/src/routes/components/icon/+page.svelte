<script lang="ts">
	import { Icon, Stack, Card, QuickGrid, Grid, GridItem } from 'svelte-fluentui';

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "name", type: "string", default: "required", description: "Icon name (e.g., \"home\", \"settings\", \"checkmark_circle\")"},
		{name: "size", type: "16 | 20 | 24 | 28 | 32 | 48", default: "24", description: "Icon size in pixels"},
		{name: "variant", type: "'regular' | 'filled'", default: "'regular'", description: "Icon variant style"},
		{name: "color", type: "'neutral' | 'accent' | 'warning' | 'info' | 'error' | 'success' | 'fill' | 'fill-inverse' | 'lightweight' | 'disabled' | 'custom'", default: "undefined", description: "Color enum mapping to FluentUI CSS variables"},
		{name: "customColor", type: "string", default: "undefined", description: "Custom color value (hex, rgb, CSS variable). Only used when color=\"custom\""},
		{name: "primaryFill", type: "string", default: "'currentColor'", description: "Legacy: Icon fill color. Use color instead"},
		{name: "hoverEffect", type: "boolean", default: "false", description: "Switch to filled variant on hover"},
		{name: "width", type: "string", default: "undefined", description: "Custom width (overrides size-based width)"},
		{name: "title", type: "string", default: "undefined", description: "Accessible title for the icon"},
		{name: "class", type: "string", default: '""', description: "Additional CSS classes"},
		{name: "style", type: "string", default: '""', description: "Inline styles"}
	]

	const callbacks: Property[] = []

	const slots: Property[] = []

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]
</script>

<h1>Icon</h1>

<Card>
	<p>
		<strong>References:</strong>
		<span style="color: #999; cursor: not-allowed;" title="Not available in FluentUI Web Components">FluentUI Web Component (N/A)</span>
		|
		<a href="https://www.fluentui-blazor.net/Icon" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		|
		<a href="https://github.com/microsoft/fluentui-system-icons" target="_blank" rel="noopener noreferrer">FluentUI System Icons</a>
	</p>
</Card>

<p class="description">
	The Icon component renders SVG icons from the <a href="https://github.com/microsoft/fluentui-system-icons" target="_blank" rel="noopener">@fluentui/svg-icons</a> package.
	Icons are loaded on-demand and support multiple sizes, variants, and hover effects.
</p>

<h2>Setup</h2>

<Card>
	<p>To use the Icon component in your project, you need to:</p>
	<ol>
		<li>Install the required dependency:
			<pre><code>npm install @fluentui/svg-icons</code></pre>
		</li>
		<li>Add the Vite plugin to your <code>vite.config.ts</code>:
			<pre><code>{`import { fluentuiIcons } from 'svelte-fluentui/vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    fluentuiIcons()
  ]
});`}</code></pre>
		</li>
	</ol>
	<p>The plugin handles both development and production:</p>
	<ul>
		<li><strong>Dev mode:</strong> Serves icons directly from node_modules</li>
		<li><strong>Build mode:</strong> Scans your code and copies only the icons you use to the output</li>
	</ul>
</Card>

<h2>Basic Usage</h2>

<Card>
	<Stack orientation="horizontal" gap="1rem" style="align-items: center; flex-wrap: wrap;">
		<Icon name="home" />
		<Icon name="settings" />
		<Icon name="person" />
		<Icon name="mail" />
		<Icon name="calendar" />
		<Icon name="search" />
	</Stack>
</Card>

<h2>Sizes</h2>

<p>Icons are available in 6 sizes: 16, 20, 24 (default), 28, 32, and 48 pixels.</p>

<Card>
	<Stack orientation="horizontal" gap="1.5rem" style="align-items: end; flex-wrap: wrap;">
		<Stack orientation="vertical" gap="0.25rem" style="align-items: center;">
			<Icon name="star" size={16} />
			<span class="size-label">16</span>
		</Stack>
		<Stack orientation="vertical" gap="0.25rem" style="align-items: center;">
			<Icon name="star" size={20} />
			<span class="size-label">20</span>
		</Stack>
		<Stack orientation="vertical" gap="0.25rem" style="align-items: center;">
			<Icon name="star" size={24} />
			<span class="size-label">24</span>
		</Stack>
		<Stack orientation="vertical" gap="0.25rem" style="align-items: center;">
			<Icon name="star" size={28} />
			<span class="size-label">28</span>
		</Stack>
		<Stack orientation="vertical" gap="0.25rem" style="align-items: center;">
			<Icon name="star" size={32} />
			<span class="size-label">32</span>
		</Stack>
		<Stack orientation="vertical" gap="0.25rem" style="align-items: center;">
			<Icon name="star" size={48} />
			<span class="size-label">48</span>
		</Stack>
	</Stack>
</Card>

<h2>Variants</h2>

<p>Each icon comes in two variants: <code>regular</code> (default) and <code>filled</code>.</p>

<Card>
	<Stack orientation="horizontal" gap="2rem" style="flex-wrap: wrap;">
		<Stack orientation="vertical" gap="0.5rem" style="align-items: center;">
			<Icon name="heart" size={32} variant="regular" />
			<span class="size-label">regular</span>
		</Stack>
		<Stack orientation="vertical" gap="0.5rem" style="align-items: center;">
			<Icon name="heart" size={32} variant="filled" />
			<span class="size-label">filled</span>
		</Stack>
	</Stack>
</Card>

<h2>Color Options</h2>

<p>Icons can be drawn and filled with a color through the <code>color</code> parameter which maps to FluentUI CSS variables.</p>

<Card>
	<div class="table-wrapper">
		<table>
			<thead>
				<tr>
					<th>Color</th>
					<th>CSS Variable</th>
					<th>Example</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>neutral</td>
					<td><code>var(--neutral-foreground-rest)</code></td>
					<td><Icon name="alert" size={24} color="neutral" /> <Icon name="alert" size={24} color="neutral" variant="filled" /></td>
				</tr>
				<tr>
					<td>accent</td>
					<td><code>var(--accent-fill-rest)</code></td>
					<td><Icon name="alert" size={24} color="accent" /> <Icon name="alert" size={24} color="accent" variant="filled" /></td>
				</tr>
				<tr>
					<td>warning</td>
					<td><code>var(--warning)</code></td>
					<td><Icon name="alert" size={24} color="warning" /> <Icon name="alert" size={24} color="warning" variant="filled" /></td>
				</tr>
				<tr>
					<td>info</td>
					<td><code>var(--info)</code></td>
					<td><Icon name="alert" size={24} color="info" /> <Icon name="alert" size={24} color="info" variant="filled" /></td>
				</tr>
				<tr>
					<td>error</td>
					<td><code>var(--error)</code></td>
					<td><Icon name="alert" size={24} color="error" /> <Icon name="alert" size={24} color="error" variant="filled" /></td>
				</tr>
				<tr>
					<td>success</td>
					<td><code>var(--success)</code></td>
					<td><Icon name="alert" size={24} color="success" /> <Icon name="alert" size={24} color="success" variant="filled" /></td>
				</tr>
				<tr>
					<td>fill</td>
					<td><code>var(--neutral-fill-rest)</code></td>
					<td><Icon name="alert" size={24} color="fill" /> <Icon name="alert" size={24} color="fill" variant="filled" /></td>
				</tr>
				<tr>
					<td>fill-inverse</td>
					<td><code>var(--neutral-fill-inverse-rest)</code></td>
					<td><span style="background: var(--neutral-foreground-rest); padding: 4px; border-radius: 4px;"><Icon name="alert" size={24} color="fill-inverse" /> <Icon name="alert" size={24} color="fill-inverse" variant="filled" /></span></td>
				</tr>
				<tr>
					<td>lightweight</td>
					<td><code>var(--neutral-layer-1)</code></td>
					<td><span style="background: var(--neutral-foreground-rest); padding: 4px; border-radius: 4px;"><Icon name="alert" size={24} color="lightweight" /> <Icon name="alert" size={24} color="lightweight" variant="filled" /></span></td>
				</tr>
				<tr>
					<td>disabled</td>
					<td><code>var(--neutral-stroke-rest)</code></td>
					<td><Icon name="alert" size={24} color="disabled" /> <Icon name="alert" size={24} color="disabled" variant="filled" /></td>
				</tr>
				<tr>
					<td>custom</td>
					<td>Uses <code>customColor</code> prop</td>
					<td><Icon name="alert" size={24} color="custom" customColor="#8764b8" /> <Icon name="alert" size={24} color="custom" customColor="#8764b8" variant="filled" /></td>
				</tr>
			</tbody>
		</table>
	</div>
</Card>

<h2>Custom Color</h2>

<p>For custom colors, use <code>color="custom"</code> with <code>customColor</code>, or use the legacy <code>primaryFill</code> prop, or inherit via CSS <code>color</code>.</p>

<Card>
	<Stack orientation="horizontal" gap="1rem" style="align-items: center; flex-wrap: wrap;">
		<Icon name="heart" size={32} variant="filled" color="custom" customColor="#e81123" />
		<Icon name="checkmark_circle" size={32} variant="filled" color="custom" customColor="#107c10" />
		<Icon name="warning" size={32} variant="filled" color="custom" customColor="#ffb900" />
		<Icon name="info" size={32} variant="filled" color="custom" customColor="#0078d4" />
		<span style="color: #8764b8;">
			<Icon name="star" size={32} variant="filled" />
		</span>
	</Stack>
</Card>

<h2>Hover Effect</h2>

<p>Enable <code>hoverEffect</code> to automatically switch from regular to filled variant on hover.</p>

<Card>
	<Stack orientation="horizontal" gap="1rem" style="align-items: center; flex-wrap: wrap;">
		<Icon name="heart" size={32} hoverEffect />
		<Icon name="star" size={32} hoverEffect />
		<Icon name="bookmark" size={32} hoverEffect />
		<Icon name="thumb_like" size={24} hoverEffect />
	</Stack>
	<p style="margin-top: 1rem; color: var(--neutral-foreground-hint);">Hover over the icons above to see the effect.</p>
</Card>

<h2>Plugin Options</h2>

<Card>
	<p>The <code>fluentuiIcons</code> plugin accepts the following options:</p>
	<div class="table-wrapper">
		<table>
			<thead>
				<tr>
					<th>Option</th>
					<th>Type</th>
					<th>Default</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>include</code></td>
					<td><code>string[]</code></td>
					<td><code>[]</code></td>
					<td>Additional icon names to always include (for dynamic usage)</td>
				</tr>
				<tr>
					<td><code>configFile</code></td>
					<td><code>string | false</code></td>
					<td>auto-detect</td>
					<td>Path to config file, or <code>false</code> to disable</td>
				</tr>
				<tr>
					<td><code>scanPatterns</code></td>
					<td><code>string[]</code></td>
					<td><code>['**/*.svelte', '**/*.ts', '**/*.js']</code></td>
					<td>Glob patterns for files to scan for icon usage</td>
				</tr>
				<tr>
					<td><code>sizes</code></td>
					<td><code>number[]</code></td>
					<td><code>[16, 20, 24, 28, 32, 48]</code></td>
					<td>Icon sizes to copy for each detected icon</td>
				</tr>
				<tr>
					<td><code>variants</code></td>
					<td><code>('regular' | 'filled')[]</code></td>
					<td><code>['regular', 'filled']</code></td>
					<td>Icon variants to copy for each detected icon</td>
				</tr>
				<tr>
					<td><code>outputPath</code></td>
					<td><code>string</code></td>
					<td><code>'node_modules/@fluentui/svg-icons/icons'</code></td>
					<td>Output path relative to build output directory</td>
				</tr>
				<tr>
					<td><code>verbose</code></td>
					<td><code>boolean</code></td>
					<td><code>false</code></td>
					<td>Enable verbose logging during build</td>
				</tr>
			</tbody>
		</table>
	</div>
</Card>

<h2>Config File</h2>

<Card>
	<p>For projects with many dynamic icons, you can create a config file to register icons that should always be included. The plugin automatically looks for these files in your project root:</p>
	<ul>
		<li><code>fluentui-icons.config.json</code></li>
		<li><code>fluentui-icons.config.js</code></li>
		<li><code>fluentui-icons.config.ts</code></li>
	</ul>

	<h3>JSON format</h3>
	<pre><code>{`{
  "icons": [
    "home",
    "settings",
    "person",
    "mail",
    "calendar",
    "arrow_left",
    "arrow_right",
    "chevron_up",
    "chevron_down"
  ]
}`}</code></pre>

	<h3>JavaScript format</h3>
	<pre><code>{`// fluentui-icons.config.js
export default [
  'home',
  'settings',
  'person',
  'mail'
];

// Or with named export
export const icons = ['home', 'settings'];`}</code></pre>

	<h3>Disable config file</h3>
	<p>To disable automatic config file loading:</p>
	<pre><code>{`fluentuiIcons({
  configFile: false
})`}</code></pre>

	<h3>Custom config file path</h3>
	<pre><code>{`fluentuiIcons({
  configFile: 'src/icons.json'
})`}</code></pre>
</Card>

<h2>How the Vite Plugin Works</h2>

<Card>
	<p>The plugin scans your source files during build and looks for <code>&lt;Icon name="..." /&gt;</code> patterns using regex. Understanding what it can and cannot detect helps you avoid missing icons in production.</p>

	<h3>What the plugin WILL find:</h3>
	<pre><code>{`<!-- Static string literals -->
<Icon name="home" />
<Icon name="settings" size={24} />
<Icon name='arrow_left' variant="filled" />

<!-- Objects with name property (for programmatic usage) -->
const icons = [
  { name: "home", label: "Home" },
  { name: "settings", label: "Settings" }
];`}</code></pre>

	<h3>What the plugin will NOT find:</h3>
	<pre><code>{`<!-- Dynamic/computed names -->
<Icon name={iconName} />
<Icon name={isActive ? "star_filled" : "star"} />
<Icon name={\`arrow_\${direction}\`} />

<!-- Variables or props -->
{#each items as item}
  <Icon name={item.icon} />
{/each}

<!-- Concatenated strings -->
<Icon name={"home" + suffix} />`}</code></pre>

	<p style="margin-top: 1rem;">For dynamic icons, use the <code>include</code> option to ensure they are bundled:</p>
	<pre><code>{`fluentuiIcons({
  include: ['home', 'settings', 'person', 'mail', 'star', 'arrow_left', 'arrow_right']
})`}</code></pre>
</Card>

<h2>Icon Size Availability</h2>

<Card>
	<p>Not all icons are available in all sizes. The FluentUI icon set provides different sizes for different icons based on their intended use. If an icon is not found, check if it exists in the requested size.</p>
	<p>Common size availability patterns:</p>
	<ul>
		<li><strong>Most icons:</strong> 16, 20, 24 (these are almost always available)</li>
		<li><strong>Many icons:</strong> 28, 32 (commonly available)</li>
		<li><strong>Some icons:</strong> 48 (less common, mainly for large displays)</li>
	</ul>
	<p style="margin-top: 0.5rem;">When in doubt, use size 24 as it has the best coverage across the icon set.</p>
</Card>

<h2>API Reference</h2>

<Card>
	<h3>Properties</h3>
	<QuickGrid items={properties} columns={propertyColumns} sortable filterable striped />
</Card>

<Grid columns={2} gap="1rem">
	<GridItem>
		<Card>
			<h3>Callbacks</h3>
			<QuickGrid items={callbacks} columns={propertyColumns} sortable filterable striped />
		</Card>
	</GridItem>
	<GridItem>
		<Card>
			<h3>Slots</h3>
			<QuickGrid items={slots} columns={propertyColumns} sortable filterable striped />
		</Card>
	</GridItem>
</Grid>

<h2>Finding Icon Names</h2>

<Card>
	<p>Browse available icons at:</p>
	<ul>
		<li><a href="https://react.fluentui.dev/?path=/docs/icons-catalog--docs" target="_blank" rel="noopener">FluentUI Icon Catalog</a></li>
		<li><a href="https://github.com/microsoft/fluentui-system-icons/tree/main/assets" target="_blank" rel="noopener">GitHub Assets Folder</a></li>
	</ul>
	<p style="margin-top: 1rem;">
		Icon names use snake_case format. For example:
	</p>
	<ul>
		<li><code>home</code> → home icon</li>
		<li><code>arrow_left</code> → left arrow</li>
		<li><code>checkmark_circle</code> → checkmark in circle</li>
		<li><code>document_pdf</code> → PDF document</li>
	</ul>
</Card>

<style>
	h1 {
		font-size: 2rem;
		margin: 0 0 0.5rem 0;
		font-weight: 600;
	}

	h2 {
		font-size: 1.5rem;
		margin: 2rem 0 1rem 0;
		font-weight: 600;
	}

	.description {
		color: var(--neutral-foreground-hint);
		margin-bottom: 2rem;
	}

	.size-label {
		font-size: 0.75rem;
		color: var(--neutral-foreground-hint);
	}

	code {
		background-color: var(--neutral-layer-2);
		padding: 0.125rem 0.375rem;
		border-radius: 3px;
		font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
		font-size: 0.875em;
	}

	pre {
		background-color: var(--neutral-layer-2);
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		margin: 0.5rem 0;
	}

	pre code {
		padding: 0;
		background: none;
	}

	ol, ul {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
	}

	li {
		margin: 0.5rem 0;
	}

	.table-wrapper {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	th, td {
		text-align: left;
		padding: 0.75rem;
		border-bottom: 1px solid var(--neutral-stroke-divider-rest);
	}

	th {
		font-weight: 600;
		background-color: var(--neutral-layer-2);
	}

	a {
		color: var(--accent-foreground-rest);
	}

	a:hover {
		text-decoration: underline;
	}
</style>
