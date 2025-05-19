<script>
	let {children} = $props()
</script>

<!-- Menu toggle -->
<a href="#menu" id="menuLink" class="menu-link">
	<!-- Hamburger icon -->
	<span></span>
</a>

<div id="menu">
	<div class="pure-menu">
		<a class="pure-menu-heading" href="/">List of components</a>
		<ul class="pure-menu-list">
			<li class="pure-menu-item">
				<a href="/text-input" class="pure-menu-link">Text input</a>
			</li>
			<li class="pure-menu-item">
				<a href="#about" class="pure-menu-link">About</a>
			</li>

			<li class="pure-menu-item menu-item-divided pure-menu-selected">
				<a href="#" class="pure-menu-link">Services</a>
			</li>

			<li class="pure-menu-item">
				<a href="#contact" class="pure-menu-link">Contact</a>
			</li>
		</ul>
	</div>
</div>

<div id="main">

	{@render children()}

</div>
