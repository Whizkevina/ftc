const createError = require('http-errors');
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser= require('cookie-parser');
const cors = require('cors');
const passport = require("passport");

const users = require("./routes/api/users");
const personals = require("./routes/api/personal");
const forgetpassword = require("./routes/api/forgetpassword");
const resetPassword = require("./routes/api/resetpassword");
const updatePasswordViaEmail = require("./routes/api/updatePasswordViaEmail");

const app = express();

app.use(cors('*'));

// require("./startup/cors")(app);

// Setting the CORS to allow different origin of URI
// app.use(function(req, res, next) {
// 	res.header('Access-Control-Allow-Origin', '*');
// 	res.header(
// 			'Access-Control-Allow-Headers',
//       'Access-Control-Allow-Origin',
// 			'Origin, X-Requested-With, Content-Type, Accept',
// 		);
// 	next();
// });


// enable cors
app.use(cookieParser());

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);

app.use("/api/personal", personals);

app.use("/forgetpassword", forgetpassword);
app.use("/resetpassword", resetPassword);
app.use("/update-password-email", updatePasswordViaEmail);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));