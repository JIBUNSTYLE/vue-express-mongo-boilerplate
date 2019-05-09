<template lang="pug">
	.container
		.flex.align-center.justify-space-around
			.left
				button.button.is-primary(@click="")
					i.icon.fa.fa-plus 
					| {{ _("AddProject") }}
</template>
<script>
	import Vue from "vue";
	import Base from "../mixins/base";
	const _ = Vue.prototype._;

	export default {
		name : "Home"
		, mixins : [ Base ]
		, components : { }
		, computed : { }
		, data() {
			return { };
		}
		, methods : { }
		, created() { }
		, sessionEnsured(me) { }
	};
</script>