var mongoose = require("mongoose");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	//Adding a object reference to the comments schema
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}	
	]
	
});

//Set up the Campground Model for export
module.exports = mongoose.model("Campground", campgroundSchema);
