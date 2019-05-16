import { GET_READY, SET_USER } from "../mutationTypes";
import { サービスの利用を開始する } from "../usecases";
import User from "../../domain/entities/user";
import sessions from "../../infrastructure/repositories/rest/sessions";

// DDD: Application Service
export default {
	modules: { }
	, state : {
		isReady: false
		, user: null	
	}
	, getters : {
		isReady(state) { return state.isReady; }
		, me(state) { return state.user; }
		
	}
	// Vuex: Mutations can change states. It must run synchronously.
	, mutations :  {
		[GET_READY] (state) {
			state.isReady = true;
		}
		, [SET_USER] (state, user) {
			state.user = user;
			if (state.currentUser === null) {
				state.currentUser = state.user.code;
			}
		}
	}

	// DDD: Usecases
	// Vuex: Actions can execute asynchronous transactions.
	, actions : {
		[サービスの利用を開始する]({ commit }) {
			return sessions.get()
				.then(data => {
					let user = new User(data);
					commit(SET_USER, user);
				});
		}
	}
};