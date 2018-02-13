<template lang="pug">
	.container
		h3.title {{ "hoge" }}
		
					
</template>
<script>
    import Vue from "vue";
	import SharedMixin from "../common/mixins/Shared.vue"
    // import schema from "./schema";

    import moment from "moment";

    import { mapGetters, mapMutations, mapActions } from "vuex";
    // import { } from "../common/constants/mutationTypes";

	export default {
        name: "Settings"
        , mixins : [ SharedMixin ]
        , components: {
		}
		, computed: {
			// ...mapGetters("settingPage", [
            //     "reviewingDay"
            //     , "works"
            //     , "reviews"
            // ])
            
        }	
        , data() {
			return {
				// schema
				// , model : null
			};
		}
		, watch: {
            
		}
		, methods: {
            // ...mapMutations("dailyReviewPage", {
            //     setReviewingDay : SET_REVIEWING_DAY
            // })
			// , ...mapActions("dailyReviewPage", {
			// 	readWorks : "readWorks"
            //     , readReviews : "readReviews"
            //     , createComment : "createComment"
			// })
			
		}
        , created() {
            console.log("うｐばれてる")
		}
	};

</script>

<style lang="scss" scoped>
    @import "../../../scss/common/mixins";
</style>
