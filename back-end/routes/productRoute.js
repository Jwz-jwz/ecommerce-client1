import express from "express";
import {
  CreateProduct,
  deleteProduct,
  getAllProducts,
  getHomePageProducts,
  saledProducts,
  searchResult,
  updateProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/products", CreateProduct);
productRouter.get("/products", getAllProducts);
productRouter.get("/products/homepage", getHomePageProducts);
productRouter.delete("/products", deleteProduct);
productRouter.put("/products", updateProduct);
productRouter.get("/products/saled", saledProducts);
productRouter.get("/products/search", searchResult);

export default productRouter;
