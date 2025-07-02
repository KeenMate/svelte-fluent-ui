<script lang="ts">
	import {Toolbar, Button} from "$lib/index.js"
</script>

<div class="header">
	<h1>Toolbar</h1>
</div>

<div class="content">
	<div class="pure-g">
		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2>Members</h2>

			<table class="pure-table member-table">
				<tbody>
					<tr class="property"><td colspan="5">Members</td></tr>
					<tr><td></td><td>id</td><td>string</td><td>undefined</td><td>Unique identifier</td></tr>
					<tr><td></td><td>class</td><td>string</td><td>""</td><td>CSS class for styling</td></tr>
					<tr><td></td><td>style</td><td>string</td><td>""</td><td>Inline styles</td></tr>
					<tr
						><td></td><td>orientation</td><td>"horizontal" | "vertical"</td><td>"horizontal"</td><td
							>Toolbar layout direction</td
						></tr
					>
				</tbody>
			</table>
		</div>

		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2 class="content-subhead">Actions</h2>

			<table class="pure-table member-table">
				<tbody>
					<tr class="action"><td colspan="4">Actions</td></tr>
					<tr>
						<td colspan="4">None</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<h2 class="content-subhead">Slots</h2>

	<table class="pure-table member-table">
		<tbody>
			<tr class="slot"><td colspan="5">Slots</td></tr>
			<tr
				><td></td><td>children</td><td>SlotType</td><td>undefined</td><td
					>Elements to include in the toolbar (e.g., buttons, icons)</td
				></tr
			>
		</tbody>
	</table>

	<h2 class="content-subhead">Examples</h2>

	<h3>Basic toolbar</h3>
	<p>
		<Toolbar>
			<Button>First</Button>
			<Button>Second</Button>
		</Toolbar>
	</p>

	<h3>Vertical toolbar</h3>
	<p>
		<Toolbar orientation="vertical">
			<Button>First</Button>
			<Button>Second</Button>
		</Toolbar>
	</p>
</div>
