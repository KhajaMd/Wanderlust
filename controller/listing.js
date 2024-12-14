const { query } = require("express");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken:mapToken});



module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/indes.ejs", { allListings });
  };

module.exports.renderForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({path:"reviews",populate:{
        path:"author",
      }})
      .populate("owner");
    if (!listing) {
      req.flash("error", "Not Available");
      res.redirect("/listings");
    } else {
      
      console.log(listing);
      console.log('Rendering Listing:', listing.geometry);

      res.render("listings/show.ejs", { listing });
    }
    // console.log(listing);
    // res.render("listings/show.ejs", { listing });
  };

module.exports.createListing = async (req, res, next) => {
 let response = await geocodingClient.forwardGeocode({
  query:req.body.listing.location,
  limit:1,
}).send()

console.log('Geocoding Response:', response.body.features[0].geometry);


 let url =  req.file.path;
 let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    newListing.geometry = response.body.features[0].geometry;
    

   let savedListing =  await newListing.save();
   console.log("listing created");
  //  console.log("saved listing::::;",savedListing);
  //  console.log('Location Input:', req.body.listing.location);
  //  console.log('Full Geocoding API Response:', response.body);


    req.flash("success", "New listing created");

    res.redirect("/listings");
  };

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload","/upload/h_200,w_250");
    res.render("listings/edit.ejs", { listing,originalImageUrl });

  };

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    // let updatedData = req.body.listing;

    // const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, {
   let listing =  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

if(typeof req.file !== "undefined" ){

   let url =  req.file.path;
   let filename = req.file.filename;
   listing.image = {url,filename};
   await listing.save()
}
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  };

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let del = await Listing.findByIdAndDelete(id);
    console.log(del);
    res.redirect("/listings");
  };

  


// 

// const Listing = require("../models/listing");
// const fetch = require("node-fetch");
// const ExpressError = require("../utils/ExpressError"); // Ensure this is imported

// // Show all listings
// module.exports.index = async (req, res) => {
//   let allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// };

// // Render form to create a new listing
// module.exports.renderForm = (req, res) => {
//   res.render("listings/new.ejs");
// };

// // Geocoding function to fetch coordinates based on location and city
// async function getCoordinates(location, city) {
//   const query = `${location}, ${city}`;
//   const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
//   const response = await fetch(url);
//   const data = await response.json();

//   if (data && data.length > 0) {
//     return {
//       latitude: data[0].lat,
//       longitude: data[0].lon
//     };
//   } else {
//     throw new Error("Location not found");
//   }
// }

// // Show a specific listing
// module.exports.showListing = async (req, res, next) => {
//   try {
//     const listing = await Listing.findById(req.params.id)
//       .populate({
//         path: "reviews",
//         populate: {
//           path: "author",
//         },
//       })
//       .populate("owner");

//     if (!listing) {
//       req.flash("error", "Not Available");
//       res.redirect("/listings");
//       return;
//     }

//     // Fetch the coordinates for the listing's location and city
//     const coordinates = await getCoordinates(listing.location, listing.city);

//     // Pass the listing and coordinates to the view
//     res.render("listings/show.ejs", { listing, coordinates });
//   } catch (err) {
//     next(err); // Pass the error to the error handler
//   }
// };

// // Create a new listing
// module.exports.createListing = async (req, res, next) => {
//   let url = req.file.path;
//   let filename = req.file.filename;
//   const newListing = new Listing(req.body.listing);
//   newListing.owner = req.user._id;
//   newListing.image = { url, filename };

//   try {
//     await newListing.save();
//     req.flash("success", "New listing created");
//     res.redirect("/listings");
//   } catch (err) {
//     next(err); // Handle any errors that occur during saving
//   }
// };

// // Render edit form
// module.exports.renderEditForm = async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id);
//   let originalImageUrl = listing.image.url;
//   originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_250");
//   res.render("listings/edit.ejs", { listing, originalImageUrl });
// };

// // Update a listing
// module.exports.updateListing = async (req, res) => {
//   let { id } = req.params;
//   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

//   if (typeof req.file !== "undefined") {
//     let url = req.file.path;
//     let filename = req.file.filename;
//     listing.image = { url, filename };
//     await listing.save();
//   }

//   req.flash("success", "Listing Updated");
//   res.redirect(`/listings/${id}`);
// };

// // Delete a listing
// module.exports.deleteListing = async (req, res) => {
//   let { id } = req.params;
//   await Listing.findByIdAndDelete(id);
//   res.redirect("/listings");
// };
