// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var postSchema = mongoose.Schema({
	category: String,
	date: {type: Date, default: Date.now},
	message: String,
	title: String,
	user: {type:  mongoose.Schema.ObjectId, ref: 'User'},
	startsAt: {type: Date},
	endsAt: {type: Date},
});

// create the model for users and expose it to our app
module.exports = mongoose.model('post', postSchema);