<script lang="ts">
	import {Badge} from "$lib/index.js"
</script>

<div class="header">
	<h1>Badge</h1>
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
					<td>color</td>
					<td>boolean</td>
					<td>undefined</td>
					<td></td>
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
					<td>circular</td>
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
		</div>
	</div>

	<h2 class="content-subhead">Examples</h2>
	<p>
		<Badge style="cursor: pointer;" appearance="lightweight" class="lightweight">
			<span
				style="width: 100%; display: flex; align-items: center; justify-content: center; white-space: nowrap;"
			><!--!-->
				Lightweight
			</span>
		</Badge>

		<Badge
			appearance="accent" class="accent"
		>
			<span style="width: 100%; display: flex; align-items: center; justify-content: center; white-space: nowrap;">
				<!--!-->
				Accent
			</span>
		</Badge>

		<Badge
			appearance="neutral" class="neutral"
		>
			<span style="width: 100%; display: flex; align-items: center; justify-content: center; white-space: nowrap;">
				<!--!-->
				Neutral
			</span>
		</Badge>

		<Badge
			style="--badge-fill-somevalue: red; --badge-color-somevalue: white;"
			appearance="neutral"
			fill="somevalue"
			color="somevalue"
			class="neutral"
		>
			<span style="width: 100%; display: flex; align-items: center; justify-content: center; white-space: nowrap;">
				Red
				and White
			</span>
		</Badge>
		<Badge
			style="--badge-fill-highlight: #ffd800; --badge-color-highlight: #000;"
			appearance="neutral"
			fill="highlight"
			color="highlight"
			class="neutral"
		>
			<span style="width: 100%; display: flex; align-items: center; justify-content: center; white-space: nowrap;">
				Highlight
			</span>
		</Badge>
		<Badge
			style="--badge-fill-lowlight: #000; --badge-color-lowlight: #fff;"
			appearance="neutral"
			fill="lowlight"
			color="lowlight"
			class="neutral"
		>
			<span style="width: 100%; display: flex; align-items: center; justify-content: center; white-space: nowrap;">
				Lowlight
			</span>
		</Badge>
		<Badge style="width: 250px;" appearance="neutral" class="neutral">
			<span style="height: 250px; width: 100%; display: flex; align-items: center; justify-content: center; white-space: nowrap;">
				Bigger
				<!--!-->
			</span>

		</Badge>
	</p>
</div>
