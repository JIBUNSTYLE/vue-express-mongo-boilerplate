<template lang="pug">
	.container
		.flex.align-center.justify-space-around
			.left
				button.button.is-primary(@click="checkTask")
					i.icon.fa.fa-plus 
					| {{  _("Check") }}
</template>

<script>
	import Vue from "vue";
	import schema from "./schema";

	import toast from "../../core/toastr";

	import { mapGetters, mapMutations, mapActions } from "vuex";
	// import { LOAD_PROJECTS, SET_CURRENT_PROJECT, LOAD, SELECT, CLEAR_SELECT, ADD , UPDATE, REMOVE, SET_USER } from "../common/constants/mutationTypes";

	export default {
		
		components : {
			
		}
		, computed : {
			
		}

		/**
		 * Set page schema as data property
		 * インスタンスプロパティのような扱い。複数同じコンポーネントが一つの画面上で利用されていたとしも、
		 * 表示に関わる値を個別に持てるように、return objとしている。
		 */
		, data() {
			return {
				
			};
		}
		, watch: {
			
		}
		/**
		 * Socket handlers. Every property is an event handler
		 */
		, socket : {
			prefix : "/tasks/"
			, events : {
				
			}
		}		
		, methods : {
			...mapActions("debugPage", {
				checkTask : "checkTask"
			})
		}

		/**
		 * Call if the component is created
		 * インスタンスが作成された後に同期的に呼ばれる
		 * データの監視とイベントの初期セットアップが完了した状態
		 */
		, created() {
			
		}
	};
</script>