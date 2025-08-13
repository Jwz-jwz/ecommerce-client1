import { Product } from "../models/product.js";
import mongoose from "mongoose";

const CreateProduct = async (request, response) => {
  try {
    const {
      name,
      price,
      sale,
      categoryId,
      subCategoryId,
      description,
      images,
      sizes,
      stock,
    } = request.body;

    if (!name || !price || !categoryId) {
      return response.status(400).json({
        success: false,
        message: "Бүтээгдэхүүний нэр, ангилал, үнийг заавал оруулна уу.",
      });
    }

    const formattedImages = images?.map((url) => ({ url })) || [];

    let productData = {
      name,
      price,
      sale,
      categoryId,
      subCategoryId,
      description,
      images: formattedImages,
    };

    if (sizes && Array.isArray(sizes) && sizes.length > 0) {
      productData.sizes = sizes;
    } else {
      productData.stock = stock;
    }

    const result = await Product.create(productData);

    // 👇 Emit product creation event
    const io = request.app.get("io");
    io.emit("productCreated", result); // send to all clients

    response.status(201).json({
      success: true,
      message: "Бүтээгдэхүүн амжилттай бүртгэгдлээ",
      data: result,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      success: false,
      message: "Бүтээгдэхүүн үүсгэхэд алдаа гарлаа",
      error: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, categoryId, subCategoryId } = req.query;

    // console.log("CatID bol", categoryId);
    // console.log("subCatId bol", subCategoryId);

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 12) || 12;

    const query = {};

    // Filter by categoryId if it's provided and not "all" or "sale"
    if (categoryId && categoryId !== "all" && categoryId !== "sale") {
      query.categoryId = categoryId;
    }

    // Filter by subCategoryId if provided
    if (subCategoryId) {
      query.subCategoryId = subCategoryId;
    }

    // If category is "sale", filter by products with sale > 0
    if (categoryId === "sale") {
      query.sale = { $gt: 0 };
    }

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      // .populate("categoryId")
      // .populate("subCategoryId") // optional: populate to get category name
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalProducts / limitNumber);

    res.status(200).json({
      data: {
        products,
        currentPage: pageNumber,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getHomePageProducts = async (request, response) => {
  try {
    const products = await Product.find().limit(12).sort({ createdAt: -1 });
    response.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.log("Error fetching categories:", error);
    response.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

const saledProducts = async (request, response) => {
  try {
    const products = await Product.find({ sale: { $gt: 0 } })
      .limit(6)
      .sort({ createdAt: -1 });
    response.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.log("Error fetching products:", error);
    response.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

const deleteProduct = async (request, response) => {
  try {
    const { _id } = request.body;
    if (!_id) {
      return response.status(400).json({
        success: false,
        message: "product id is required",
      });
    }
    const deletedProduct = await Product.findByIdAndDelete(_id);
    if (!deletedProduct) {
      return response.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const remaininProducts = await Product.find({});
    const io = request.app.get("io");
    io.emit("productDeleted", remaininProducts);

    response.status(200).json({
      success: true,
      message: "Бүтээгдэхүүн амжилттай устгагдлаа",
      data: remaininProducts,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Бүтээгдэхүүн устгахад алдаа гарлаа",
      error: error.message,
    });
  }
};

const updateProduct = async (request, response) => {
  try {
    const { editFormData } = request.body;

    if (!editFormData?._id) {
      return response.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Fetch the existing product
    const existingProduct = await Product.findById(editFormData?._id);
    if (!existingProduct) {
      return response.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Process images with better error handling
    const updatedImages = editFormData?.images.map((image) => {
      try {
        if (image._id) {
          // Check if _id is already a valid ObjectId
          if (mongoose.Types.ObjectId.isValid(image._id)) {
            return image;
          } else {
            // If _id is a string from Cloudinary but not a valid ObjectId, create a new one
            return {
              _id: new mongoose.Types.ObjectId(),
              url: image.url,
            };
          }
        } else {
          // If no _id, create a new one
          return {
            _id: new mongoose.Types.ObjectId(),
            url: image.url,
          };
        }
      } catch (err) {
        console.error("Error processing image:", err);
        // Return with new ObjectId as fallback
        return {
          _id: new mongoose.Types.ObjectId(),
          url: image.url,
        };
      }
    });

    // Process sizes
    const updatedSizes = editFormData?.sizes.map((size) => {
      try {
        if (size._id && mongoose.Types.ObjectId.isValid(size._id)) {
          return size; // Keep existing size with valid ObjectId
        } else {
          return {
            _id: new mongoose.Types.ObjectId(),
            size: size.size,
            stock: size.stock,
          }; // Add new size with new ObjectId
        }
      } catch (err) {
        console.error("Error processing size:", err);
        return {
          _id: new mongoose.Types.ObjectId(),
          size: size.size,
          stock: size.stock,
        };
      }
    });

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      editFormData?._id,
      {
        name: editFormData?.name,
        price: editFormData?.price,
        sale: editFormData?.sale,
        categoryId: editFormData?.categoryId,
        subCategoryId: editFormData?.subCategoryId || undefined,
        description: editFormData?.description,
        images: updatedImages,
        sizes: updatedSizes,
        stock: editFormData?.stock,
      },
      { new: true }
    );

    const io = request.app.get("io");
    io.emit("updatedProduct", updatedProduct);

    response.status(200).json({
      success: true,
      message: "Бүтээгдэхүүн амжилттай шинэчлэгдлээ",
      data: updatedProduct,
      allProducts: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    response.status(500).json({
      success: false,
      message: "Бүтээгдэхүүн шинэчлэхэд алдаа гарлаа",
      error: error.message,
    });
  }
};

const searchResult = async (req, res) => {
  const search = req.query.search || "";

  const page = parseInt(req.query.page) || 1;
  const pageSize = 12;

  // const query = search
  //   ? { name: { $regex: search, $options: "i" } } // case-insensitive
  //   : {};
  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  try {
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({
      products,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Search error" });
  }
};

export {
  CreateProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  getHomePageProducts,
  saledProducts,
  searchResult,
};
