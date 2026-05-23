<script lang="ts">
	import {
		fluentAnchor,
		fluentTextField,
		fluentButton,
		provideFluentDesignSystem
	} from "@fluentui/web-components";
	import {Meta} from "$lib/components";

	provideFluentDesignSystem().register(
		fluentAnchor(),
		fluentTextField(),
		fluentButton()
	);

	let name = "";
	let email = "";

	function handleSubmit() {
		alert(`Submitted: ${name} (${email})`);
	}
</script>

<style>
	:global(body) {
		margin: 0;
		font-family: Arial, sans-serif;
	}

	nav {
		background-color: #0078d4;
		color: white;
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.layout {
		display: flex;
		height: calc(100vh - 60px); /* 60px = nav height */
	}

	.sidebar {
		width: 200px;
		background-color: #f3f2f1;
		padding: 1rem;
		box-shadow: inset -1px 0 0 #ddd;
	}

	.sidebar fluent-anchor {
		display: block;
		margin-bottom: 1rem;
		color: #333;
		text-decoration: none;
	}

	main {
		flex-grow: 1;
		padding: 2rem;
		overflow-y: auto;
	}

	form fluent-text-field {
		display: block;
		margin-bottom: 1rem;
		max-width: 400px;
	}
</style>

<Meta
	title="Pages Demo"
	description="Sample page layout built directly on the FluentUI web components to demonstrate basic navigation, sidebar, and form usage."
	keywords="svelte, fluentui, demo, page layout, sidebar, form"
/>

<!-- Top Navigation -->
<nav>
	<div>🌐 My Fluent Site</div>
	<fluent-anchor href="#">Home</fluent-anchor>
</nav>

<!-- Layout: Sidebar + Main -->
<div class="layout">
	<!-- Sidebar -->
	<aside class="sidebar">
		<fluent-anchor href="#">Dashboard</fluent-anchor>
		<fluent-anchor href="#">Profile</fluent-anchor>
		<fluent-anchor href="#">Settings</fluent-anchor>
		<fluent-anchor href="#">Help</fluent-anchor>
	</aside>

	<!-- Main Content -->
	<main>
		<h1>Contact Us</h1>
		<form on:submit|preventDefault={handleSubmit}>
			<fluent-text-field
				placeholder="Your Name"
				value={name}
			></fluent-text-field>

			<fluent-text-field
				type="email"
				placeholder="Your Email"
				value={email}
			></fluent-text-field>

			<fluent-button appearance="accent" type="submit">Submit</fluent-button>
		</form>
	</main>
</div>
