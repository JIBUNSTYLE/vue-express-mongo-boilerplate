import Vue from "vue";
import Vuex from "vuex";

import session from "../modules/session/store";

import shared from "../modules/common/store";

import mytasksPage from "../modules/mytasks/store";
import debugPage from "../modules/debug/store";

import profile from "../modules/profile/store";

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		session
		, shared
		, mytasksPage
		, debugPage
		, profile
	}
});