const express = require("express");
const upload = require("../middlewares/FileUpload");
const checkLogin = require("../middlewares/Auth");
const cloudinaryConfig = require("../config/cloudinary");
const Conversation = require("../models/Conversations");
const fs = require("fs");

const conversationRouter = express.Router();

conversationRouter.post("/create", checkLogin, async (req, res) => {
  try {
    const { participant1, participant2, sender, message } = req.body;
    if (!participant1 && !participant2) {
      return res.status(400).json({
        message: "Both Participants Required",
      });
    }
    const conversation = new Conversation({
      participants: [participant1, req.userData.userId],
      messages: [],
    });
    const savedConverstion = await conversation.save();
    const populatedConversation = await Conversation.findById(
      savedConverstion._id
    )
      .populate("participants")
      .exec();

    return res.status(201).json({
      conversation: populatedConversation,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

conversationRouter.post("/send-message/:id", checkLogin, async (req, res) => {
  try {
    const { sender, message } = req.body;
    const conversationId = req.params.id;
    if (!sender && !message) {
      return res.status(400).json({
        message: "Sender and Message Required",
      });
    }
    const conversation = await Conversation.findById(conversationId);
    conversation.messages.push({
      sender: sender,
      message: message,
    });
    await conversation.save();
    const populatedConversation = await Conversation.findById(conversationId)
      .populate("participants")
      .exec();
    return res.status(201).json({
      conversation: populatedConversation,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

conversationRouter.get("/list", checkLogin, async (req, res) => {
  try {
    const userId = req.userData.userId;
    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    })
      .populate("participants")
      .exec();

    return res.status(200).json({
      conversations: conversations,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

conversationRouter.get("/participant/:id", checkLogin, async (req, res) => {
  try {
    const userId = req.params.id;
    const conversations = await Conversation.find({
      participants: { $all: [userId, req.userData.userId] },
    })
      .populate("participants")
      .exec();
    return res.status(200).json({
      conversations: conversations,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

conversationRouter.get("/details/:id", checkLogin, async (req, res) => {
  try {
    const conversationId = req.params.id;
    const conversation = await Conversation.findById(conversationId)
      .populate("participants")
      .exec();
    return res.status(200).json({
      conversation: conversation,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

conversationRouter.post("/upload/:id", checkLogin, upload, async (req, res) => {
  try {
    const conversationId = req.params.id;
    const conversation = await Conversation.findById(conversationId);
    const { sender } = req.body;
    const { path } = req.file;
    const uploaded = await cloudinaryConfig.uploader.upload(path, {
      folder: "chat-app",
    });
    fs.unlinkSync(path);
    conversation.messages.push({
      sender: sender,
      attachment: uploaded.secure_url,
    });
    await conversation.save();
    const populatedConversation = await Conversation.findById(conversationId)
      .populate("participants")
      .exec();
    return res.status(201).json({
      conversation: populatedConversation,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

conversationRouter.delete("/:id", checkLogin, async (req, res) => {
  try {
    const conversationId = req.params.id;
    await Conversation.deleteOne({ _id: conversationId });
    return res.status(200).json({
      message: "Conversation Deleted",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = conversationRouter;
