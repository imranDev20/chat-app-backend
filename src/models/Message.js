const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    seen: { type: Boolean, default: false },
    media: {
      type: {
        url: { type: String },
        type: { type: String },
        name: { type: String },
      },
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read", "failed"],
      default: "sent",
    },
    type: {
      type: String,
      enum: ["text", "audio", "video", "location", "file"],
      default: "text",
    },
    reactions: [
      {
        type: {
          emoji: { type: String },
          count: { type: Number, default: 0 },
          users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        },
      },
    ],
    forwardedFrom: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    edited: { type: Boolean, default: false },
    editedAt: { type: Date },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
