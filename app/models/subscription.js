var mongoose = require('mongoose');

var subscriptionSchema = mongoose.Schema({
	category: String,
	freq: String,
	user: {type:  mongoose.Schema.ObjectId, ref: 'User'},
});

// create the model for users and expose it to our app
module.exports = mongoose.model('subscription', subscriptionSchema);