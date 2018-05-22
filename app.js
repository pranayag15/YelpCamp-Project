var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy  = require("passport-local"),
    User        = require("./models/user"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seed");
    
var campgroundRoutes   = require("./routes/campgrounds"),
    indexRoutes        = require("./routes/indexRoutes"),
    commentRoutes      = require("./routes/comments");

//seedDB(); //stopprd seeding data for now 

mongoose.connect("mongodb://localhost/yelp_camp_vs9");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret: "missing college badly!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;            // this statement assigns loggedin user(req.user) to currentUsers
    next();
});

app.use("/", indexRoutes);                          // The *string* inside double quotes specify that our all routes starts with this address that means this address is common in
app.use("/campgrounds", campgroundRoutes);          //all the routes in that route directory.
app.use("/campgrounds/:id/comments", commentRoutes);//In this we have variable ":id" so fix that that when we required router function, we speficied ({mergeParams: true)
                                                    // that means we are passing vakue of parameters to app.js

//middleware

function isLoggedin(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }  
  res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("YelpCamp server has started");
});