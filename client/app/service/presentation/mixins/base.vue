<script>
	import Vue from "vue";
	import { mapGetters, mapActions } from "vuex";	

	import { cloneDeep, isObject, isArray } from "lodash";

	import { GET_READY } from "../../application/mutationTypes";
	import { サービスの利用を開始する } from "../../application/usecases";

	const _ = Vue.prototype._;

	export default {
		computed : {
			...mapGetters([
				"isReady"
				, "me"
			])
		}
		, data() {
			return { }
		}
		, methods : {
			...mapActions([
				サービスの利用を開始する
			])
		}
		, created() {
			if (this.isReady) {
				console.log(this.$options.name, "is created. Required states are ready.");

				const impls = this.$options.sessionEnsured;
				if (impls) {
					if (isArray(impls)) {
						impls.forEach(impl => {
							impl.call(this, this.me);
						});
					} else {
						impls.call(this, this.me);
					}
				}
			} else {
				console.log(this.$options.name, "is created. Required states are not ready.");
				// F5リロード時など、meがundefinedの場合があるので、その場合、meの更新を監視してtaskを更新する
				// （meはApp.vue で getCurrentSession() して作られる）
				this.$store.subscribe((mutation, state) => {
					if (mutation.type === GET_READY) {
						console.log("Observed getting ready for required states.");

						const me = state.session.user;
						const impls = this.$options.sessionEnsured;
						if (me && impls) {
							if (isArray(impls)) {
								impls.forEach(impl => {
									impl.call(this, me);
								});
							} else {
								impls.call(this, me);
							}
						}
					}
				});

				// Get ready for required states.
				this.サービスの利用を開始する()
				.then(_ => {
					// poised
					this.$store.commit(GET_READY);
				});
			}
		}
		, sessionEnsured(me) {
			console.log("[sessionEnsured] plz override me at mixed in components.", me);
		}
	};
</script>
<style lang="scss">
	.no-scroll {
		overflow: hidden;
	}
</style>