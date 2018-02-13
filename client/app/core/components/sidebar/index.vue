<template lang="pug">
	aside.nav(:class="{ mini: minimized }")
		.menu
			.title {{ "General" | i18n }}
			ul
				router-link(tag="li", to="/")
					a(:title="_('Home')")
						span.icon
							i.fa.fa-home
						span.label {{ "Home" | i18n }}

			.title {{ "Profile" | i18n }}
			ul
				li
					a(href="/logout", :title="_('Logout')")
						span.icon
							i.fa.fa-sign-out
						span.label {{ "Logout" | i18n }}

		.footer
			.social
				a(href="", target="_blank")
					i.fa.fa-facebook
				a(href="", target="_blank")
					i.fa.fa-twitter
				a(href="https://github.com/JIBUNSTYLE/vue-express-mongo-boilerplate", target="_blank")
					i.fa.fa-github
			.copyright &copy; Copyright, 2018
</template>

<script>

	export default {
		name: "Sidebar"
        , props: [
			"minimized"
		]
	};
	
</script>

<style lang="scss">
</style>