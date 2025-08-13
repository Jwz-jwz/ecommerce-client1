import { Category } from "../models/category.js"; // Adjust import based on your actual export in the model file
import { mongoose } from "mongoose";
// Create a new category
const createCategory = async (request, response) => {
  const { name, subCat } = request.body;
  try {
    // Check if name is provided and not empty
    if (!name || name.trim() === "") {
      return response.status(400).json({
        success: false,
        message: "Ангилалын нэрийг заавал оруулна уу",
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: name.trim().toLowerCase(),
    });

    if (existingCategory) {
      return response.status(409).json({
        success: false,
        message: "Ангилалын нэр давтагдаж болохгүй",
      });
    }

    // Prepare subcategories if provided
    let subCategories = [];
    if (subCat && Array.isArray(subCat)) {
      subCategories = subCat.map((sub) => ({
        name: sub.name.trim(),
      }));
    }

    // Create new category
    const result = await Category.create({
      name: name.trim(),
      subCat: subCategories,
    });

    response.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log("Category creation error:", error);
    response.status(500).json({
      success: false,
      message: "Ангилал үүсгэхэд алдаа гарлаа",
      error: error.message,
    });
  }
};

// Get all categories
const getAllCategories = async (request, response) => {
  try {
    // Fetch all categories from the database
    const categories = await Category.find({});

    // Return the categories
    response.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    // console.log("Error fetching categories:", error);
    response.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// Delete a category
const deleteCategory = async (request, response) => {
  try {
    const { _id } = request.body;

    // Use the appropriate MongoDB method to delete
    const deletedCategory = await Category.findByIdAndDelete(_id);
    // console.log("Deleted category:", deletedCategory);

    if (!deletedCategory) {
      return response.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Fetch all remaining categories to return to the client
    const remainingCategories = await Category.find({});

    response.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: remainingCategories, // Return updated list
    });
  } catch (error) {
    console.log("Error deleting category:", error);
    response.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};
const deleteSubCategory = async (request, response) => {
  try {
    const { _id, subId } = request.body;

    if (!_id || !subId) {
      return response.status(400).json({
        success: false,
        message: "Category ID and subcategory ID are required",
      });
    }

    // Use MongoDB's $pull operator to remove a subcategory from the array
    const updatedCategory = await Category.findByIdAndUpdate(
      _id,
      { $pull: { subCat: { _id: subId } } },
      { new: true } // Return the updated document
    );

    // console.log(updatedCategory);

    if (!updatedCategory) {
      return response.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Fetch all remaining categories to return to the client
    const remainingCategories = await Category.find({});

    response.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: remainingCategories, // Return updated list
    });
  } catch (error) {
    console.log("Error deleting category:", error);
    response.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

const AddNewSubCat = async (request, response) => {
  try {
    const { _id, subName } = request.body;

    if (!_id || !subName) {
      return response.status(400).json({
        success: false,
        message: "Category ID and subcategory name are required",
      });
    }

    // Find the category first
    const category = await Category.findById(_id);

    if (!category) {
      return response.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if a subcategory with this name already exists (case-insensitive)
    const subCatExists = category.subCat.some(
      (sub) => sub.name.toLowerCase() === subName.toLowerCase()
    );

    if (subCatExists) {
      return response.status(400).json({
        success: false,
        message: "Энэ нэртэй дэд ангилал аль хэдийн үүссэн байна.",
      });
    }

    // Create a new subcategory object with a unique ID
    const newSubCategory = {
      _id: new mongoose.Types.ObjectId(), // Generate a new MongoDB ID
      name: subName,
    };

    const updatedCategory = await Category.findByIdAndUpdate(
      _id,
      { $push: { subCat: newSubCategory } },
      { new: true } // Return the updated document
    );

    // Fetch all remaining categories to return to the client
    const remainingCategories = await Category.find({});

    response.status(200).json({
      success: true,
      message: "Дэд ангилал амжилттай үүслээ.",
      data: remainingCategories, // Return updated list
    });
  } catch (error) {
    console.log("Error adding subcategory:", error);
    response.status(500).json({
      success: false,
      message: "Дэд ангилал үүсгэхэд алдаа гарлаа.",
      error: error.message,
    });
  }
};
const updateCategory = async (request, response) => {
  try {
    const { _id, name } = request.body;

    if (!_id || !name) {
      return response.status(400).json({
        success: false,
        message: "Ангилалын нэрийг заавал оруулах шаардлагатай",
      });
    }

    const existedCategory = await Category.findOne({ name: name });
    if (existedCategory) {
      return response.status(400).json({
        success: false,
        message: "Энэ ангилал аль хэдийн үүссэн байна.",
      });
    }

    // Use MongoDB's $pull operator to remove a subcategory from the array
    const updatedCategory = await Category.findByIdAndUpdate(
      _id,
      { name: name },
      { new: true } // Return the updated document
    );

    // console.log(updatedCategory);

    if (!updatedCategory) {
      return response.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Fetch all remaining categories to return to the client
    const remainingCategories = await Category.find({});

    response.status(200).json({
      success: true,
      message: "Ангилал амжилттай шинэчлэгдлээ",
      data: remainingCategories, // Return updated list
    });
  } catch (error) {
    console.log("Error updating category:", error);
    response.status(500).json({
      success: false,
      message: "Ангилал шинэчлэхэд алдаа гарлаа",
      error: error.message,
    });
  }
};

const updateSubCategory = async (request, response) => {
  try {
    const { _id, subId, name } = request.body;

    if (!_id || !subId || !name) {
      return response.status(400).json({
        success: false,
        message: "Дэд ангилалын шинэ нэрийг заавал оруулах шаардлагатай",
      });
    }
    const category = await Category.findById(_id);

    if (!category) {
      return response.status(404).json({
        success: false,
        message: "Ийм ангилал олдсонгүй",
      });
    }

    // Check if another subcategory already has this name in the same category
    const nameExists = category.subCat.some(
      (sub) =>
        sub._id.toString() !== subId &&
        sub.name.toLowerCase() === name.toLowerCase()
    );

    if (nameExists) {
      return response.status(400).json({
        success: false,
        message: "Ийм дэд ангилал аль хэдийн үүссэн байна.",
      });
    }

    // Update the subcategory name using the $ positional operator
    const updatedSubCategory = await Category.findOneAndUpdate(
      { _id: _id, "subCat._id": subId },
      { $set: { "subCat.$.name": name } },
      { new: true }
    );

    if (!updatedSubCategory) {
      return response.status(404).json({
        success: false,
        message: "Ангилал болон дэд ангилал олдсонгүй",
      });
    }

    // Fetch all remaining categories to return to the client
    const remainingCategories = await Category.find({});

    response.status(200).json({
      success: true,
      message: "Дэд ангилал амжилттай шинэчлэгдлээ",
      data: remainingCategories, // Return updated list
    });
  } catch (error) {
    console.log("Error updating subcategory:", error);
    response.status(500).json({
      success: false,
      message: "Failed to update subcategory",
      error: error.message,
    });
  }
};

export {
  createCategory,
  getAllCategories,
  deleteCategory,
  deleteSubCategory,
  AddNewSubCat,
  updateCategory,
  updateSubCategory,
};
