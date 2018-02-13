<template lang="pug">
	.popup-container
		.popup
			.panel
				.header {{ schema.title }}
				.body 
					.form
						vue-form-generator(:schema="schema.form", :model="model", :options="options", ref="form", :is-new-model="isNewModel")

						.errors.text-center
							div.alert.alert-danger(v-for="(item, index) in validationErrors", :key="index") {{ item.field.label }}: 
								strong {{ item.error }}

						.buttons.flex.justify-space-around
							button.button.primary(@click="buttonSaveDidPush", :disabled="!isSaveButtonEnable")
								i.icon.fa.fa-save 
								| {{ schema.resources.saveCaption || _("Save") }}
							button.button.outline(v-if="options.isCloseButtonEnable" @click="buttonCloseDidPush", :disabled="!isCloseButtonEnable")
								i.icon.fa.fa-save
								| {{ schema.resources.closeCaption || _("Close") }}
							button.button.outline(v-if="options.isPostponeButtonEnable" @click="buttonPostponeDidPush", :disabled="!isPostponeButtonEnable")
								i.icon.fa.fa-save
								| {{ schema.resources.postponeCaption || _("Postpone") }}
							button.button.outline(v-if="options.isBreakdownButtonEnable" @click="buttonBreakdownDidPush", :disabled="!isBreakdownButtonEnable")
								i.icon.fa.fa-code-fork 
								| {{ schema.resources.breakdownCaption || _("Breakdown") }}
							button.button.outline(v-if="options.isCloneButtonEnable" @click="buttonCloneDidPush", :disabled="!isCloneButtonEnable")
								i.icon.fa.fa-clone
								| {{ schema.resources.cloneCaption || _("Clone") }}
							button.button.danger(v-if="options.isDeleteButtonEnable" @click="buttonDeleteDidPush", :disabled="!isDeleteButtonEnable")
								i.icon.fa.fa-trash 
								| {{ schema.resources.deleteCaption || _("Delete") }}
							button.button.outline(@click="buttonCancelDidPush", :disabled="!isCancelButtonEnable")
								i.icon.fa.fa-close
								| {{ schema.resources.cancelCaption || _("Cancel") }}

				.block
					//- button.button.success(@click="schema.buttons[0].action") {{ schema.buttons[0].label }}
				
</template>

<script>
	import Vue from "vue";

	import "jquery";
	import "bootstrap";
	import "eonasdan-bootstrap-datetimepicker";
	import "ion-rangeslider";
	import "ion-rangeslider/css/ion.rangeSlider.css"
	import "ion-rangeslider/css/ion.rangeSlider.skinFlat.css"
	
	
	import { schema as schemaUtils } from "vue-form-generator";
	import { get as objGet, find, cloneDeep, isArray, isFunction } from "lodash";

	export default {
		name: "PopupForm"
        , components: {
		}
		// properties set by it's parent component.
		// somtimes, parent components set their methods as props.
		// it looks like cocoa's delegating.
		, props: {
			schema : {
				type: Object
      			, required: true
				, validator: function(value) { 
					// TODO
					console.log("schema.popupForm", value);
					return true; 
				} 
			}
			, template : {
				type: Object
				, validator: function(value) { 
					 // TODO
					console.log("model.template", value);
					return true; 
				}
			}
		}
		, data() {
			// createdより早くmodelが参照されるので、ここで詰めている
			return {
				model: cloneDeep(this.template)
			};
		}
		, computed: {
			isNewModel() { return this.model.code == null; }
			, options() { 
				let options = this.schema.options ? cloneDeep(this.schema.options) : {};
				if (this.isNewModel) {
					options.isCloseButtonEnable = null;
					options.isPostponeButtonEnable = null;
					options.isBreakdownButtonEnable = null;
					options.isCloneButtonEnable = null;
					options.isDeleteButtonEnable = null;
				}
				return options; 
			}
			, isSaveButtonEnable() { 
				return this.options.isSaveButtonEnable !== false
					; 
			}
			, isCloseButtonEnable() { 
				return !this.isNewModel
					&& this.options.isCloseButtonEnable !== false
					; 
			}
			, isPostponeButtonEnable() { 
				return !this.isNewModel
					&& this.options.isPostponeButtonEnable !== false
					; 
			}
			, isBreakdownButtonEnable() { 
				return !this.isNewModel 
					&& this.options.isBreakdownButtonEnable !== false
					;
			}
			, isCloneButtonEnable() { 
				return !this.isNewModel 
					&& this.options.isCloneButtonEnable !== false
					;
			}
			, isDeleteButtonEnable() { 
				return !this.isNewModel 
					&& this.options.isDeleteButtonEnable !== false
					;
			}
			, isCancelButtonEnable() { 
				return this.options.isCancelButtonEnable !== false;
			}
			, validationErrors() {
				if (this.$refs.form && this.$refs.form.errors) 
					return this.$refs.form.errors;

				return [];
			}
			, orderedChildren() {
				return (this.template.children) ? this.template.children.reverse() : [];
			}
		}
		, watch : {
			schema(newSchema) {
				console.log("●", newSchema);
			}
			, template(newTemplate) {
				this.model = newTemplate;
			}
		}
		, methods: {
			buttonSaveDidPush() {
				if (this.options.validateBeforeSave === false ||  this.validate()) {
					this.$emit("save", this.finalize(this.model));
				} else {
					// Validation error
				}
			}
			, buttonCloseDidPush() {
				if (this.options.validateBeforeSave === false ||  this.closeVlidate(this.$refs.form)) {
					this.$emit("close", this.finalize(this.model));
				} else {
					// Validation error
				}
			}
			, buttonCloneDidPush() { this.$emit("clone"); }
			, buttonPostponeDidPush() { this.$emit("postpone"); }
			, buttonBreakdownDidPush() { this.$emit("breakdown"); }
			, buttonDeleteDidPush() { 
				if (window.confirm(_("本当に削除します？"))) { this.$emit("remove"); }
			}	// deleteは予約語なので怒られる
			, buttonCancelDidPush() { this.$emit("cancel"); }

			, validate() {
				let res = this.$refs.form.validate();

				if (this.schema.events && isFunction(this.schema.events.onValidated)) {
					this.schema.events.onValidated(this.model, this.$refs.form.errors, this.schema);
				}

				if (!res) {
					// Set focus to first input with error
					this.$nextTick(() => {
						let el = document.querySelector("div.form tr.error input:nth-child(1)");
						if (el)
							el.focus();
					});
				}
				return res;	
			}
			// @see https://github.com/vue-generators/vue-form-generator/blob/master/src/formGenerator.vue#L316
			, closeVlidate(form, isAsync = null) {
				form.$children.forEach(child => {
					// notice: the required option not work without the validator option.
					if (child.schema.closeRequired) {
						child.schema._required = child.schema.required;
						child.schema.required = true;
					}
				});

				if(isAsync === null) {
					isAsync = objGet(form.options, "validateAsync", false);
				}
				form.clearValidationErrors();
				let fields = [];
				let results = [];
				form.$children.forEach(child => {
					if (isFunction(child.validate)) {
						fields.push(child); // keep track of validated children
						results.push(child.validate(true));
					}
				});
				let handleErrors = (errors) => {
					let formErrors = [];
					errors.forEach((err, i) => {
						if(isArray(err) && err.length > 0) {
							err.forEach(error => {
								formErrors.push({
									field: fields[i].schema,
									error: error,
								});
							});
						}
					});
					form.errors = formErrors;
					let isValid = formErrors.length == 0;
					form.$emit("validated", isValid, formErrors);

					form.$children.forEach(child => {
						if (child.schema.closeRequired) {
							child.schema.required = child.schema._required;
						}
					});

					return isAsync ? formErrors : isValid;
				};

				if(!isAsync) {
					return handleErrors(results);
				}

				return Promise.all(results).then(handleErrors);
			}
			, finalize(model) {
				let _model = cloneDeep(model);
				if (this.schema.form.groups) {
					this.schema.form.groups.forEach(g => {
						g.fields.forEach(f => {
							if (f.finalize) {
								_model[f.model] = f.finalize(_model, _model[f.model], f);
							}
						});
					});
				} else {
					this.schema.form.fields.forEach(f => {
						if (f.finalize) {
							_model[f.model] = f.finalize(_model, _model[f.model], f);
						}
					});
				}
				
				return _model;	
			}
		}
		, created() {
		}
	};
	
</script>

<style lang="scss">

	.container {
		.popup-container {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background-color: rgba(0, 0, 0, 0.6);
			z-index: 9999;

			$icon-font-path: "../../../../../node_modules/bootstrap-sass/assets/fonts/bootstrap/";	
			@import "../../../../../node_modules/bootstrap-sass/assets/stylesheets/bootstrap/variables";
			@import "../../../../../node_modules/bootstrap-sass/assets/stylesheets/bootstrap/mixins";
			@import "../../../../../node_modules/bootstrap-sass/assets/stylesheets/bootstrap/glyphicons";
			@import "../../../../../node_modules/bootstrap-sass/assets/stylesheets/bootstrap/type";
			@import "../../../../../node_modules/bootstrap-sass/assets/stylesheets/bootstrap/dropdowns";
			@import "../../../../../node_modules/bootstrap-sass/assets/stylesheets/bootstrap/input-groups";

			@import "../../../../../node_modules/eonasdan-bootstrap-datetimepicker/src/sass/bootstrap-datetimepicker-build";
			
			.bootstrap-datetimepicker-widget {
				color: #000;

				a {
					color: $link-color;
					text-decoration: none;
				}
			}
		}

		.popup {
			position: absolute;
			top: 150px;
			left: 100px;
			right: 100px;
			bottom: 0;
			margin: auto;
			transition: all .4s ease;
			font-size: 0.8em;

			.panel {
				background-color: rgba(16, 67, 87, 0.8);

				.body {
					overflow: visible;
				}
			}
		}

		.form-group {
			&.disabled.readonly {
				.field-wrap {
					padding-left: 1em;
				}
				input, select {
					border: none;
					background: none;
					box-shadow: none;
				}
			}
		}
	}
</style>