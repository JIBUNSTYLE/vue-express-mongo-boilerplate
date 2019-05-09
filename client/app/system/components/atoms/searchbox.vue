<template lang="pug">
	.search-box
		i.fa.fa-search
		input(type="search", v-model="text", :placeholder="_('Search3dots')")
</template>
<script>
	export default {
		name: "SearchBox"
        , computed: {
			text: {
				get() {
					return this.searchText;
				}
				, set(value) {
					this.searching(value);
				}
			}
		}
		, methods: { }
	};
</script>
<style lang="scss">
</style>