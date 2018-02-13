import { ARRANGE_AVOBE, ARRANGE_INTO, ARRANGE_BELOW, LOAD_PROJECTS, ADD_PROJECT, LOAD_USERS, UPDATE, UPDATE_PROJECT, SET_CURRENT_PROJECT, SET_CURRENT_WEEK, SET_CURRENT_USER } from "./constants/mutationTypes";

import { assign } from "lodash";

const state = {
	projects: []
	, users: []
	, currentProject: null  // task.code 
	, currentWeek: null // YYYY-MM-DD（moment().day(1).format("YYYY-MM-DD")）
	, currentUser : null // code
};

const getters = {
	projects(state) { return state.projects; }
	, users(state) { return state.users; }
	, currentProject(state) { return state.currentProject; }
	, currentWeek(state) { return state.currentWeek; }
	, currentUser(state) { return state.currentUser; }
};

const mutations = {
	// movingがtargetの兄になる
	// - (moving->parent).cildrenからmovingを削除
	// - moving.parentにtarget.parentを設定
	// - (target->parent).childrenにmovingを追加（targetの前に）
	// 更新対象：
	//    - movingのparent（children）
	//    - moving（parent）
	//    - targetのparent（children）
	[ARRANGE_AVOBE] (state, [{ exMoving, exMovingParent, exTarget, exTargetParent }, { moving, movingParent, targetParent } ]) {
		// 操作前の各オブジェクトの更新対象に、操作後のオブジェクトをpopulateしつつ当てはめている
		exMovingParent.children = exMovingParent.children.filter(c => {
			return c.code != exMoving.code;
		});
		exMoving.parent = exTargetParent;

		let index = 0;
		for (let i in exTargetParent.children) {
			let c = exTargetParent.children[i];
			if (c.code == exTarget.code) {
				break;
			}
			index++;
		}

		exTargetParent.children.splice(index, 0, exMoving);

		exTargetParent.children.forEach( (c, i) => {
			console.log(i, c);
		});

		console.log(`● target[${exTarget.name}(${exTarget.code})]はobj: ${(exTarget.parent instanceof Object)}`, exTarget.parent);
	}
	// movingがtargetの子になる
	// - (moving->parent).cildrenからmovingを削除
	// - moving.parentにtargetを設定
	// - target.childrenにmovingを追加（先頭）
	// 更新対象：
	//    - movingのparent（children）
	//    - moving（parent）
	//    - target（children）
	, [ARRANGE_INTO] (state, [{ exMoving, exMovingParent, exTarget }, { moving, movingParent, target } ]) {
		// 操作前の各オブジェクトの更新対象に、操作後のオブジェクトをpopulateしつつ当てはめている
		exMovingParent.children = exMovingParent.children.filter(c => {
			return c.code != exMoving.code;
		});
		exMoving.parent = exTarget;
		exTarget.children.unshift(exMoving);
	}
	// movingがtargetの弟になる
	// - (moving->parent).cildrenからmovingを削除
	// - moving.parentにtarget.parentを設定
	// - (target->parent).childrenにmovingを追加（targetの後に）
	// 更新対象：
	//    - movingのparent（children）
	//    - moving（parent）
	//    - targetのparent（children）
	, [ARRANGE_BELOW] (state, [{ exMoving, exMovingParent, exTarget, exTargetParent }, { moving, movingParent, targetParent } ]) {
		// 操作前の各オブジェクトの更新対象に、操作後のオブジェクトをpopulateしつつ当てはめている
		exMovingParent.children = exMovingParent.children.map(c => {
			c.parent = exMovingParent;
			return c;
		});
		exMoving.parent = exTargetParent;

		let index = 0;
		for (let i in exTargetParent.children) {
			let c = exTargetParent.children[i];
			if (c.code == exTarget.code) {
				break;
			}
			index++;
		}
		exTargetParent.children.splice(index+1, 0, exMoving);
	}

	, [LOAD_PROJECTS] (state, models) {
		state.projects.splice(0);
		state.projects.push(...models);
	}
	, [ADD_PROJECT] (state, model) {
		let found = find(state.projects, (item) => item.code == model.code);
		if (!found)
			state.projects.push(model);
	}
	, [LOAD_USERS] (state, models) {
		state.users.splice(0);
		state.users.push(...models);
	}
	, [UPDATE_PROJECT] (state, model) {
		state.projects.forEach(p => {
			if (p.code == model.code) {
				assign(p, model);
			}
		});
	}
	, [UPDATE] (state, { parent, child }) {
		// stateが変更されたかの判定が凄いシビア
		// parentの挿げ替えかchildの追加でどちらでも状態を更新できるが、
		// 前者だとroot以下にタスクを追加した場合、更新がされなかった（root以外では大丈夫だった）
		let update = function(model) {
			if (model.code == parent.code) {
				child.parent = model; // populate
				model.children.push(child);
				return model;
			}
			if (model.children == undefined || model.children.length == 0) {
				return model;
			} else {
				model.children = model.children.map( c => {
					return update(c, parent);
				});
				return model;
			}
		};

		for (let i in state.projects) {
			let p = state.projects[i];
			if (p.code == state.currentProject) {
				state.projects[i] = update(p, parent);
				break;
			}
		}
	}
	, [SET_CURRENT_PROJECT] (state, code) {
		state.currentProject = code;
	}
	, [SET_CURRENT_WEEK] (state, date) {
		state.currentWeek = date;
	}
	, [SET_CURRENT_USER] (state, code) {
		state.currentUser = code;
	}
};


import { readUsers } from "./actions/persons";
import { readTasks } from "./actions/tasks";

export default {
	namespaced : true
	, state
    , getters
    , actions : { readUsers, readTasks }
	, mutations
};