import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: String, // Fixed: string → String
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  delivery: {
    type: String,
    required: true,
  },
  info: {
    type: String,
    required: false,
  },
  totalPrice: {
    type: String,
    required: true,
  },
  process: {
    type: String,
    enum: ["Захиалсан", "Баталгаажсан", "Хүргэгдсэн"],
    default: "Захиалсан",
  },

  cartItemToBackend: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId, // Fixed: SchemaTypes → Schema.Types
        ref: "Product",
        required: true,
      },
      selectedSize: {
        type: String,
      },
      quantity: {
        type: Number,
      },

      price: {
        type: Number,
        required: true,
      },
      sale: {
        type: Number,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
});

export const Order = mongoose.model("Order", orderSchema);
