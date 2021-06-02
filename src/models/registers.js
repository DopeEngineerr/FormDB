const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const regData = new mongoose.Schema({
  firstname: {
    type: String,
    // required: true
  },
  middlename: {
    type: String
  },
  lastname: {
    type: String,
    // required: true
  },
  course: {
    type: String,
    // required: true
  },
  gender: {
    type: String,
    // required: true
  },
  // countrycode: {
  //   type: Number,
  //   // required: true
  // },
  phone: {
    type: Number,
    // required: true
  },
  address: {
    type: String,
    // required: true
  },
  email: {
    type: String,
    // required: true,
    unique: true
  },
  psw: {
    type: String,
    // required: true
  },
  // pswrepeat: {
  //   type: String,
  //   // required: true
  // }
  tokens: [{
    token: {
      type: String
    }
  }]
});

//? Token wale jo app mai likha hai wo idhr define kr rahe
regData.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign({
      _id: this._id.toString()
    }, process.env.SECRET_KEY); //"yehonachahiye32charectertssezyada"); //! secret key
    this.tokens = this.tokens.concat({
      token: token
    });
    await this.save();
    //console.log(`reg token is ${token}`);
    return token;
  } catch (error) {
    res.status(404).send(error);
    console.log(`error is ${error}`);
  }
}

//! Save[app.js mai] ke pehle function chalao, aur yaha fat-awrrow funtion kaam nai krta, traditional method only

regData.pre("save", async function (next) {
  if (this.isModified("psw")) {
    this.psw = await bcrypt.hash(this.psw, 10);
    //? this.password mai wo jo user dal rha hai
  }
  next();
})


const Register = new mongoose.model("Register", regData);

module.exports = Register;