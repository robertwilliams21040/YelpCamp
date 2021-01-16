//Add in the nodes to be used in the app
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var methodOverride = require("method-override");
var flash = require("connect-flash");

//Add in data models
var User = require("./models/users")
var Campground = require("./models/campgrounds");
var Comment = require("./models/comments");


//Add in routes for app funtions
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");


//var seedDB = require("./seeds");


//Connect to Mongo DB
mongoose.connect("mongodb://localhost:27017/yelp_camp_V11", {useNewUrlParser: true});


//Use body parser with url optionn
app.use(bodyParser.urlencoded({extended: true}));

//Use connect-flash for flash messages in app
app.use(flash());

//Set the views extention to ejs
app.set("view engine" , "ejs");

//Set up public directory to be served 
app.use(express.static(__dirname+"/public"))
console.log(__dirname+"/public");


//Set up methodOverride so the app knows what to look for
app.use(methodOverride("_method"));


//Passport Configuration
app.use(require("express-session")({
	secret: "I am the best",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Function used to call the currentUser Varible on every route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


//Use the imported routes for app. Have the call append the default route to shorten code in route files
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//Wipe and then seed the DB with demo data
//seedDB();




app.listen(3000, function(){
	console.log('Server listening on port 3000');
}); 