const Message = require("../models/Message");

module.exports.getMessage = async (req, res) => {
  try {
    const { sender, recipient } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const totalMessages = await Message.countDocuments({
      $or: [
        { sender, recipient },
        { sender: recipient, recipient: sender },
      ],
    });

    const totalPages = Math.ceil(totalMessages / limit);
    const skip = totalMessages - page * limit;
    const hasMore = totalMessages > page * limit;

    const messages = await Message.find({
      $or: [
        { sender, recipient },
        { sender: recipient, recipient: sender },
      ],
    })
      .skip(skip < 0 ? 0 : skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      data: {
        messages,
        currentPage: page,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching messages",
      error: error.message,
    });
  }
};
