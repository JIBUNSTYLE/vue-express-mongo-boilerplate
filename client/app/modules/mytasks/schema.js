import Vue from "vue";
import moment from "moment";
import { taskTypes } from "../common/constants/types";
import { validators } from "vue-form-generator";
import { areaTypes, generate } from "../common/schema/field";

import { find } from "lodash";

let _ = Vue.prototype._;

module.exports = {
	id : "mytasks"
	, title: _("My Tasks (by ListPage)")
	, table: {
		multiSelect : true
		, columns : generate(
			areaTypes.table
			, [ "type", "shortname", "name", "purpose", "goal", "author", "lastCommunication"]
		)
		, rowClasses : function (model) {
			return {
				// inactive: !model.status
			};
		}
	}
	, popupForm : {
		title : _("CreateNewTask")
		, form : generate(
			areaTypes.form
			, {
				TaskDetail : [ "root", "type", "name", "purpose", "goal", "description"]
				, Closing : [ "closingComment"]
			}
		)
		, options : {
			searchable: true
	
			, isAddButtonEnable: true
			, isSaveButtonEnable: true
			, isCloseButtonEnable: true
			, isBreakdownButtonEnable: true
			, isCloneButtonEnable: true
			, isDeleteButtonEnable: true
			, isCancelButtonEnable: true
	
			, validateAfterLoad: false // Validate after load a model
			, validateAfterChanged: false // Validate after every changes on the model
			, validateBeforeSave: true // Validate before save a model
		}
		, resources: {
			saveCaption: _("Save")
			, closeCaption: _("Close")
			, breakdownCaption: _("Breakdown")
			, cloneCaption: _("Clone")
			, deleteCaption: _("Delete")
			, cancelCaption: _("Cancel")
		}
	}
	, events : {
		onSelect: null
		, onNewItem: null
		, onCloneItem: null
		, onSaveItem: null
		, onDeleteItem: null
		, onChangeItem: null
		, onValidated(model, errors, schema) {
			if (errors.length > 0)
				console.warn("Validation error in page! Errors:", errors, ", Model:", model);
		}
	}
	, resources: {
		addCaption: _("Add")
	}
	, descriptions : [
		"自分に関連する（自分がauthorあるいはasigneeの）タスクが表示されます"
		, "statusがclose（status < 0）のタスクは表示されません"
		, "typeがprojectのタスクは表示されません"
		, "Add/Updateで、asigneeを自分以外にすることはできません"
	]
};