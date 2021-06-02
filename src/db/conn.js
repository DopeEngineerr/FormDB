const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/form", {
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => {
  console.log("Connection Successful");
}).catch((err) => {
  console.log(err);
});