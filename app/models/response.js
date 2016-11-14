// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var responseSchema = mongoose.Schema({
	date: {type: Date, default: Date.now},
	comment: {type:  mongoose.Schema.ObjectId, ref: 'comment'},
	text: String,
	user: {type:  mongoose.Schema.ObjectId, ref: 'User'},
});

// create the model for users and expose it to our app
module.exports = mongoose.model('comment', commentSchema);