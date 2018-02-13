<template lang="pug">
	list-page(:schema="schema", :rows="populatedTasks", :selected="selected", :users="users", :model="model"
		@add="generateModel"
		@select="select"
		@save="save"
		@close="close"
		@clone="clone"
		@breakdown="breakdown"
		@remove="remove"
		@cancel="cancel"
	)
</template>

<script>
	import Vue from "vue";
	import SharedMixin from "../common/mixins/Shared.vue"
	import ListPage from "../../core/DefaultListPage.vue";
	import schema from "./schema";
	import { schema as schemaUtils } from "vue-form-generator";
	import { cloneDeep, isObject } from "lodash";

	import toast from "../../core/toastr";

	import { mapGetters, mapMutations, mapActions } from "vuex";
	import { LOAD_PROJECTS, SET_CURRENT_PROJECT, LOAD, SELECT, CLEAR_SELECT, ADD , UPDATE, REMOVE, SET_USER } from "../common/constants/mutationTypes";

	export default {
		mixins : [ SharedMixin ]
		, components : {
			ListPage: ListPage
		}
		, computed : {
			...mapGetters("mytasksPage", [
				"tasks",
				"selected"
			])
			, populatedTasks() {
				if (this.projects.length > 0) {
					return this.tasks.map(t => {
						if (!isObject(t.root)) {
							t.root = t.shortname = this.projects.filter(p => { return p.code == t.root; })[0];
						}
						return t;
					});
				} 
				return this.tasks;
			}
		}

		/**
		 * Set page schema as data property
		 * インスタンスプロパティのような扱い。複数同じコンポーネントが一つの画面上で利用されていたとしも、
		 * 表示に関わる値を個別に持てるように、return objとしている。
		 */
		, data() {
			return {
				schema : cloneDeep(schema)
				, model: null
			};
		}
		, watch: {			
			selected(newTasks) {
				// notice: this func also called after calling clearSelection.
				if (newTasks.length == 0) {
					this.model = null;
					return;
				}
				const baseModel = newTasks[0];

				let popupForm = cloneDeep(schema.popupForm);
				popupForm = this.setupProjectsField(popupForm);
				popupForm.title = `${baseModel.name} を編集`;

				if (baseModel.type == "project") {
					popupForm.form.groups[0].fields = popupForm.form.groups[0].fields.filter(f => {
						return f.model != "root_code";
					}).map(f => {
						if (f.model == "type") {
							f.type = "input";
							f.inputType = "text";
							f.readonly = true;
							f.disabled = true;
						}
						return f;
					});
					popupForm.options.isCloneButtonEnable = false;
				} else {
					popupForm.form.groups[0].fields.forEach(f => {
						if (f.model == "root_code") {
							f.readonly = true;
							f.disabled = true;
						}
						return f;
					});
				}
				this.schema.popupForm = popupForm;

				let targetModel = cloneDeep(baseModel);
				if (targetModel.root && targetModel.root != -1) {
					targetModel.root_code = (targetModel.root.code) ? targetModel.root.code : targetModel.root;
				}
				if (targetModel.asignee && targetModel.asignee != -1) {
					targetModel.asignee_code = (targetModel.asignee.code) ? targetModel.asignee.code : targetModel.asignee;
				}
				this.model = targetModel;
			}
		}
		/**
		 * Socket handlers. Every property is an event handler
		 */
		, socket : {
			prefix : "/tasks/"
			, events : {
				/**
				 * New task added
				 * @param  {Object} res Task object
				 */
				created(res) {
					// server側の this.notifyModelChanges(ctx, "created", json); で呼ばれる
					console.log("● created on index.vue", res.data);
					this.created(res.data);
					toast.success(this._("TaskNameAdded", res), this._("追加しました"));
				}

				, brokedown(res) {
					console.log("● brokedown on index.vue", res.data);
					this.updated(res.data.parent);
					this.created(res.data.child);
					// TODO: 連続でブレークダウンできるようにする
					// this.selectRow(res.data.child, false);
					toast.success(this._("TaskNameAdded", res), this._("ブレークダウンしました"));
				}

				/**
				 * Task updated
				 * @param  {Object} res Task object
				 */
				, updated(res) {
					this.updated(res.data);
					toast.success(this._("TaskNameUpdated", res), this._("更新しました"));
				}

				/**
				 * Task removed
				 * @param  {Object} res Response object
				 */
				, removed(res) {
					this.removed(res.data);	
					toast.success(this._("TaskNameDeleted", res), this._("削除しました"));
				}
			}
		}		
		, methods : {
			...mapMutations("mytasksPage", {
				select : SELECT
				, updated : UPDATE
				, clearSelection : CLEAR_SELECT
				, created : ADD
				, removed : REMOVE
			})
			, ...mapActions("mytasksPage", {
				getTasks : "readTasks"
				, updateTask : "updateTask"
				, createTask : "createTask"
				, deleteTask : "deleteTask"
				, checkTask : "checkTask"
			})
			, generateModel() {
				let popupForm = cloneDeep(schema.popupForm);
				popupForm = this.setupProjectsField(popupForm);
				this.schema.popupForm = popupForm;

				let newModel = schemaUtils.createDefaultObject(this.schema.popupForm.form);
				newModel.asignee_code = this.me.code;
				this.model = newModel;
			}
			, save(model) {
				this.clearSelection();
				if (model.code) {
					this.updateTask( { model, mutation: UPDATE } );
				} else {
					if (model.parent_code == null) {
						// cloneでもbreakdownでもない新規の場合、parentもrootと同じにする
						model.parent_code = model.root_code;
					}
					this.createTask( { model, mutation: ADD } );
					this.model = null;
				}
			}
			, close(model) {
				this.clearSelection();
				model.status = -1;
				this.updateTask( { model, mutation: UPDATE } );
			}
			, clone() {
				const baseModel = this.model;

				let popupForm = cloneDeep(schema.popupForm);
				popupForm = this.setupProjectsField(popupForm);
				popupForm.title = `${baseModel.name} を元に新規作成`;
				popupForm.form.groups[0].fields.forEach(f => {
					if (f.model == "root_code") {
						f.readonly = false;
						f.disabled = false;
					}
					return f;
				});
				this.schema.popupForm = popupForm;

				let clonedModel = cloneDeep(baseModel);
				clonedModel.id = null;
				clonedModel.code = null;
				if (clonedModel.root && clonedModel.root != -1) {
					clonedModel.root_code = isObject(clonedModel.root) ? clonedModel.root.code : clonedModel.root;
				}
				if (clonedModel.parent && clonedModel.parent != -1) {
					clonedModel.parent_code = isObject(clonedModel.parent) ? clonedModel.parent.code : clonedModel.parent;
				}
				clonedModel.children = [];
				clonedModel.works = [];
				clonedModel.asignee_code = this.me.code;
				this.model = clonedModel;
			}
			, breakdown() {
				const baseModel = this.model; 

				let popupForm = cloneDeep(schema.popupForm);
				popupForm = this.setupProjectsField(popupForm);
				popupForm.title = `${baseModel.name} をブレークダウン`;
				popupForm.form.groups[0].fields.forEach(f => {
					if (f.model == "root_code") {
						f.readonly = true;
						f.disabled = true;
					}
					if (f.model == "type") {
						f.values = this.setupTaskTypeField(baseModel.type);
					}
					return f;
				});
				this.schema.popupForm = popupForm;

				let brokedownModel = schemaUtils.createDefaultObject(this.schema.popupForm.form);
				if (baseModel.type == "project") {
					brokedownModel.root_code = baseModel.code;
				} else if (baseModel.root && baseModel.root != -1) {
					brokedownModel.root_code = isObject(baseModel.root) ? baseModel.root.code : baseModel.root;
				}
				brokedownModel.type = this.setupDefaultTaskType(baseModel.type);
				brokedownModel.purpose = `${baseModel.goal} 状態にするため`;
				brokedownModel.parent_code = baseModel.code;
				brokedownModel.asignee_code = this.me.code;
				this.model = brokedownModel;
			}
			, remove(){ 
				this.deleteTask( { model: this.selected[0], mutation: REMOVE } );
				this.clearSelection();
			}
			, cancel() {
				this.clearSelection();
				this.model = null;
			}
		}

		/**
		 * Call if the component is created
		 * インスタンスが作成された後に同期的に呼ばれる
		 * データの監視とイベントの初期セットアップが完了した状態
		 */
		, created() {
			if (this.projects.length == 0) {
				this.getTasks({ 
					options: { taskType : "project", populateParent : true }
					, mutation: `shared/${LOAD_PROJECTS}`
				});
			}

			// TODO: sessionから取るようにすればparamでuserを渡さなくてもできるはず
			if (this.me) {
				this.getTasks({ 
					options: { user : this.me.code }
					, mutation: `mytasksPage/${LOAD}`
				});
			} else {
				// F5リロード時など、meがundefinedの場合があるので、その場合、meの更新を監視してtaskを更新する
				this.$store.subscribe((mutation, state) => {
					if (mutation.type == `session/${SET_USER}`) {
						this.getTasks({ 
							options: { user : this.me.code }
							, mutation: `mytasksPage/${LOAD}`
						});
					}
				});				
			}
		}
	};
</script>