const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let groupeSchema = new Schema({
  admin_id: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
});
module.exports = mongoose.model("Group", groupeSchema);
