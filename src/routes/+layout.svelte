<script>
	let { children } = $props();
</script>

<nav>
	<a href="/">Home</a>
	<a href="/text-input">Text input</a>
</nav>

{@render children()}