<template lang="pug">
	.container
		h3.title {{ schema.title }}
		
		.content(v-if="isShowTips && schema.descriptions && schema.descriptions.length > 0")
			.media.primary
				.media-content
					strong このページの概要
					p
						ul
							li(v-for="line in schema.descriptions") {{ line }}
				.media-right
					a.close(title="Close" @click="off")
			br

		.flex.align-center.justify-space-around
			.left(v-if="isAddButtonEnable")
				button.button.is-primary(@click="buttonAddDidPush")
					i.icon.fa.fa-plus 
					| {{ schema.resources.addCaption || _("Add") }}
			.right {{ _("SelectedOfAll", { selected: selected.length, all: rows.length } ) }}
		br
		data-table(:schema="schema.table", :rows="rows", :order="order", :search="search", :selected="selected", :select="select", :select-all="selectAll")

		popup-form(v-if="isEditing", :schema="schema.popupForm", :template="model"
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
	import DataTable from "./components/table";
	import PopupForm from "./components/popupform";

	import { each, find, cloneDeep, isFunction } from "lodash";

	import { mapGetters, mapActions } from "vuex";

	export default {

		name: "ListPage"
        , components: {
			DataTable
			, PopupForm
		}
		, props: {
			schema : {
				type: Object
				, required: true
				, validator: function(value) { return true; } // TODO
			}
			, rows : {
				type: Array
				, required: true
				, validator: function(value) { return true; } // TODO
			}
			, selected : {
				type: Array
				, required: true
				, validator: function(value) { return true; } // TODO
			}
			, users : {
				
			}
			, model : {
				type: Object
				, validator: function(value) { return true; } // TODO
			}
		}
		, data() {
			return {
				order: {
					field: "id"
					, direction: 1
				}
				, isShowTips : true
			};
		}

		, computed: {
			...mapGetters("session", {
				search: "searchText"
			})
			, options() { return this.schema.popupForm.options || {}; }
			, isAddButtonEnable() { return this.options.isAddButtonEnable !== false; }
			, isEditing() { return this.model != null || this.selected.length > 0; }
		}

		, watch: {
			selected() {
				
			}

			/*
			model: {
				handler: function(newVal, oldVal) {
					if (newVal === oldVal) // call only if a property changed, not the model
						console.log("Model property changed!");
				},
				deep: true
			}*/
		}
		
		, methods: {
			off() { this.isShowTips = false; }
			, select(event, row, add) {
				this.$emit("select", row);
				// if (this.schema.table.multiSelect === true && (add || (event && event.ctrlKey))) {
				// 	this.$parent.selectRow(row, true);
				// } else {
				// 	this.$parent.selectRow(row, false);
				// }
			}
			, selectAll(event) {
				let filter = Vue.filter("filterBy");
				let filteredRows = filter(this.rows, this.search);

				if (this.selected.length < filteredRows.length) {
					// Select all
					this.$parent.selectRow(filteredRows, false);
				} else {
					// Unselect all 
					this.clearSelection();
				}
			}
			, buttonAddDidPush() {
				this.$emit("add");

				this.$nextTick(() => {
					let el = document.querySelector("div.form input:nth-child(1):not([readonly]):not(:disabled)");
					if (el)
						el.focus();
				});
			}
			, save(model) { this.$emit("save", model); }
			, close(model) { this.$emit("close", model); }
			, clone() { this.$emit("clone"); }
			, breakdown() { this.$emit("breakdown"); }
			, remove() { this.$emit("remove"); }		// deleteは予約語なので怒られる
			, cancel() { this.$emit("cancel"); }
		}

		, created() {
		}
				
	};

</script>

<style lang="scss" scoped>
	@import "../../scss/common/mixins";

	.container {
		padding: 1rem;
	}

	.form {
		margin: 1rem 0;

		@include bgTranslucentDark(0.2);
		border-radius: 8px;

		.buttons {
			padding: 0.5em;
		}

	}
</style>
