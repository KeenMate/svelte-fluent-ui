<script lang="ts">
	import {Checkbox, Stack, Card} from "svelte-fluentui";

	// Default examples
	let apples = $state(true);
	let bananas = $state(true);
	let oranges = $state(false);

	// Three states examples
	let threeStateTrue = $state(true);
	let threeStateFalse = $state(false);
	let threeStateIndeterminate = $state<boolean | null>(null);

	// Three states list
	let projectChecked = $state(true);
	let executableChecked = $state(true);
	let containerChecked = $state(true);

	// Computed "All" checkbox state
	let allChecked = $derived.by(() => {
		const items = [projectChecked, executableChecked, containerChecked];
		const allTrue = items.every(item => item === true);
		const allFalse = items.every(item => item === false);

		if (allTrue) return true;
		if (allFalse) return false;
		return null; // indeterminate
	});

	// Handler for "All" checkbox click
	function handleAllClick() {
		if (allChecked === true) {
			// If all checked, uncheck all
			projectChecked = false;
			executableChecked = false;
			containerChecked = false;
		} else {
			// If any unchecked or indeterminate, check all
			projectChecked = true;
			executableChecked = true;
			containerChecked = true;
		}
	}

</script>

<h1>Checkbox</h1>

<h2>Examples</h2>

<!-- Default checkbox examples -->
<Card>
	<h3>Default checkbox examples</h3>

	<div style="margin-bottom: 2rem;">
		<h4>Horizontal</h4>
		<Stack orientation="horizontal" gap="1rem" style="flex-wrap: wrap;">
			<Checkbox bind:checked={apples}>Apples</Checkbox>
			<Checkbox checked={true} disabled>Bananas (disabled)</Checkbox>
			<Checkbox bind:checked={oranges}>Oranges</Checkbox>
		</Stack>
	</div>

	<div>
		<h4>Vertical</h4>
		<Stack orientation="vertical" gap="0.5rem">
			<Checkbox bind:checked={apples}>Apples</Checkbox>
			<Checkbox checked={true} disabled>Bananas (disabled)</Checkbox>
			<Checkbox bind:checked={oranges}>Oranges</Checkbox>
		</Stack>
	</div>
</Card>

<!-- Three States -->
<Card>
	<h3>Three States</h3>

	<Stack orientation="vertical" gap="1rem">
		<div>
			<Checkbox bind:checked={threeStateTrue} withIntermediate>
				ThreeState = true
			</Checkbox>
			<span style="margin-left: 1rem;">Value = {threeStateTrue} - CheckState = {threeStateTrue === null ? 'null' : threeStateTrue}</span>
		</div>

		<div>
			<Checkbox bind:checked={threeStateFalse} withIntermediate>
				ThreeState = false
			</Checkbox>
			<span style="margin-left: 1rem;">Value = {threeStateFalse}</span>
		</div>

		<div>
			<Checkbox bind:checked={threeStateIndeterminate} withIntermediate>
				ShowIndeterminate = false
			</Checkbox>
			<span style="margin-left: 1rem;">Value = {threeStateIndeterminate} - CheckState = {threeStateIndeterminate === null ? 'null (Indeterminate)' : threeStateIndeterminate}</span>
		</div>
	</Stack>
</Card>

<!-- Three States List -->
<Card>
	<h3>Three States List</h3>

	<Stack orientation="vertical" gap="0.5rem">
		<Checkbox checked={allChecked} withIntermediate onclick={handleAllClick}>
			All ({allChecked === null ? 'Indeterminate' : allChecked ? 'True' : 'False'})
		</Checkbox>
		<div style="margin-left: 1.5rem;">
			<Stack orientation="vertical" gap="0.5rem">
				<Checkbox bind:checked={projectChecked}>Project ({projectChecked})</Checkbox>
				<Checkbox bind:checked={executableChecked}>Executable ({executableChecked})</Checkbox>
				<Checkbox bind:checked={containerChecked}>Container ({containerChecked})</Checkbox>
			</Stack>
		</div>
	</Stack>
</Card>

<style>
	h1 {
		font-size: 2rem;
		margin: 0 0 2rem 0;
		font-weight: 600;
	}

	h2 {
		font-size: 1.5rem;
		margin: 2rem 0 1rem 0;
		font-weight: 600;
	}

	h3 {
		font-size: 1.25rem;
		margin: 0 0 1rem 0;
		font-weight: 600;
	}

	h4 {
		font-size: 1rem;
		margin: 0 0 0.75rem 0;
		font-weight: 600;
	}
</style>
