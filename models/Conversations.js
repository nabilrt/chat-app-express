const mongoose = require("mongoose");
const messageSchema = require("./Message");
const { Schema } = mongoose;

const conversationSchema = Schema({
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [messageSchema],
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
