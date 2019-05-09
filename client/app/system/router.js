"use strict";

import Vue from "vue";
import VueRouter from "vue-router";

import Home from "../service/presentation/home/presenter";

Vue.use(VueRouter);

export default new VueRouter({
	mode: "hash",
	routes: [
		{ path: "/", component: Home }
	]
});