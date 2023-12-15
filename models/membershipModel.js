const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let memberGroupSchema = new Schema({
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
module.exports = mongoose.model("Membership", memberGroupSchema);
