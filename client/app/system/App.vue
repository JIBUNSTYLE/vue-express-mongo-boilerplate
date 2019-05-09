<template lang="pug">
	div
		page-header(:toggle-sidebar="toggleSidebar")
		sidebar(:minimized="miniSidebar")
		section.app-main(:class="{ miniSidebar: miniSidebar }")
			router-view(keep-alive)
</template>
<script>
	import Vue from "vue";

	import PageHeader from "./components/organisms/header";
	import Sidebar from "./components/organisms/sidebar";
	
	export default {

		components: {
			PageHeader
			, Sidebar
		}
		, data() {
			return {
				miniSidebar: false
			};
		}
		, watch: {
			$lng() {
				console.log("Language updated");
				this.update(this);
			}
		}
		, methods: {
			update: function(vm) {
				if (vm == null)
					return;
				
				let i = vm._watchers.length;
				while (i--)
					vm._watchers[i].update(true);
				
				let children = vm.$children;
				i = children.length;
				while (i--)
					this.update(children[i]);
			}
			, toggleSidebar() {
				this.miniSidebar = !this.miniSidebar;
			}
		}
		, created() {
			console.log("App started!");
			window.app = this;
		}
	};
</script>
<style lang="scss">
	@import "../../scss/style.scss";
</style>