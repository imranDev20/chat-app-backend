const Message = require("../models/Message");

module.exports.getMessage = async (req, res) => {
  try {
    const { sender, recipient } = req.params;
    const messages = await Message.find({
      $or: [
        { sender, recipient },
        { sender: recipient, recipient: sender },
      ],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};
