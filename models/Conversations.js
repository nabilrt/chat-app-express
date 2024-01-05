const mongoose = require("mongoose");
import { messageSchema } from "./Message";

const conversationSchema = mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [messageSchema],
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
