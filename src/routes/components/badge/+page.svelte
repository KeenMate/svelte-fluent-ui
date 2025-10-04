<script lang="ts">
	import {Badge, Stack, Grid, GridItem, Card} from "$lib/index.js"
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Badge</h1>

	<Card>
		<p>
			<strong>References:</strong>
			<a href="https://storybooks.fluentui.dev/web-components/?path=/docs/components-badge-badge--docs" target="_blank" rel="noopener noreferrer">FluentUI Web Component</a>
			|
			<a href="https://www.fluentui-blazor.net/Badge" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
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
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2 class="content-subhead">Examples</h2>
		<Badge class="lightweight clickable-badge" appearance="lightweight">
			<span class="badge-content"><!--!-->
				Lightweight
			</span>
		</Badge>

		<Badge
			appearance="accent" class="accent"
		>
			<span class="badge-content">
				<!--!-->
				Accent
			</span>
		</Badge>

		<Badge
			appearance="neutral" class="neutral"
		>
			<span class="badge-content">
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
			<span class="badge-content">
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
			<span class="badge-content">
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
			<span class="badge-content">
				Lowlight
			</span>
		</Badge>
		<Badge style="width: 250px;" appearance="neutral" class="neutral">
			<span class="badge-content large-badge-content">
				Bigger
				<!--!-->
			</span>

		</Badge>
	</Card>
</Stack>

<style>
	.clickable-badge {
		cursor: pointer;
	}

	.badge-content {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		white-space: nowrap;
	}

	.large-badge-content {
		height: 250px;
	}
</style>
