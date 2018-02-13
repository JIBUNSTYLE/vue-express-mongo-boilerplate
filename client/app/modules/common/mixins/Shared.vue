<script>
	import Vue from "vue";

	import { cloneDeep, isObject } from "lodash";
	import moment from "moment";

	import { taskTypes } from "../constants/types";

	import { mapGetters, mapMutations, mapActions } from "vuex";
	import { SET_CURRENT_PROJECT, SET_CURRENT_WEEK, SET_CURRENT_USER, LOAD_USERS, LOAD_PROJECTS } from "../constants/mutationTypes";

	export default {
		
		computed : {
			...mapGetters("shared", [
				"projects"
				, "users"
				, "currentProject"
				, "currentWeek"
				, "currentUser"
			])
			, ...mapGetters("session", [
				"me"
			])
		}
		, methods : {
			...mapMutations("shared", {
				setCurrentProject : SET_CURRENT_PROJECT
				, setCurrentWeek : SET_CURRENT_WEEK
				, setCurrentUser : SET_CURRENT_USER
			})
			, ...mapActions("shared", {
				getUsers : "readUsers"
				, getProjects : "readTasks"
			})
			// , ...mapActions("session", [
			// 	"getSessionUser"
			// ])
			// setup projectSelector dynamically.
			, setupProjectsField(popupForm) {
				if (popupForm.form.fields == undefined && popupForm.form.groups) {
					popupForm.form.groups.forEach(g => {
						g.fields.forEach(f => {
							if (f.model == "root_code") {
								f.values = this.projects.map(project => {
									return { id : project.code, name : project.name };
								});
								f.default = this.currentProject;
							}
						});
					})
				} else {
					popupForm.form.fields.forEach(f => {
						if (f.model == "root_code") {
							f.values = this.projects.map(project => {
								return { id : project.code, name : project.name };
							});
							f.default = this.currentProject;
						}
					});
				}
				return popupForm;
			}
			, setupAsigneeField(popupForm) {
				if (popupForm.form.fields == undefined && popupForm.form.groups) {
					popupForm.form.groups.forEach(g => {
						g.fields.forEach(f => {
							if (f.model == "asignee_code") {
								f.values = this.users.map(user => {
									return { id : user.code, name : user.username };
								});
							}
						});
					})
				} else {
					popupForm.form.fields.forEach(f => {
						if (f.model == "asignee_code") {
							f.values = this.users.map(user => {
								return { id : user.code, name : user.username };
							});
						}
					});
				}
				return popupForm;
			}
			// setup userSelector dynamically.
			// call after getting users state.
			, setupUserSelector(schema) {
				if (schema == undefined || schema.userSelector == undefined) {
					return schema;
				}

				schema.userSelector.fields.forEach(f => {
					if (f.model == "author") {
						f.values = this.users.map(user => {
							return { id : user.code, name : user.username };
						});
					}
				});
				// When user reload by F5, setting up userSelector is called after setting selectedUser and model value cleared by undefined.
				// So set initial value here again.
				this.setCurrentUser((this.currentUser != null) ? this.currentUser : this.me.code);
				return schema;
			}
			// setup projectSelector dynamically.
			// call after getting projects state.
			, setupProjectSelector(schema) {
				if (schema == undefined || schema.projectSelector == undefined) {
					return schema;
				}

				schema.projectSelector.fields.forEach(f => {
					if (f.model == "code") {
						f.values = this.projects.map(p => {
							return { id : p.code, name : p.name }
						});
					}
				});
				return schema;
			}
			, setupTaskTypeField(parentTaskType) {
				switch(parentTaskType) {
					case "project":
						return cloneDeep(taskTypes);
					case "milestone":
						return [
							{ id: "milestone", name: _("Milestone") }
							, { id: "requirement", name: _("Requirement") }
							, { id: "way", name: _("Way") }
							, { id: "step", name: _("Step") }
							, { id: "todo", name: _("ToDo") }
						];
					case "requirement":
					case "way":
					case "step":
						return [
							, { id: "requirement", name: _("Requirement") }
							, { id: "way", name: _("Way") }
							, { id: "step", name: _("Step") }
							, { id: "todo", name: _("ToDo") }
						];
				}
			}
			, setupDefaultTaskType(parentTaskType) {
				switch (parentTaskType) {
					case "project":
						return "milestone";
					case "milestone":
						return "requirement";
					case "requirement":
						return "way";
					default:
						return "step";
				}
			}
			, getUser(code) {
				for (let i in this.users) {
					const user = this.users[i];
					if (user.code == code) {
						return user;
					}
				}
				return null;
			}
			, populateRoot(model) {
				if (this.projects.length == 0) return model;

				const _projects = this.projects.reduce((result, p) => {
					result[p.code] = p;
					return result;
				}, {});

				const _recursive = (model) => {
					if (model.root && !isObject(model.root)) {
						if (model.root == -1) {
							model.root = null;
						} else {
							model.root = _projects[model.root];
						}
					}
					if (model.children) {
						model.children = model.children.map(t => {
							return _recursive(t);
						});
					}
					return model;
				};
				
				return _recursive(model);
			}
		}
		, created() {
			this.$store.subscribe((mutation, state) => {
				if (mutation.type == `shared/${LOAD_PROJECTS}`
					|| mutation.type == `shared/${SET_CURRENT_PROJECT}`
				) {
					if (this.schema.popupForm)
						this.schema.popupForm = this.setupProjectsField(this.schema.popupForm);
					this.schema = this.setupProjectSelector(this.schema);
				}

				if (mutation.type == `shared/${LOAD_USERS}`) {
					if (this.schema.popupForm)
						this.schema.popupForm = this.setupAsigneeField(this.schema.popupForm);
					this.schema = this.setupUserSelector(this.schema);
				}
			});

			if (!this.currentWeek) {
				this.setCurrentWeek(moment().day(1).format("YYYY-MM-DD"));
			}

			if (this.users.length == 0) {
				this.getUsers({ mutation: `shared/${LOAD_USERS}` });	
			} else {
				if (this.schema.popupForm)
					this.schema.popupForm = this.setupAsigneeField(this.schema.popupForm);
				this.schema = this.setupUserSelector(this.schema);
			}

			if (this.projects.length == 0) {
				this.getProjects({ 
					options: { taskType : "project" }
					, mutation: `shared/${LOAD_PROJECTS}`
				});
			} else {
				if (this.schema.popupForm)
					this.schema.popupForm = this.setupProjectsField(this.schema.popupForm);
				this.schema = this.setupProjectSelector(this.schema);
			}
		}
	};
</script>