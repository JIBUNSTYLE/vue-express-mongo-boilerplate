"use strict";

// let ROOT 			= "../../../../";
let config    		= require("../../../../config");
let logger    		= require("../../../../core/logger");

let db	    		= require("../../../../core/mongo");
let mongoose 		= require("mongoose");
let Schema 			= mongoose.Schema;
let hashids 		= require("../../../../libs/hashids")("tasks");
let autoIncrement 	= require("mongoose-auto-increment");

let schemaOptions = {
	timestamps: true,
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
};

let TaskSchema = new Schema({
	type: {
		type: String
		, trim: true
	}
	, name: {
		type: String
		, trim: true
	}
	, shortname: {
		type: String
		, trim: true
	}
	, purpose: {
		type: String
		, trim: true
	}
	, goal: {
		type: String
		, trim: true
	}
	, description: {
		type: String
		, trim: true
	}
	, deadline: {
		type: Date
	}
	, timeframe: {
		type: Number
		, "default": -1 // this means "not set yet"
	}
	// projectのid
	, root : {
		// おそらくこれでもOK
		// type: Schema.Types.ObjectId, ref: "Task"
		type: Number
		, ref: "Task"
	}
	// 親タスクのid
	, parent : {
		type: Number
		, ref: "Task"
	}
	, children : [{
		type: Number
		, ref: "Task"
	}]
	, works : [{
		type: Number
		, ref: "Work"
	}]
	, status: {
		// 0: open, -1: close
		type: Number
		, "default": 0
	}
	, closingComment : {
		type: String
		, trim: true
	}
	, author : {
		type: Number
		, required: "Please fill in an author ID"
		, ref: "User"
	}
	, asignee : {
		type: Number
		, ref: "User"
	}
	, isDeleted: {
		// 0: not deleted yet, 1: deleted
		type: Number
		, "default": 0
	}
	, lastCommunication: {
		type: Date
		, "default": Date.now
	}
	, metadata: {}

}, schemaOptions);

TaskSchema.virtual("code").get(function() {
	return this.encodeID();
});

TaskSchema.plugin(autoIncrement.plugin, {
	model: "Task",
	startAt: 1
});

TaskSchema.methods.encodeID = function(id) {
	// idEncode向けに引数を取るように修正
	id = id || this._id;
	return hashids.encodeHex(id);
};

TaskSchema.methods.decodeID = function(code) {
	return hashids.decodeHex(code);
};

let Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
