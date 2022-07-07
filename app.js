const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const ejs = require("ejs");
const res = require("express/lib/response");
const _ = require("lodash");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const passport = require("passport");
const flash = require("connect-flash");

const app = express();
// Passport Config
require("./config/passport")(passport);

//Connecting to Mongo
const uri = require("./config/keys").MongoUri;
main().catch((err) => console.log(err));
async function main() {
	await mongoose.connect(uri).then((res) => {
		console.log("MongoDB Connected...");
	});
}
//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
//Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
//EXPRESS SESSION
app.use(
	session({
		secret: "secret",
		resave: false,
		saveUninitialized: true,
	})
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());
//Global Vars
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	next();
});

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server is running ON Port ${PORT}`));
