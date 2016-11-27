// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var savedPostSchema = mongoose.Schema({
	post: {type:  mongoose.Schema.Types.ObjectId, ref: 'post'},
	user: {type:  mongoose.Schema.Types.ObjectId, ref: 'User'},
});

// create the model for users and expose it to our app
module.exports = mongoose.model('savedpost', savedPostSchema);
