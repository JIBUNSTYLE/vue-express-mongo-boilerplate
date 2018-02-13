// import { LOAD } from "../common/constants/mutationTypes";

const state = {
	// tasks: []
	// , selected: []
};

const getters = {
	// tasks(state) { return state.tasks; }
	// , selected(state) { return state.selected; }
};

const mutations = {

};

import { checkTask } from "../common/actions/tasks";

export default {
	namespaced : true
	, state
	, getters
	, actions : { checkTask }
	, mutations
};