import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Clerk's userId as the _id
  likedProducts: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: [] },
  ],
});

export const User = mongoose.model("User", userSchema);
