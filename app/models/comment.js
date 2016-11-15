// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var commentSchema = mongoose.Schema({
	date: {type: Date, default: Date.now},
	post: {type:  mongoose.Schema.Types.ObjectId, ref: 'post'},
	text: String,
	title: String,
	user: {type:  mongoose.Schema.Types.ObjectId, ref: 'User'},
});

// create the model for users and expose it to our app
module.exports = mongoose.model('comment', commentSchema);
