let mongoose = require("mongoose");

let messageSchema = new mongoose.Schema(
  {
    room: String,
    sender: String,
    message: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
