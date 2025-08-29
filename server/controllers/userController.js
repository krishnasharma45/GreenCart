import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

// Register User : /api/user/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userData = { email: user.email, name: user.name, _id: user._id };
    return res.json({ success: true, user: userData });
  } catch (error) {
    if (error.code === 11000) {
      return res.json({
        success: false,
        message: `The name "${error.keyValue.name}" is already taken. Please choose another.`,
      });
    }
    console.log(error.message);
    res.json({ success: false, message: "An unexpected error occurred." });
  }
};

// Login User : /api/user/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userData = { email: user.email, name: user.name, _id: user._id };
    return res.json({ success: true, user: userData });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "An unexpected error occurred." });
  }
};

// Check Auth : /api/user/is-auth
export const isAuth = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId).select("-password");
    return res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: "An unexpected error occurred" });
  }
};

// Logout User : /api/user/logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "An unexpected error occurred." });
  }
};

// Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const { userId } = req;

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      user.profileImage = result.secure_url;
    }

    await user.save();
    res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "An unexpected error occurred." });
  }
};

// Get Wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("wishlist");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.json({ success: false, message: "An unexpected error occurred." });
  }
};

// Add to Wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { wishlist: productId },
    });
    res.json({ success: true, message: "Added to wishlist" });
  } catch (error) {
    res.json({ success: false, message: "An unexpected error occurred." });
  }
};

// Remove from Wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    await User.findByIdAndUpdate(req.userId, {
      $pull: { wishlist: productId },
    });
    res.json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    res.json({ success: false, message: "An unexpected error occurred." });
  }
};
