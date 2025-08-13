import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    // required: true,
  },
  _id: {
    type: mongoose.SchemaTypes.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
});

const sizeSchema = new mongoose.Schema({
  size: {
    type: String,
    // required: true,
  },
  stock: {
    type: Number,
    // required: true,
  },
  _id: {
    type: mongoose.SchemaTypes.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sale: {
      type: Number,
      required: false,
      default: 0,
    },
    categoryId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategoryId: {
      type: mongoose.SchemaTypes.ObjectId,
      // ref: "Category.subCat",
      required: false,
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
    images: [imageSchema],
    sizes: [sizeSchema],
    stock: {
      type: Number,
    },
  },
  {
    timestamps: true,
    // This helps with JSON serialization
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        // Ensure all _id fields are strings in JSON
        if (ret.images) {
          ret.images = ret.images.map((img) => ({
            ...img,
            _id: img._id.toString(),
          }));
        }
        if (ret.sizes) {
          ret.sizes = ret.sizes.map((size) => ({
            ...size,
            _id: size._id.toString(),
          }));
        }
        return ret;
      },
    },
  }
);

export const Product = mongoose.model("Product", productSchema);
