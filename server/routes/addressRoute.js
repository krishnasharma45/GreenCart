import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  addAddress,
  getAddress,
  deleteAddress,
  updateAddress,
} from "../controllers/addressController.js";

const addressRouter = express.Router();

addressRouter.post("/add", authUser, addAddress);
addressRouter.get("/get", authUser, getAddress);

addressRouter.delete("/delete/:id", authUser, deleteAddress);
addressRouter.put("/update/:id", authUser, updateAddress);

export default addressRouter;
