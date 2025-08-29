import express from "express";
import {
  isAuth,
  login,
  logout,
  register,
  updateProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import { upload } from "../configs/multer.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/is-auth", authUser, isAuth);
userRouter.get("/logout", authUser, logout);
userRouter.post(
  "/update-profile",
  authUser,
  upload.single("profileImage"),
  updateProfile
);
userRouter.get("/wishlist", authUser, getWishlist);
userRouter.post("/wishlist/add", authUser, addToWishlist);
userRouter.post("/wishlist/remove", authUser, removeFromWishlist);

export default userRouter;
