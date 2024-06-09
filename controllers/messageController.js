const Message = require("../models/Message");

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

module.exports = {
  createMessage,
  getMessagesBySender,
};
