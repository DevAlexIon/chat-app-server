const Message = require("../models/Message");
const mongoose = require("mongoose");

const createMessage = async (req, res) => {
  const { recipientId, content } = req.body;
  const senderId = req.user.id;

  try {
    const newMessage = new Message({
      sender: senderId,
      recipient: recipientId,
      content: content,
    });

    const savedMessage = await newMessage.save();

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
  deleteMessage,
};
