import Vue from "vue";
import { METHOD, api } from "../../common/api";

import toastr from "../../../core/toastr";

const NAMESPACE = "/api/profile";

import Service from "../../../core/service";
let service = new Service("profile"); 

export const getProfile = function ({ commit }) {
	service.rest("get").then((data) => {
		commit("UPDATE", data);
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const updateProfile = ({ commit }, { model, mutation }) => {
	return api(METHOD.put, NAMESPACE, model)
	.then(data => {
		if (mutation)
			commit(mutation, data, { root : (mutation.indexOf("/") > -1) });
	});
};
