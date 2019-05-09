
export default class User {

	constructor(rawValues) {
		this._rawValues = rawValues;
	}

	get code() {
		return this._rawValues.code;
	}
}