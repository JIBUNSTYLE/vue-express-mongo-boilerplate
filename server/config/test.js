"use strict";

let pkg = require("../../package.json");

module.exports = {
	app: {
		title: pkg.name + " [Test mode]"
	},
	
	hashSecret: "71IIYMzMb0egTaCvvdijhUajAOjsrurzyRX5ziskMk4",
	sessionSecret: "MB9x-hOkx-UdcCbOprxggu-Wv1PetuoqzBny1h8DULA",

	mailer: {
		from: "noreply@jibunstyle.com",

		transport: "smtp",
		smtp: {
			host: "smtp.gmail.com",
			port: 465,
			auth: {
				user: "noreply@jibunstyle.com",
				pass: ""
			}
		}
	},
	
	test: true,

	db: {
		uri: "mongodb://localhost/" + pkg.config.dbName + "-test",
		options: {
			user: "",
			pass: ""
		}
	}
};