import express from "express";
import {
  createCategory,
  getAllCategories,
  deleteCategory,
  deleteSubCategory,
  AddNewSubCat,
  updateCategory,
  updateSubCategory,
} from "../controllers/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.post("/categories", createCategory);
categoryRouter.get("/categories", getAllCategories);
categoryRouter.delete("/categories", deleteCategory);
categoryRouter.delete("/categories/subCat", deleteSubCategory);
categoryRouter.post("/categories/subCat", AddNewSubCat);
categoryRouter.put("/categories/update", updateCategory);
categoryRouter.put("/categories/updatesub", updateSubCategory);

export default categoryRouter;
