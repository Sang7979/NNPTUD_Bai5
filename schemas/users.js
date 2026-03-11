const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true
    },

    password: {
      type: String,
      required: [true, "Password is required"]
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true
    },

    fullName: {
      type: String,
      default: "",
      trim: true
    },

    avatarUrl: {
      type: String,
      default: "https://i.sstatic.net/l60Hf.png"
    },

    status: {
      type: Boolean,
      default: false
    },

    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true
    },

    loginCount: {
      type: Number,
      default: 0,
      min: 0
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// index for faster searching
UserSchema.index({ username: 1, email: 1 });

const User = mongoose.model("User", UserSchema);

module.exports = User;