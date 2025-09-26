// Setup the dependencies
const express = require("express");
const mongoose = require("mongoose");
// Allows our backend application to be available to our frontend application
const cors = require("cors");
// [SECTION] Google Login
// const passport = require("passport");
// const session = require("express-session");
// require('./passport');

//[SECTION] Routes
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
const enrollmentRoutes = require("./routes/enrollment");

require('dotenv').config();

// Server setup
const app = express();
// const port = 4000;
app.use(express.json());

const corsOptions = {
    // allow requests from this origin (client's URL)
    origin: "*",
    // Allows credentials (e.g. cookies, authorization)
    credentials: true,
    // Provides a status code to use for successful OPTIONS requests
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

// [Section] Google Login
// Creates a session with the given data
// resave prevents the session from overwriting the secret while the session is active
// saveUninitialized prevents the data from storing data in the session while the data has not yet been initialized
// app.use(session({
//     secret: process.env.CLIENT_SECRET,
//     resave: false,
//     saveUninitialized: false
// }));
// // Initializes the passport package when the application runs
// app.use(passport.initialize());
// // Creates a session using the passport package
// app.use(passport.session());

// Database connection
// Connecting to MongoDB Atlas
mongoose.connect(process.env.MONGODB_STRING);
// Set notifications for connection success or failure
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));

//[SECTION] Backend Routes 
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);

if (require.main === module) {
    app.listen(process.env.PORT || 3000, () => console.log(`Server running at port ${process.env.PORT || 3000}`));
}

module.exports = { app, mongoose };
