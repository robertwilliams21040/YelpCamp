var express = require("express");

//Create a Router variable and map all routes to it
var router = express.Router();

//Require passport for Authentication
var passport = require("passport");

//Import Models
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");
var User = require("../models/users");



//=================
//INDEX ROUTES
//=================

//Render the landing page on the root route
router.get("/", function(req, res){
	res.render("landing");
});


//==============
//AUTH ROUTES
//==============


//show register form
router.get("/register", function(req, res){
	res.render("register");
});

//Handle Sign up logic
router.post("/register", function(req, res){
	//You can split new user into its own variable for readability
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			//The flash message must be passted to a redirect instead of a render in order to show. Render will while the message
			return res.redirect("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
});	


//show login form
router.get("/login", function(req,res){
	res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", 
	{
	 	successRedirect: "/campgrounds",
	 	failureRedirect: "/login"
	}), function(req,res){
});

//log out route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});




//Export the router variable to use routes in main app
module.exports = router;