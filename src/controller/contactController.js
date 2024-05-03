const User = require("../models/User");

exports.getContacts = async (req, res) => {
  try {
    const userId = req.user.userId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const user = await User.findById(userId, "-password")
      .populate({
        path: "contacts",
        select: "-password",
        options: {
          skip: (page - 1) * limit,
          limit: limit,
        },
      })
      .lean();

    const totalContacts = user.contacts.length;
    const hasMore = totalContacts > page * limit;
    const totalPages = Math.ceil(totalContacts / limit);

    res.status(200).json({
      success: true,
      message: "Contacts fetched successfully",
      data: {
        contacts: user.contacts,
        currentPage: page,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.addContact = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findById(req.userId);
    const contact = await User.findOne({ email });
    if (!contact) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.contacts.includes(contact._id)) {
      return res.status(400).json({ error: "Contact already exists" });
    }

    user.contacts.push(contact._id);
    await user.save();

    res.status(201).json({ message: "Contact added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
