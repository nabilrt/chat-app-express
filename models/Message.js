const mongoose = require("mongoose");
const { Schema } = mongoose;
const messageSchema = Schema({
  message: {
    type: String,
  },
  attachment: {
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
