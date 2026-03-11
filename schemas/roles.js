const mongoose = require("mongoose");

const { Schema } = mongoose;

const RoleSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Role name is required"],
      unique: true,
      trim: true,
      lowercase: true
    },

    description: {
      type: String,
      default: "",
      trim: true
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

// Optional index for faster search
RoleSchema.index({ name: 1 });

// Export model
const Role = mongoose.model("Role", RoleSchema);

module.exports = Role;