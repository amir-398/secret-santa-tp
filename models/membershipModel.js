const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  group_id: {
    type: String,
    required: true,
  },
  admin_id: {
    type: String,
    required: true,
  },
  invited_user: {
    type: String,
    required: true,
  },
  response: {
    type: Boolean,
    default: null,
  },
});
module.exports = mongoose.model("Membership", userSchema);
