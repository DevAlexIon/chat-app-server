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
    console.log("Message saved:", savedMessage);

    res.json(savedMessage);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

module.exports = {
  createMessage,
};
