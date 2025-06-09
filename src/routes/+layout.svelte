<script>
	import "../assets/styles/tailwind.css"
	import "../assets/styles/demo-pages.scss"
	import "$lib/main.scss"

	let {children} = $props()
</script>

<!-- Menu toggle -->
<a href="#menu" id="menuLink" class="menu-link">
	<!-- Hamburger icon -->
	<span></span>
</a>

<div id="menu">
	<div class="pure-menu">
		<a class="pure-menu-heading tw:text-center" href="/">Svelte FluentUI</a>
		<ul class="pure-menu-list">
			<li class="pure-menu-item">
				<a href="/components" class="pure-menu-link">
					Components
				</a>
			</li>
			<li class="pure-menu-item">
				<a href="/components/forms" class="pure-menu-link">Forms</a>
			</li>
			<li class="pure-menu-item">
				<a href="/components/interactive" class="pure-menu-link">Interactive</a>
			</li>
			<!--<li class="pure-menu-item">-->
			<!--	<a href="#about" class="pure-menu-link">About</a>-->
			<!--</li>-->
		</ul>
	</div>
</div>

<div id="main">
	<div class="content">
		{@render children()}
	</div>
</div>
