var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//INDEX - show all campgrounds
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds:allCampground, currentUser: req.user});  //req.user send data of loggedin user
        }
    });
       
});

//CREATE - add new campground to DB
router.post("/", isLoggedin, function(req, res){
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var author= {
       id: req.user._id,
       username: req.user.username
   };
   var newCampground = {name: name, img: image, description: desc, author: author};
   Campground.create(newCampground, function(err, newlycreated){
      if(err){
          console.log(err);
      } else {
          res.redirect("/campgrounds");
      }
   });
});

//NEW - show form to create new campground
router.get("/new", isLoggedin, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log(err);
       } else {
           //console.log(foundCampground);
           res.render("campgrounds/show",{campground: foundCampground});
       }
   });
});

//EDIT ROUTE

router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});
    });        
});

//UODATE ROUTE
router.put("/:id", checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndUpdate(req.params.id, req.body.editcampground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   }); 
});

//DELETE ROUTE

router.delete("/:id", checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           console.log(err);
       } else {
           res.redirect("/campgrounds");
       }
   });
});


//middleware
function isLoggedin(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }  
  res.redirect("/login");
}

// authorize the loggedin user
function checkCampgroundOwnership(req, res, next) {
        //is user logged in
     if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            } else {
                //is the campground is added by thid loggedin person
                if(foundCampground.author.id.equals(req.user._id))
                {
                    next(); 
                } else {
                    res.redirect("back");
                }
                
            }
        });    
     } else {
         res.redirect("back");  //take the user back from where they came from
     } 
}


module.exports = router;