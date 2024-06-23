const Message = require("../models/Message");
const mongoose = require("mongoose");
const User = require("../models/User");

const createMessage = async (req, res) => {
  const { recipientId, content } = req.body;
  const senderId = req.user.id;

  try {
    const sender = await User.findById(senderId).populate("friends");

    if (!sender) {
      return res.status(404).json({ msg: "Sender not found" });
    }

    if (senderId === recipientId) {
      return res.status(403).json({ msg: "You cannot message yourself" });
    }

    const isFriend = sender.friends.some(
      (friend) => friend._id.toString() === recipientId
    );

    if (!isFriend) {
      return res.status(403).json({ msg: "You can only message your friends" });
    }

    const newMessage = new Message({
      sender: senderId,
      recipient: recipientId,
      content: content,
    });

    const savedMessage = await newMessage.save();

    req.io.emit("newMessage", savedMessage);

    res.json(savedMessage);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

const getMessagesBySender = async (req, res) => {
  const senderId = req.params.senderId;

  try {
    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ msg: "Invalid sender ID" });
    }

    const messages = await Message.find({ sender: senderId }).populate(
      "sender recipient",
      "name"
    );
    res.json(messages);
  } catch (error) {
    console.error("Error retrieving messages:", error.message);
    res.status(500).send("Server error");
  }
};

const getMessagesByRecipient = async (req, res) => {
  const recipientId = req.params.recipientId;

  try {
    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({ msg: "Invalid recipient ID" });
    }

    const messages = await Message.find({ recipient: recipientId }).populate(
      "sender recipient",
      "name"
    );
    res.json(messages);
  } catch (error) {
    console.error("Error retrieving messages:", error.message);
    res.status(500).send("Server error");
  }
};

const markMessageAsRead = async (req, res) => {
  const { messageId } = req.params;
  const { read } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ msg: "Invalid message ID" });
    }

    const message = await Message.findByIdAndUpdate(
      messageId,
      { read },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }

    res.json(message);
  } catch (error) {
    console.error("Error updating message:", error.message);
    res.status(500).send("Server error");
  }
};

const deleteMessage = async (req, res) => {
  const messageId = req.params.messageId;

  try {
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ msg: "Invalid message ID" });
    }

    const message = await Message.findByIdAndDelete(messageId);
    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }

    res.json({ msg: "Message deleted" });
  } catch (error) {
    console.error("Error deleting message:", error.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  createMessage,
  getMessagesBySender,
  getMessagesByRecipient,
  markMessageAsRead,
  deleteMessage,
};
