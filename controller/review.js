const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    // Attempt to find the listing by its ID
    const listing = await Listing.findById(id);
    // Check if the listing exists
    if (!listing) {
      // If listing doesn't exist, throw a 404 error
      throw new ExpressError(404, "Listing not found");
    }

    // If listing exists, create the new review
    const newReview = new Review(req.body.review);
    newReview.author = req.user;
    // console.log(newReview);

    // Push the new review to the listing's reviews array
    listing.reviews.push(newReview);
    

    // Save the new review and the updated listing
    await newReview.save();
    await listing.save();

    // Redirect to the listing page
    res.redirect(`/listings/${listing._id}`);
  };


module.exports.destroyReview  = async (req, res) => {
    let { id, reviewid } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);

    res.redirect(`/listings/${id}`);
  };