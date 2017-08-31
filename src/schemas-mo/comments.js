/**
 * Created by mac on 17/8/24.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = mongoose.model('Comment', new Schema({
	first: String
	, last: String
	, email: { type: String, unique: true }
	, password: { type: String, index: true }
}));