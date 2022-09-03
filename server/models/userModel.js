const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  userType: {
    type: String,
    enum: ["guest", "seller"],
    required: true,
    default: "guest",
  },
  amount: {
    type: Number,
    required: false,
  },
  keys: {
    type: Object,
    required: false,
  },
  hash: String,
  salt: String,
});

var UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
