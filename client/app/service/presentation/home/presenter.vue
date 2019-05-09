<template lang="pug">
	home
</template>
<script>
	import Vue from "vue";
	import { mapGetters, mapActions } from "vuex";
 
	import Base from "../mixins/base";
	import Home from "./view";

	const _ = Vue.prototype._;

	export default {
		mixins : [ Base ]
		, components : {
			Home
		}
		, computed : {
			...mapGetters([])
		}
		, data() {
			return { };
		}
		, methods : {
			...mapActions([])
		}
		, created() { }
	};
</script>