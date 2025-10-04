<script lang="ts">
	import {Button, Stack, Grid, GridItem, Card} from "$lib/index.js"

	let count = $state(0)

	function onButtonClick(ev: MouseEvent) {
		console.log("🚀 ~ onClicked ~ ev:", ev.target.checked)
		count += 1
	}
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Button</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-button-button--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Button" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Members</h2>
				<table class="member-table">
				<tbody>
				<tr class="property">
					<td colspan="5">Members</td>
				</tr>
				<tr class="property">
					<td></td>
					<td>appearance</td>
					<td>boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>autofocus</td>
					<td>boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>disabled</td>
					<td>boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>form</td>
					<td>boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>formaction</td>
					<td>boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>formenctype</td>
					<td>boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>formmethod</td>
					<td>boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>formnovalidate</td>
					<td>boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>formtarget</td>
					<td>boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>name</td>
					<td>boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>type</td>
					<td>boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>value</td>
					<td>boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>start</td>
					<td>boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="property">
					<td></td>
					<td>end</td>
					<td>boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>

				<tr class="callback">
					<td colspan="5">Callbacks</td>
				</tr>
				<tr class="callback">
					<td></td>
					<td>checkValidity</td>
					<td>() => boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="callback">
					<td></td>
					<td>onClick</td>
					<td>(ev: PointerEvent) => void</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="callback">
					<td></td>
					<td>reportValidity</td>
					<td>() => boolean</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="callback">
					<td></td>
					<td>setCustomValidity</td>
					<td>(message: string) => any</td>
					<td>undefined</td>
					<td></td>
				</tr>
				<tr class="callback">
					<td></td>
					<td>setValidity</td>
					<td>(flags: any, message: any, anchor: any) => void</td>
					<td>undefined</td>
					<td></td>
				</tr>

				<tr class="slot">
					<td colspan="5">Slots</td>
				</tr>
				<tr class="slot">
					<td></td>
					<td>children</td>
					<td>any</td>
					<td>undefined</td>
					<td></td>
				</tr>
				</tbody>
			</table>
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2 class="content-subhead">Actions</h2>
				<table class="member-table">
				<tbody>
				<tr class="action">
					<td colspan="4">Actions</td>
				</tr>
				<tr class="action">
					<td></td>
					<td>select</td>
					<td>() => void;</td>
					<td></td>
				</tr>
				<tr class="action">
					<td></td>
					<td>checkValidity</td>
					<td>() => boolean;</td>
					<td></td>
				</tr>
				<tr class="action">
					<td></td>
					<td>reportValidity</td>
					<td>() => boolean;</td>
					<td></td>
				</tr>
				<tr class="action">
					<td></td>
					<td>setCustomValidity</td>
					<td>(message: string) => any;</td>
					<td></td>
				</tr>
				<tr class="action">
					<td></td>
					<td>setValidity</td>
					<td>(flags: any, message: any, anchor: any) => void;</td>
					<td></td>
				</tr>
				<tr class="action">
					<td></td>
					<td>setSelectionRange</td>
					<td
					>(start: number, end: number, direction?: "forward" | "backward" |
						"none") => void;
					</td>
					<td></td>
				</tr>
				</tbody>
			</table>
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2 class="content-subhead">Examples</h2>
		<Button onClick={onButtonClick}>
			Click me ({count})
		</Button>
		<Button appearance="custom" onClick={() => count = 0}>
			Reset
		</Button>
	</Card>
</Stack>
