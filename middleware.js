const Listing = require("./models/listing");
let Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema_new, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","you must be logged-in to create listing");
   return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
      req.flash("error", "you are not the owner of this listing");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

// Middleware to validate the listing data
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema_new.validate(req.body);
  
    if (error) {
      let errmsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errmsg);
    } else {
      next();
    }
  };

  

 module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
  
    if (error) {
      let errmsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errmsg);
    } else {
      next();
    }
  };

  module.exports.isReviewAuthor = async(req,res,next)=>{
    let { id,reviewid } = req.params;
    let review = await Review.findById(reviewid);
    if (!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "you are not the author of this review");
      return res.redirect(`/listings/${id}`);
    }
    next();
}