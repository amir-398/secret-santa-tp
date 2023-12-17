const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let memberGroupSchema = new Schema({
  group_id: {
    type: String,
    required: true,
  },
  user_1: {
    type: String,
    required: true,
  },
  user_2: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Santa", memberGroupSchema);
