<script lang="ts">
	import {Stack, Card, Icon, QuickGrid} from "svelte-fluentui"
	import {Meta} from "$lib/components"

	// ---- Live demo: custom toolbar icons via `iconSnippet` ----
	type DemoRow = {id: number; name: string; status: string}

	let demoItems = $state<DemoRow[]>([
		{id: 1, name: "Alabama", status: "Active"},
		{id: 2, name: "Alaska", status: "Paused"},
		{id: 3, name: "Arizona", status: "Active"}
	])

	const demoColumns = [
		{field: "name", title: "Value", sortable: true},
		{field: "status", title: "Status", sortable: true}
	]

	let lastAction = $state("Hover a row and click a toolbar icon.")
</script>

<Stack orientation="vertical" gap="2rem">
	<Meta
		title="Working with Icons"
		description="How svelte-fluentui detects, bundles, and delivers FluentUI icons — the build-time scanner, the fluentui-icons.config.json allowlist, library-internal icons, and using custom (non-FluentUI) icons."
		keywords="svelte, fluentui, icons, icon detection, vite plugin, fluentui-icons.config.json, bundling, quickgrid toolbar"
	/>

	<div>
		<h1>Working with Icons</h1>
		<p class="description">
			Icons in <code>svelte-fluentui</code> are <strong>tree-shaken at build time</strong>: instead of shipping the
			whole FluentUI icon set (thousands of SVGs), the <code>svelteFluentUI()</code> Vite plugin scans your source,
			works out exactly which icons you render, and bundles only those. This page explains the mental model, what
			you're expected to do, how detection works (and where it can't reach), and how to use the
			<code>fluentui-icons.config.json</code> allowlist.
		</p>
	</div>

	<!-- ============================================================ -->
	<Card>
		<h2>How it works</h2>
		<p>There are three moving parts:</p>
		<ol>
			<li>
				<strong><code>@fluentui/svg-icons</code></strong> — the raw SVG source (a peer dependency). Every icon exists
				on disk as <code>name_size_variant.svg</code>, e.g. <code>home_24_regular.svg</code>.
			</li>
			<li>
				<strong>The <code>svelteFluentUI()</code> Vite plugin</strong> — at build time it scans your project for
				<code>&lt;Icon&gt;</code> usage, resolves the exact <code>name</code> / <code>size</code> / <code>variant</code>
				tuples you actually render, and generates a <code>virtual:fluentui-icons</code> module containing just those.
			</li>
			<li>
				<strong>The <code>Icon</code> component</strong> — imports that virtual module, so icons travel through Vite's
				normal <code>/_app/*</code> output. There is <em>no</em> runtime <code>/node_modules/…</code> request.
			</li>
		</ol>
		<p>Two delivery modes, chosen via <code>svelteFluentUI(&#123; iconsMode &#125;)</code>:</p>
		<ul>
			<li><strong><code>inline</code> (default):</strong> each used icon's SVG is baked into a shared, cached JS chunk. No runtime request.</li>
			<li><strong><code>asset</code>:</strong> each used icon is emitted as a hashed file under <code>/_app/*</code> and fetched on demand — smaller bundle, one cached request per rendered icon.</li>
		</ul>
		<p class="note">
			<strong>The consequence to internalise:</strong> an icon that the plugin doesn't know about is <em>not in the
			bundle</em>. It won't 404 loudly — it simply renders blank. Everything below is about making sure the plugin knows.
		</p>
	</Card>

	<!-- ============================================================ -->
	<Card>
		<h2>What you're expected to do</h2>
		<p>Minimum setup in a consuming app:</p>
		<ol>
			<li>
				Install the peer dependency:
				<pre><code>npm install @fluentui/svg-icons</code></pre>
			</li>
			<li>
				Add the plugin to <code>vite.config.ts</code>:
				<pre><code>{`import { svelteFluentUI } from 'svelte-fluentui/vite'

export default defineConfig({
  plugins: [svelte(), svelteFluentUI()]
})`}</code></pre>
			</li>
			<li>
				Use icons with <strong>static string names wherever possible</strong> — that's all the plugin needs to detect them:
				<pre><code>{`<Icon name="home" />
<Icon name="settings" size={20} variant="filled" />`}</code></pre>
			</li>
			<li>
				For any icon whose name the plugin <em>can't</em> read statically (see below), list it in
				<code>fluentui-icons.config.json</code> or the <code>iconsInclude</code> option.
			</li>
		</ol>
		<p>
			That's the whole contract: <strong>prefer literal names; declare the ones the scanner can't see.</strong>
		</p>
	</Card>

	<!-- ============================================================ -->
	<Card>
		<h2>What the scanner detects — and what it can't</h2>
		<p>Detection is a regex scan of your source files (default extensions <code>.svelte</code>, <code>.ts</code>, <code>.js</code>). It is deliberately conservative to avoid bundling phantom icons.</p>

		<h3>✅ Detected automatically</h3>
		<pre><code>{`<!-- Static string literals (name + optional size/variant) -->
<Icon name="home" />
<Icon name="settings" size={24} />
<Icon name='arrow_left' variant="filled" />

<!-- Quoted literals inside a dynamic expression (ternary, concatenation) -->
<Icon name={isActive ? "star_filled" : "star"} />
<Icon name={"home" + suffix} />

<!-- Object literals using the icon: / iconName: convention -->
const items = [
  { icon: "home", label: "Home" },
  { iconName: "settings", label: "Settings" }
]`}</code></pre>
		<p class="note">
			The scanner reads <code>size</code> / <code>variant</code> per tag, so only the tuples you render ship. A tag
			with no <code>size</code> uses the default <strong>24</strong>; a dynamic <code>size=&#123;expr&#125;</code> falls
			back to all configured sizes. Note it matches <code>icon:</code> / <code>iconName:</code> but deliberately
			<em>not</em> a bare <code>name:</code> (that collides with unrelated object literals and would pull in phantom icons).
		</p>

		<h3>❌ NOT detected — must be declared</h3>
		<p>Any name with no literal string to read:</p>
		<pre><code>{`<!-- Bare variable / prop -->
<Icon name={iconName} />

<!-- Template interpolation -->
<Icon name={\`arrow_\${direction}\`} />

<!-- Data-driven value from an array/API -->
{#each rows as row}
  <Icon name={row.icon} />
{/each}`}</code></pre>
		<p>Declare these via the config file (below) or the plugin option:</p>
		<pre><code>{`svelteFluentUI({
  iconsInclude: ['arrow_up', 'arrow_down', { name: 'history', sizes: [16] }]
})`}</code></pre>
	</Card>

	<!-- ============================================================ -->
	<Card>
		<h2>Library-internal icons (auto-detected)</h2>
		<p>
			Some <code>svelte-fluentui</code> components render icons <em>themselves</em> — for example the
			<strong>QuickGrid row toolbar</strong>, whose predefined actions draw <code>add</code>, <code>delete</code>,
			<code>copy</code>, <code>arrow_up</code>, and <code>arrow_down</code>. Those <code>&lt;Icon&gt;</code> usages live
			<em>inside the library package</em>, and the project scan skips <code>node_modules</code> — so historically they
			never got bundled and the toolbar rendered as an <strong>empty row</strong> unless you happened to hand-list every
			glyph.
		</p>
		<p>
			The plugin now <strong>also scans its own <code>components</code> directory</strong> (located relative to the
			plugin file, so it works from a published install and from source in dev) and merges those internal icons into the
			bundle automatically. The whole library statically references only a handful of icons, so the cost is negligible.
			This is on by default; opt out with:
		</p>
		<pre><code>{`svelteFluentUI({ iconsScanLibrary: false })`}</code></pre>
		<p class="note">
			<strong>In short:</strong> you no longer need to hand-list QuickGrid toolbar icons (<code>add</code>,
			<code>delete</code>, <code>copy</code>, <code>arrow_up</code>, <code>arrow_down</code>, <code>info</code>) in your
			app's config — they come for free.
		</p>
	</Card>

	<!-- ============================================================ -->
	<Card>
		<h2>The <code>fluentui-icons.config.json</code> file</h2>
		<p>
			The config file is your <strong>allowlist for icons the scanner can't see</strong> — computed names, data-driven
			values, or icons passed as props into third-party components. The plugin auto-detects any of these in your project
			root:
		</p>
		<ul>
			<li><code>fluentui-icons.config.json</code></li>
			<li><code>fluentui-icons.config.js</code></li>
			<li><code>fluentui-icons.config.ts</code></li>
		</ul>

		<h3>JSON format</h3>
		<pre><code>{`{
  "sizes": [16, 20, 24],
  "variants": ["regular", "filled"],
  "icons": [
    "align_left",
    "database",
    "arrow_swap",
    { "name": "history", "sizes": [16] },
    { "name": "star", "sizes": [16, 20], "variants": ["regular"] }
  ]
}`}</code></pre>

		<h3>The three fields</h3>
		<ul>
			<li>
				<strong><code>icons</code></strong> — the list. Each entry is either a <strong>bare name</strong> (bundles every
				configured size/variant) or an <strong>object</strong> <code>&#123; name, sizes?, variants? &#125;</code> that
				<em>caps</em> that specific icon (including its auto-detected usage).
			</li>
			<li>
				<strong><code>sizes</code></strong> — the fallback sizes bundled for any icon whose size can't be determined
				statically (chiefly data-driven <code>{`<Icon name={row.icon} />`}</code>). This is the single biggest lever on
				bundle size: without it such an icon pulls <em>every</em> size. Statically-sized usages
				(<code>{`<Icon name="star" size={48} />`}</code>) are always bundled at their exact size regardless.
			</li>
			<li>
				<strong><code>variants</code></strong> — same idea for <code>regular</code> / <code>filled</code>.
			</li>
		</ul>
		<p class="note">
			<code>sizes</code> / <code>variants</code> mirror the plugin's <code>iconsSizes</code> / <code>iconsVariants</code>
			options; an explicit plugin option wins over the config file.
		</p>

		<h3>JS / TS format</h3>
		<pre><code>{`// fluentui-icons.config.js — array shorthand
export default ['align_left', 'database', 'arrow_swap']

// …or the object form with defaults
export const icons = [{ name: 'history', sizes: [16] }]`}</code></pre>

		<h3>Do I still need to list a name that also appears statically?</h3>
		<p>
			No. If <code>{`<Icon name="database" />`}</code> appears literally anywhere in <em>your</em> source, it's
			auto-detected — listing it again is harmless but redundant. The config file is for the names the scanner
			<em>cannot</em> read.
		</p>
	</Card>

	<!-- ============================================================ -->
	<Card>
		<h2>Custom (non-FluentUI) icons in library toolbars</h2>
		<p>
			The whole detection story is about FluentUI icons. When you want a <strong>Font Awesome glyph, an inline SVG, or
			any other markup</strong> in a QuickGrid row toolbar, the FluentUI pipeline doesn't apply at all — pass an
			<code>iconSnippet</code> on the toolbar item and render whatever you like. It takes precedence over the
			<code>icon</code> name.
		</p>

		<div class="demo">
			{#snippet flagIcon()}
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path d="M3 1.5v13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
					<path d="M3 2.5h8.2l-1.6 2.6 1.6 2.6H3z" fill="var(--accent-fill-rest, #0f6cbd)" stroke="var(--accent-fill-rest, #0f6cbd)" stroke-width="1.2" stroke-linejoin="round" />
				</svg>
			{/snippet}

			{#snippet trashIcon()}
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path d="M2.5 4h11M6 4V2.8h4V4M4 4l.6 8.4a1 1 0 0 0 1 .9h4.8a1 1 0 0 0 1-.9L12 4M6.4 6.5v4.5M9.6 6.5v4.5"
						stroke="var(--error, #c50f1f)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			{/snippet}

			<QuickGrid
				items={demoItems}
				columns={demoColumns}
				showRowToolbar
				rowToolbar={[
					{id: "flag", title: "Flag row", iconSnippet: flagIcon, onclick: ({row}: {row: DemoRow}) => { lastAction = `Flagged: ${row.name}` }},
					{id: "delete", title: "Delete row", danger: true, iconSnippet: trashIcon, onclick: ({row}: {row: DemoRow}) => { lastAction = `Deleted: ${row.name}` }}
				]}
			/>
			<p style="margin-top: 1rem; padding: 0.5rem 0.75rem; background: var(--neutral-layer-2); border-radius: 4px;">
				{lastAction}
			</p>
		</div>

		<h3>Code</h3>
		<pre><code>{`<script lang="ts">
  import { QuickGrid } from 'svelte-fluentui'
  let items = $state([ /* … */ ])
<\/script>

<!-- Any markup you want — Font Awesome, inline SVG, an <img>, … -->
{#snippet trashIcon()}
  <i class="fa-solid fa-trash"></i>
{/snippet}

<QuickGrid
  {items}
  {columns}
  showRowToolbar
  rowToolbar={[
    { id: 'delete', title: 'Delete', danger: true,
      iconSnippet: trashIcon,
      onclick: ({ row }) => remove(row) }
  ]}
/>`}</code></pre>
		<p class="note">
			<code>icon</code> (a FluentUI name) becomes optional when you supply <code>iconSnippet</code>. Predefined string
			items (<code>'add'</code>, <code>'delete'</code>, …) and <code>icon:</code>-based items keep working unchanged.
		</p>
	</Card>

	<!-- ============================================================ -->
	<Card>
		<h2>Troubleshooting: a blank icon or an empty toolbar</h2>
		<p>An icon rendering as empty space almost always means the plugin never bundled it. Walk this checklist:</p>
		<ol>
			<li>
				<strong>Is the name a literal string?</strong> <code>{`<Icon name="database" />`}</code> is detected;
				<code>{`<Icon name={someVar} />`}</code> is not. If it's dynamic, add it to
				<code>fluentui-icons.config.json</code>.
			</li>
			<li>
				<strong>Right size?</strong> Not every icon exists in every size. If <code>{`<Icon name="x" size={48} />`}</code>
				is blank, try 24 (the widest coverage) or check the source set.
			</li>
			<li>
				<strong>Correct snake_case name?</strong> Icons are <code>snake_case</code> (<code>arrow_left</code>,
				<code>checkmark_circle</code>). Verify against the
				<a href="https://react.fluentui.dev/?path=/docs/icons-catalog--docs" target="_blank" rel="noopener">FluentUI Icon Catalog</a>.
			</li>
			<li>
				<strong>Empty QuickGrid toolbar?</strong> On current versions this is auto-fixed by
				<code>iconsScanLibrary</code>. If you're on an older build, hand-list <code>add</code>, <code>delete</code>,
				<code>copy</code>, <code>arrow_up</code>, <code>arrow_down</code> in the config — or upgrade.
			</li>
			<li>
				<strong>Still stuck?</strong> Run the plugin with <code>svelteFluentUI(&#123; verbose: true &#125;)</code> to log
				exactly which icons were detected and bundled.
			</li>
		</ol>
		<p>
			See the <a href="/components/icon">Icon component page</a> for the full prop reference and the complete list of
			plugin options.
		</p>
	</Card>
</Stack>

<style>
	.description {
		color: var(--neutral-foreground-hint);
		max-width: 70ch;
	}

	.note {
		padding: 0.75rem 1rem;
		background: var(--neutral-layer-2);
		border-left: 3px solid var(--accent-fill-rest);
		border-radius: 4px;
		margin: 0.75rem 0;
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

	a {
		color: var(--accent-foreground-rest);
	}

	a:hover {
		text-decoration: underline;
	}
</style>
