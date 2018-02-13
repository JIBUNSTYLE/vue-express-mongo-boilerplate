"use strict";

import Vue from "vue";
import VueRouter from "vue-router";

import MyTasks from "../modules/mytasks";
import Profile from "../modules/profile";
import Settings from "../modules/settings";
import Debug from "../modules/debug";

Vue.use(VueRouter);

export default new VueRouter({
	mode: "hash",
	routes: [
		{ path: "/", component: MyTasks }
		, { path: "/profile", component: Profile }
		, { path: "/settings", component: Settings }
		, { path: "/debug", component: Debug }
		
		//, { path: "/users", component: User, meta: { needRole: "admin" } }
		// , { path: "*", component: NotFound }
	]
});