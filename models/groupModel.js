const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  admin_id: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
});
module.exports = mongoose.model("Group", userSchema);
