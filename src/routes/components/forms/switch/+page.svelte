<script lang="ts">
	import { Switch } from "$lib";
	let switchState = false;
</script>

<div class="header">
	<h1>Switch</h1>
</div>

<div class="content">
	<div class="pure-g">
		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2>Members</h2>

			<table class="pure-table member-table">
				<tbody>
					<tr class="property"><td colspan="5">Members</td></tr>
					<tr><td></td><td>ariaLabel</td><td>string</td><td>undefined</td><td>Accessibility label</td></tr>
					<tr><td></td><td>checked</td><td>boolean</td><td>false</td><td>Whether switch is on</td></tr>
					<tr><td></td><td>checkedMessage</td><td>string</td><td>undefined</td><td>Message when checked</td></tr>
					<tr><td></td><td>class</td><td>string</td><td>""</td><td></td></tr>
					<tr><td></td><td>disabled</td><td>boolean</td><td>undefined</td><td>Disables the switch</td></tr>
					<tr><td></td><td>id</td><td>string</td><td>undefined</td><td></td></tr>
					<tr><td></td><td>label</td><td>string</td><td>undefined</td><td>Visible label</td></tr>
					<tr><td></td><td>name</td><td>string</td><td>undefined</td><td>Form name</td></tr>
					<tr><td></td><td>readonly</td><td>boolean</td><td>undefined</td><td>Prevents user changes</td></tr>
					<tr><td></td><td>required</td><td>boolean</td><td>undefined</td><td>Required for form submission</td></tr>
					<tr><td></td><td>style</td><td>string</td><td>""</td><td>Custom CSS</td></tr>
					<tr><td></td><td>uncheckedMessage</td><td>string</td><td>undefined</td><td>Message when unchecked</td></tr>
				</tbody>
			</table>
		</div>

		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2 class="content-subhead">Actions</h2>

			<table class="pure-table member-table">
				<tbody>
					<tr class="action"><td colspan="4">Actions</td></tr>
					<tr>
						<td></td>
						<td>onChange</td>
						<td>function</td>
						<td>Fires when the checked state changes</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<h2 class="content-subhead">Slots</h2>

	<table class="pure-table member-table">
		<tbody>
			<tr class="slot"><td colspan="5">Slots</td></tr>
			<tr><td></td><td>children</td><td>SlotType</td><td>undefined</td><td>Additional content</td></tr>
			<tr><td></td><td>labelTemplate</td><td>SlotType</td><td>undefined</td><td>Custom label markup</td></tr>
			<tr><td></td><td>checked-message</td><td>string</td><td>undefined</td><td>Message when on</td></tr>
			<tr><td></td><td>unchecked-message</td><td>string</td><td>undefined</td><td>Message when off</td></tr>
		</tbody>
	</table>

	<h2 class="content-subhead">Examples</h2>

	<h3>Basic switch</h3>
	<p>
		<Switch label="Enable notifications" />
	</p>

	<h3>Switch with messages</h3>
	<p>
		<Switch
			label="Send notifications?"
			checkedMessage="Yes"
			uncheckedMessage="No"
		/>
	</p>

	<h3>Disabled switch</h3>
	<p>
		<Switch label="Unavailable option" disabled={true} checked={true} />
	</p>

	<h3>Controlled switch</h3>
	<p>
		<Switch label="Custom toggle" bind:checked={switchState} onChange={(val) => switchState = val} />
		<br />
		State: {switchState ? "ON" : "OFF"}
	</p>
</div>
