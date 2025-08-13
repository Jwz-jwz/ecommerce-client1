import express from "express";
import {
  CreateOrder,
  DeleteOrder,
  GetAllOrders,
  GetUserOrders,
  updateOrder,
} from "../controllers/orderController.js";
import clerkAuth from "../middleware/clerkAuth.js";

const orderRouter = express.Router();

orderRouter.post("/orders", clerkAuth, CreateOrder);
orderRouter.get("/orders", clerkAuth, GetAllOrders);
orderRouter.put("/orders/:orderId", clerkAuth, updateOrder);
orderRouter.delete("/orders", clerkAuth, DeleteOrder);
orderRouter.get("/userorders", clerkAuth, GetUserOrders);
export default orderRouter;
