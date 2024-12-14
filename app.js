if(process.env.NODE_ENV!='production'){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema_new, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRoute = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo")
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


// const validateReview = (req, res, next) => {
//   let { error } = reviewSchema.validate(req.body);

//   if (error) {
//     let errmsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errmsg);
//   } else {
//     next();
//   }
// };
const dbUrl = process.env.ATLASDB_URL

main()
  .then(() => console.log("successfull"))
  .catch((err) => console.log(err));

  
async function main() {
  await mongoose.connect(dbUrl);
}

app.listen(3000, () => {
  console.log("listening");
});


const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret: process.env.SECRET
  },
  touchAfter:24 * 3600,

})

store.on("error",()=>{
  console.log("error", err)
})


const sessioOptions= {
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized:true,
  cookie : {
    expires:Date.now() + 7 * 24 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 1000,
    httpOnly:true,
  },
};

// app.get("/", (req, res) => {
//   res.send("home");
// });



app.use(session(sessioOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser", async(req,res)=>{
//   let fakeUser = new User({
//     email:"fakeuser@gmail.com",
//     username: "fakeUser"
//   });
//   let registeredUser = await User.register(fakeUser,"passwd");
//   res.send(registeredUser);
// })

// app.get("/test", async(req, res)=>{
//     let sample = new Listing({
//         title: "Water path Villa",
//         description:"By the Beach",
//         price: 1200,
//         location: "Mumbai",
//         country: "india",
//         image: {
//             filename: "water_path_villa_image",
//             url: "https://example.com/path_to_your_image.jpg" // Use a valid image URL
//         }

//     });
// await sample.save();
// console.log("saved");
// res.send("SUCCESS");
// });

app.use("/listings", listings);
app.use("/listings", reviews);
app.use("/",userRoute);
// //reviews
// app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
//   let listing = await Listing.findById(req.params.id);
//   let newReview = new Review(req.body.review);

//   listing.reviews.push(newReview);

//   await newReview.save();
//   await listing.save();

//   res.redirect(`/listings/${listing._id}`)
// }));
// //Delete review route
// app.delete("/listings/:id/reviews/:reviewid",wrapAsync(async(req,res)=>{
//   let{id,reviewid}=req.params;

//   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}})
//   await Review.findByIdAndDelete(reviewid);

//   res.redirect(`/listings/${id}`);
// }))



app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "something went wrong" } = err;
  res.status(status).render("Err.ejs", { message });
  console.log(err);
  //  res.status(status).send(message)
});
