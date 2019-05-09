<template lang="pug">
	section.page-header
		logo.left
		.menu-toggle.left(@click="toggleSidebar()")
			i.fa.fa-bars
		search-box.left
</template>

<script>
	import Logo from "../atoms/logo";
	import SearchBox from "../atoms/searchbox";

	export default {
		name: "PageHeader"
        , components: {
			Logo
			, SearchBox
		}
		, props: [
			"toggleSidebar"
		]
	};
</script>
<style lang="scss">
</style>