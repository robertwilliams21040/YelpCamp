var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");
//File for all middleware used in project
var middlewareObj = {};


middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			//check for errors
			if(err){
				req.flash("error", "Campground not found");
				res.redirect("back");
			}
			else{
				//does the user own the campground?
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}
				else{
					req.flash("error", "You do not have the correct permissions");
					res.redirect("back");	
				}
			}
		});	
	}
	else{
		req.flash("error", "Please Login"); 
		res.redirect("back");
	}
}

//middleware that checks if the user is the owner of the comment. If users in not the owner, redirect them back.
middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			//check for errors
			if(err){
				res.redirect("back");
			}
			else{
				//does the user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}
				else{
					res.redirect("back");	
				}
			}
		});	
	}
	else{
		console.log("You need to be logged in to do that"); 
		res.send("You need to be logged in to do that");
	}
}


//middleware function that allows you to check to see if a user is logged in
middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login");
	res.redirect("/login");
}


module.exports = middlewareObj;