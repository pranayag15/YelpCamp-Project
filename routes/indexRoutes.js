var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User     = require("../models/user");

router.get("/",function(req, res){
   res.render("landing"); 
});

//Register Routes

router.get("/register", function(req, res){
   res.render("register");
});

//Signup logic route  
router.post("/register", function(req, res){
   User.register({username: req.body.username}, req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req, res, function(){
          res.redirect("/campgrounds"); 
       });
   }); 
});

//Login
router.get("/login", function(req, res){
   res.render("login");
});

//login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
});

//Logout
router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/campgrounds");
});

module.exports = router;
