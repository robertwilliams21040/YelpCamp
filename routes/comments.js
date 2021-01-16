//Require Express
var express = require("express");

//Create a Router variable and map all routes to it. Merge the parameters from the campground route to allow comments
var router = express.Router({mergeParams: true});

//Import Models
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");

//Import Middleware
var middleware = require("../middleware");

//=================
//COMMENTS ROUTES
//=================

//Render the add new comment form. Check first to see if the user is logged in
router.get("/new", middleware.isLoggedIn, function(req,res){
	// find campground by ID 
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new", {campground: campground});
		}
	});
});


//Add comment collect from form to the database. Use the isLoggedIn middleware to make sure user did not bypass authentication 
router.post("/", middleware.isLoggedIn, function(req,res){
	//lookup campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			//create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}
				else{
					//Add username and ID to comment
					console.log(req.user.username);
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//Save Comment
					comment.save();
					//connent new comment to campground and save
					campground.comments.push(comment);
					campground.save();
					//redirect campground show page
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

//Edit an existing comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}
		else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});


//Update comment in the campground
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


//Delete comment from campground 
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
	//findByIdAndRemove
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if (err){
			res.redirect("back");
		}
		else{
			res.redirect("/campgrounds/" + req.params.id)
		}
	});
});



//Export the router variable to use routes in main app
module.exports = router;