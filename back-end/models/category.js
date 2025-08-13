import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subCat: [
      {
        name: {
          type: String,
          // required: true,
        },
        _id: {
          type: mongoose.SchemaTypes.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
        },
      },
    ],
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
