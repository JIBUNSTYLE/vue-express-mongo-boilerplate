import Vue from "vue";
import Vuex from "vuex";

import session from "../service/application/stores/session";

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		session
	}
});