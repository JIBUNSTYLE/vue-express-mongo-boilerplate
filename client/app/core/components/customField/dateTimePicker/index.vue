<template lang="pug">
	.input-group.date
		span.input-group-addon
			span.glyphicon.glyphicon-calendar
		input.form-control(type="text", v-model="value", :autocomplete="schema.autocomplete", :disabled="disabled", :placeholder="schema.placeholder", :readonly="schema.readonly", :name="schema.inputName", :id="getFieldID(schema)")
</template>

<script>
	/* global $ */
	import { abstractField } from "vue-form-generator";
	import { defaults } from "lodash";
    import fecha from "fecha";
    
    let inputFormat = "YYYY-MM-DD HH:mm:ss";
    
	export default {
        name: "fieldMyDateTimePicker"
		, mixins: [ abstractField ]
		, methods: {
			getDateFormat() {
				if (this.schema.dateTimePickerOptions && this.schema.dateTimePickerOptions.format)
					return this.schema.dateTimePickerOptions.format;
				else
					return inputFormat;
			}
			, formatValueToField(value) {
                if (value == "") return null;
                if (value != null) {
                    let dt = this.schema.format ? fecha.parse(value, this.schema.format) : new Date(value);
                    return fecha.format(dt, this.getDateFormat());
                }

                return value;
            }
            , formatValueToModel(value) {
                if (value == "") return null;
                if (value != null) {
                    let m = fecha.parse(value, this.getDateFormat());
                    if (this.schema.format)
                        value = fecha.format(m, this.schema.format);
                    else
                        value = m.valueOf();
                }

                return value;
            }
		}
		, mounted() {
			this.$nextTick(function () {
				if (window.$ && window.$.fn.datetimepicker) {
					let input = this.$el.querySelector(".form-control");
					$(input).datetimepicker(defaults(this.schema.dateTimePickerOptions || {}, {
						format: inputFormat
                    }))
                    .on("blur", e => {
                        e.preventDefault();
                        return false;
                    })
                    .on("dp.change", () => {
						this.value = input.value;
                    });

                    $(this.$el).on("click", e => {
                        e.preventDefault();
                        $(input).focus();
                    });
				} else {
					console.warn("Bootstrap datetimepicker library is missing. Please download from https://eonasdan.github.io/bootstrap-datetimepicker/ and load the script and CSS in the HTML head section!");
				}
			});
		}
		, beforeDestroy() {
			if (window.$ && window.$.fn.datetimepicker){
                let input = this.$el.querySelector(".form-control");
				$(input).data("DateTimePicker").destroy();
			}
		}
	};
</script>


<style lang="sass">
</style>