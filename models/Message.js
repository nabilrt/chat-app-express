const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  message: {
    type: String,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = messageSchema;
