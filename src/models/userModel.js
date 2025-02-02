import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    district: {
      type: String,
      trim: true
    },
    password: {
      type: String,
      required: true,
      required: true
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "district-supervisor", "admin"]
    },
    accessToken: {
      type: String
    }
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);

module.exports = User;
