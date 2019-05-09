"use strict";

require("es6-promise/auto");

import Vue from "vue";

import axios from "axios";
axios.defaults.headers.post["Content-Type"] = "application/json";

import VueI18Next from "./system/i18next.js";

import store from "./system/store";
import App from "./system/App";

// Register i18next localization module. We need to 
// wait it before start the application!
Vue.use(VueI18Next, (i18next) => {
	let router = require("./system/router").default; // Load only after i18next initialized

	new Vue({
		el: "#app"
		, components: {
			App
		}
		, router
		, store
		, render: h => h("app")
	});
});
