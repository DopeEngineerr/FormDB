require('dotenv').config(); //! As early as possible in your application
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const Register = require("./models/registers");
const port = process.env.PORT || 9000;
require("./db/conn");

//? Ab ye likhna hai toh likhna hai
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

// const static_path = path.join(__dirname, "../public/");
// app.use(express.static(static_path));

const views_path = path.join(__dirname, "../tamplates/views");
const partials_path = path.join(__dirname, "../tamplates/partials");

app.set("view engine", "hbs");
app.set("views", views_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    // console.log(req.body.firstname);
    // res.send(req.body.firstname);

    const psw = req.body.psw;
    const pswrepeat = req.body.pswrepeat;

    if (psw === pswrepeat) {
      const member = new Register({
        firstname: req.body.firstname,
        middlename: req.body.middlename,
        lastname: req.body.lastname,
        course: req.body.cource,
        gender: req.body.gender,
        countrycode: req.body.countrycode,
        phone: req.body.phone,
        address: req.body.address,
        email: req.body.email,
        psw: req.body.psw
        //pswrepeat: req.body.pswrepeat,
      });
      //console.log(`member is ${member}`);
      // //? token generation [jsonwebtoken] baki registers.js mai likha hua hai
      const token = await member.generateAuthToken();
      //console.log(`app token is ${token}`);
      //? Password Hashing registers.js mai kiya gya hai

      const Registered = await member.save();
      res.status(201).render("index");
      //console.log(token);
      //console.log(Registered); 
      //alert("Registered Successfully!");
    } else {
      res.send("Passwords are not matching.")
    }

  } catch (err) {
    res.status(400).send(err);
  }
})

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const psw = req.body.psw;

    //! agar jo maine email login page pe dala wo mere databased mai se kisi emailk se match ho gya toh uska saara details user mai store ho jaaega

    const user = await Register.findOne({
      email: email
    });


    //? hashed password aur orignal password mai compare

    const isMatch = await bcrypt.compare(psw, user.psw);
    //! returns bool


    // //? token generation [jsonwebtoken] baki registers.js mai likha hua hai {YE WALA LOGIN TOKEN HAI}
    const token = await user.generateAuthToken();
    console.log(`login token: ${token}`)


    // if (user.psw === psw) {
    if (isMatch) {
      res.status(201).render("index");
      //alert("Logined Successfully!");
    } else {
      res.status(400).send("Invalid email or password");
    }
  } catch (err) {
    res.status(400).send("Invalid email or password");
  }
})

app.listen(port, () => {
  console.log(`Connection live on localhost:${port}`);
});