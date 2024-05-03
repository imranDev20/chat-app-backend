const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    avatar: { type: String, default: "default_profile_picture.png" },

    status: {
      type: String,
      enum: ["online", "offline", "away"],
      default: "offline",
    },
    bio: { type: String, maxlength: 200 },
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
    },
    settings: {
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
      },
      theme: { type: String, default: "light" },
    },
    emailVerified: { type: Boolean, default: false },

    verificationToken: String,
    verificationExpires: Date,
    lastLogin: Date,
    loginHistory: [
      {
        timestamp: Date,
        ipAddress: String,
      },
    ],
    passwordResetToken: String,
    passwordResetExpires: Date,
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: String,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
