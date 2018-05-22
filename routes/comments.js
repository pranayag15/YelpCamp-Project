var express = require("express");
var router  = express.Router({mergeParams: true}); //"mergeParams" so that params from comments and campgrounds will merge and connect to app.js
var Campground = require("../models/campground");
var Comment    = require("../models/comment");

//Comment New
router.get("/new",isLoggedin, function(req, res){
   Campground.findById(req.params.id, function(err, campground){
      if(err){
          console.log(err);
      } else {
          res.render("comments/new", {campground: campground});
      }
   });
});

//Comment Create
router.post("/",isLoggedin, function(req, res){
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else {
                   //add user model to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   //save comment
                   comment.save();
                   campground.comments.push(comment._id);
                   campground.save();
                   //console.log(comment);
                   res.redirect("/campgrounds/" + campground._id);
               }
           })
       }
   }) 
});

//middleware
function isLoggedin(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }  
  res.redirect("/login");
}

module.exports = router;