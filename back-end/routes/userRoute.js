import express from "express";
import {
  likeProduct,
  getLikedProducts,
  syncUser,
} from "../controllers/userController.js";
import clerkAuth from "../middleware/clerkAuth.js";

const userRouter = express.Router();

// Sync user with Clerk
userRouter.post("/user", clerkAuth, syncUser);
userRouter.post("/user/likes", clerkAuth, likeProduct);
userRouter.get("/user/likes", clerkAuth, getLikedProducts);

export default userRouter;
