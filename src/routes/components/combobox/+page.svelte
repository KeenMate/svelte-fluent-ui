<script lang="ts">
	import { onMount } from "svelte";

	import Combobox from "$lib/components/Combobox.svelte";
	import { Option } from "$lib/index.js";

	const stOptions = [
		{ value: "ds9", label: "Deep Space 9" },
		{ value: "voy", label: "Voyager" },
		{ value: "ent", label: "Enterprise" },
		{ value: "tng", label: "The Next generation" },
		{ value: "tos", label: "The Original series", disabled: true }
	];

	let value = $state("");
	let value1 = $state("");
	let combobox1: HTMLElement;
</script>

<div class="header">
	<h1>Combobox</h1>
</div>

<div class="content">
	<div class="pure-g">
		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2>Members</h2>

			<table class="pure-table member-table">
				<tbody>
					<tr class="property">
						<td colspan="5">Members</td>
					</tr>
					<tr class="property">
						<td></td>
						<td>appearance</td>
						<td>string</td>
						<td>undefined</td>
						<td></td>
					</tr>
					<tr class="property">
						<td></td>
						<td>autocomplete</td>
						<td>any</td>
						<td>undefined</td>
						<td></td>
					</tr>
					<tr class="property">
						<td></td>
						<td>autofocus</td>
						<td>any</td>
						<td>undefined</td>
						<td></td>
					</tr>
					<tr class="property">
						<td></td>
						<td>currentValue</td>
						<td>any</td>
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
						<td>name</td>
						<td>string</td>
						<td>undefined</td>
						<td></td>
					</tr>
					<tr class="property">
						<td></td>
						<td>open</td>
						<td>boolean</td>
						<td>undefined</td>
						<td></td>
					</tr>
					<tr class="property">
						<td></td>
						<td>options</td>
						<td>OptionItem[]</td>
						<td>undefined</td>
						<td></td>
					</tr>
					<tr class="property">
						<td></td>
						<td>placeholder</td>
						<td>string</td>
						<td>undefined</td>
						<td></td>
					</tr>
					<tr class="property">
						<td></td>
						<td>position</td>
						<td>string</td>
						<td>undefined</td>
						<td></td>
					</tr>
					<tr class="property">
						<td></td>
						<td>readonly</td>
						<td>boolean</td>
						<td>undefined</td>
						<td></td>
					</tr>
					<tr class="property">
						<td></td>
						<td>required</td>
						<td>boolean</td>
						<td>undefined</td>
						<td></td>
					</tr>
					<tr class="property">
						<td></td>
						<td>value</td>
						<td>SelectedValue</td>
						<td>bindable</td>
						<td>bindable</td>
					</tr>

					<tr class="slot">
						<td colspan="5">Slots</td>
					</tr>
					<tr class="slot">
						<td></td>
						<td>children</td>
						<td>SlotType</td>
						<td>undefined</td>
						<td></td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2 class="content-subhead">Actions</h2>
			<table class="pure-table member-table">
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
		</div>
	</div>

	<h2 class="content-subhead">Examples</h2>

	<h3>Plain combobox with static options</h3>
	<p>
		<Combobox
			bind:this={combobox1}
			bind:value
			placeholder="Do you feel lucky, punk?"
		>
			<Option value="yes">YES!</Option>
			<Option value="no">no..</Option>
			<Option value="what?">What?</Option>
		</Combobox>
		Selected value: {value}
	</p>

	<h3>Plain combobox with array options</h3>
	<p>
		<Combobox
			bind:value={value1}
			placeholder="Best StarTrek series?"
			options={stOptions}
		></Combobox>
		Selected value: {value1}
	</p>
</div>
