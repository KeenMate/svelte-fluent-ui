<script lang="ts">
	import {Paginator} from "$lib/index.js"

	let currentPage = 0
	let lastPage = 9
	let totalItems = 250

	function goFirst() {
		currentPage = 0
	}

	function goPrevious() {
		if (currentPage > 0) currentPage -= 1
	}

	function goNext() {
		if (currentPage < lastPage) currentPage += 1
	}

	function goLast() {
		currentPage = lastPage
	}
</script>

<div class="header">
	<h1>Paginator</h1>
</div>

<div class="content">
	<div class="pure-g">
		<div class="pure-u-1 pure-u-xl-1-2 pure-u-xxl-1-3 pure-u-xxxl-1-4">
			<h2>Members</h2>

			<table class="pure-table member-table">
				<tbody>
					<tr class="property"><td colspan="5">Members</td></tr>
					<tr><td></td><td>class</td><td>string</td><td>""</td><td>Custom CSS classes</td></tr>
					<tr><td></td><td>style</td><td>string</td><td>""</td><td>Custom inline styles</td></tr>
					<tr
						><td></td><td>disabled</td><td>boolean</td><td>false</td><td>Disables the paginator</td
						></tr
					>
					<tr
						><td></td><td>totalItemCount</td><td>number</td><td>undefined</td><td>Total items</td
						></tr
					>
					<tr
						><td></td><td>currentPageIndex</td><td>number</td><td>0</td><td
							>Current page (0-based)</td
						></tr
					>
					<tr
						><td></td><td>lastPageIndex</td><td>number</td><td>0</td><td>Last page (0-based)</td
						></tr
					>
					<tr
						><td></td><td>canGoBack</td><td>boolean</td><td>true</td><td
							>Allow navigating backwards</td
						></tr
					>
					<tr
						><td></td><td>canGoForwards</td><td>boolean</td><td>true</td><td
							>Allow navigating forwards</td
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
					<tr
						><td></td><td>onFirst</td><td>function</td><td>Fires when "go first" is clicked</td></tr
					>
					<tr
						><td></td><td>onPrevious</td><td>function</td><td
							>Fires when "go previous" is clicked</td
						></tr
					>
					<tr><td></td><td>onNext</td><td>function</td><td>Fires when "go next" is clicked</td></tr>
					<tr><td></td><td>onLast</td><td>function</td><td>Fires when "go last" is clicked</td></tr>
				</tbody>
			</table>
		</div>
	</div>

	<h2 class="content-subhead">Slots</h2>

	<table class="pure-table member-table">
		<tbody>
			<tr class="slot"><td colspan="5">Slots</td></tr>
			<tr
				><td></td><td>summaryTemplate</td><td>SlotType</td><td>undefined</td><td
					>Custom summary markup</td
				></tr
			>
			<tr
				><td></td><td>paginationTextTemplate</td><td>SlotType</td><td>undefined</td><td
					>Custom page info markup</td
				></tr
			>
		</tbody>
	</table>

	<h2 class="content-subhead">Examples</h2>

	<h3>Basic paginator</h3>
	<p>
		<Paginator
			totalItemCount={totalItems}
			currentPageIndex={currentPage}
			lastPageIndex={lastPage}
			canGoBack={currentPage > 0}
			canGoForwards={currentPage < lastPage}
			onFirst={goFirst}
			onPrevious={goPrevious}
			onNext={goNext}
			onLast={goLast}
		/>
	</p>

	<h3>Disabled paginator</h3>
	<p>
		<Paginator
			totalItemCount={totalItems}
			currentPageIndex={currentPage}
			lastPageIndex={lastPage}
			disabled={true}
		/>
	</p>
</div>
