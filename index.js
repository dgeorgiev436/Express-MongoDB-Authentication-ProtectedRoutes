const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const session = require("express-session");

mongoose.connect('mongodb://localhost:27017/authDemo', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

// CHECK IF DATABASE CONNECTS
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
	console.log("Database connected");
})



app.set("view engine", "ejs");
app.set("views", "views")

app.use(express.urlencoded({extended: true}));
app.use(session({
	secret: "notagoodsecretonceagain",
	resave: false,
	saveUninitialized: true
}))

const requireLogin = (req,res,next) => {
	if(!req.session.user_id){
		return res.redirect("/login")
	}
	next();
}

app.get("/", (req,res) => [
	res.send("THIS IS THE HOME PAGE")
])

app.get("/register", (req,res) => {
	res.render("register")
})


app.get("/login", (req,res) => {
	res.render("login")
})

// HASHIGN THE PASSWORD USIGN BCRYPT
app.post("/register", async(req,res) => {
	const {password, username} = req.body.user;
	const hashedPassword = await bcrypt.hash(password, 12);
	const user = await new User({
		username,
		password: hashedPassword
	});
	await user.save();
// 	Adding user ID to the session if registering is succesful
	req.session.user_id = user._id;
	res.redirect("/")
})

// AUTHENTICATION
app.post("/login", async(req,res) => {
// 	TAKIGN USERNAME AND PASSWORD FROM THE LOGIN FORM
	const {username, password} = req.body.user;
// 	FINDING THE USER WITH THE GIVEN USERNAME
	const user = await User.findOne({username: username});
	if(!user){
		res.redirect("/login")
	}
// 	COMPARING THE PLAIN PASSWORD FROM THE FORM WITH THE HASHED PASSWORD FRO THE DATABASE 
	const validPassword = await bcrypt.compare(password, user.password);
	if(!validPassword){
		res.redirect("/login")
	}else{
// 		Adding user ID to the session if login is succesful
		req.session.user_id = user._id;
		res.redirect("/secret");
	}
})

app.get("/secret", requireLogin, (req,res) => {
		res.render("secret")
})

app.get("/topsecret", requireLogin, (req,res) => {
	res.send("TOP SECRET")
})

// LOGOUT ROUTE
app.post("/logout", (req,res) => {
// 	CHANGIGN THE USER ID STORED IN THE SESSION TO NULL SO THAT VERIFICATIONS ABOVE DOESNT PASS
	req.session.user_id = null;
	res.redirect("/login")
})



app.listen(3000, () => {
	console.log("SERVER RUNNING ON PORT 3000")
})