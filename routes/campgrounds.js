var express = require("express");

//Create a Router variable and map all routes to it
var router = express.Router();

//Import Models
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");

//Import Middleware
var middleware = require("../middleware");

//==================
//CAMPGROUND ROUTES
//==================


// INDEX - show all campgrounds
//Render the campgrounds page
router.get("/", function(req, res){
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/index", {campgrounds:allCampgrounds});
		}
	});	
});


//Create - add new campground to DB
//Add campgrounds to the page
router.post("/", middleware.isLoggedIn, function(req,res){
	// get data from the form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = { 
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name : name, image : image, description: desc, author:author};
	//Create new campground and save to database
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			console.log(newlyCreated)
			res.redirect('/campgrounds');
		}
	});
});


//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});


//SHOW - shows more info about one campground
router.get("/:id" , function(req, res){
	//find the campground with provided ID, get the campgrounds comments
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if (err){
			console.log(err);
		}
		else{
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});


//EDIT - Allows user to edit an existing campgrounds information 
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});
		   


//UPDATE Campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/" +  req.params.id);
		}
	})
	//redirect somewhere(show page)
});

//DESTROY Campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	 Campground.findByIdAndRemove(req.params.id, function(err, campgroundRemoved){
		if(err){
			res.redirect("/campgrounds");
		}
		Comment.deleteMany({_id:{ $in: campgroundRemoved.comments}}, function(err){
			if (err){
				console.log(err)
			}
			res.redirect("/campgrounds")
		});
	 });
});



//Export the router variable to use routes in main app
module.exports = router;



