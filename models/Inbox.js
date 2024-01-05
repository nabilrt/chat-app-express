const mongoose = require("mongoose");
import { messageSchema } from "./Message";

const inboxSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
  },
  latestMessage: messageSchema,
});

const Inbox = mongoose.model("Inbox", inboxSchema);

module.exports = Inbox;
