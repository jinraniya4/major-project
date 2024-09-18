const express = require("express");
const app = express();
const mongoose = require("mongoose");  
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./Schema.js");
const data = require("./init/data.js");
const bodyParser = require("body-parser");
const prompt = require("prompt-sync");
// const passport = require("passport");
// const LocalStategy = require("passport-local");
// const User = require("./models/user.js");

// connection of database
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to Dbb");
    console.log("Welcome to MY Wanderlust website Created by Devansh jnraniya");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get(
  "/",
  wrapAsync((req, res) => {
    res.send("hii , i am root");
  })
);

// this code is used to aUthenticate the user so that the user login agaian is the website they do not need to login again and again

// app.use(session(sessionOptions));
// app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, result.errMsg);
  } else {
    next();
  }
};

// app.get("/demouser", async (req,res) =>{
//   let fakeUser = new User({
//     email:"student@gmail.com",
//     username:"delta-student",
//   });

//  let registeredUser = await User.register(fakeUser,"helloworld");
//  res.send(registeredUser);
// });

//Index Route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// buy route
app.get(
  "/listings/my",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/my.ejs", { allListings });
  })
);

//New Route
app.get(
  "/listings/new",
  wrapAsync((req, res) => {
    res.render("listings/new.ejs");
  })
);

// Search Route

app.get("/listings/:search", async (req, resp) => {
  try {
    var search = "";
    if (req.query.search) {
      search = req.query.search;
    }
    const data = await init.data.find({
      $or: [
        { title: { $regex: ".*" + search + ".*", $options: "i" } },
        { location: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    });
    resp.render("/listings/index.ejs", { users: data });
  } catch (error) {
    console.log(error.message);
  }
});
// app.get("/listings/:key", async  (req, res, next) => {
//   console.log(req.params.key);
//   let data = await init.data.find(
//     {
//       "or":[
//         {"title":{$regex:req.params.key}},
//       ]
//     }
//   )
//   res.send("search done")

// });

//Term And Condition Route
app.get(
  "/listings/term",
  wrapAsync((req, res) => {
    res.render("listings/term.ejs");
  })
);

// signup route

app.get(
  "/listings/signup",
  wrapAsync((req, res) => {
    res.render("listings/signup.ejs");
  })
);

// app.get(
//   "/listings/signup",
//   wrapAsync((req, res) => {
//     res.render("listings/signup.ejs");
//   })
// );

// login route
app.get(
  "/listings/login",
  wrapAsync((req, res) => {
    res.render("listings/login.ejs");
  })
);

// book Route
app.get(
  "/listings/book",
  wrapAsync((req, res) => {
    res.render("listings/book.ejs");
  })
);

// credit route

app.get(
  "/listings/credit",
  wrapAsync((req, res) => {
    res.render("listings/credit.ejs");
  })
);

// paypal route
app.get(
  "/listings/paypal",
  wrapAsync((req, res) => {
    res.render("listings/paypal.ejs");
  })
);
// netbanking
app.get(
  "/listings/netbanking",
  wrapAsync((req, res) => {
    res.render("listings/netbanking.ejs");
  })
);

//Privacy Route
app.get(
  "/listings/privacy",
  wrapAsync((req, res) => {
    res.render("listings/privacy.ejs");
  })
);

//Show Route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);

// buyshow Route
app.get(
  "/listings/:id/buyshow",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/buyshow.ejs", { listing });
  })
);

//contact 
app.get(
  "/listings/:id/contact",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/contact.ejs", { listing });
  })
);

//   create route
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    if (result.error) {
      throw new ExpressError(400, result.error);
    }

    const newListing = new Listing(req.body.listing);

    await newListing.save();
    res.redirect("/listings");
  })
);

// register Route
app.post(
  "/registers",
  wrapAsync(async (req, res, next) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    if (result.error) {
      throw new ExpressError(400, result.error);
    }

    const newListing = new Listing(req.body.listing);

    await newListing.save();
    res.redirect("/registers");
  })
);

//Edit Route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);
//Update Route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

// to enter data
// app.get("/testListing", async (req,res) => {
//     let sampleListing = new Listing ({
//         title: "My New Villa ",
//         description: "By the beach",
//         price : 1200,
//         location:  "Calangute ,Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved ");
//     res.send("successful Testing ");

// });

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
