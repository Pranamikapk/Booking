import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import Hotel from "../models/hotelModel.js";
import Manager from "../models/managerModel.js";
import User from "../models/userModel.js";

const registerAdmin = asyncHandler(async (req, res) => {
  const adminExists = await User.findOne({ email: "admin@gmail.com" });
  if (adminExists) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await User.create({
    name: "Admin",
    email: "admin@gmail.com",
    password: hashedPassword,
    role: "admin",
  });

  if (admin) {
    const token = generateToken(admin._id, admin.role);
    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Admin created",
      });
  } else {
    res.status(400);
    throw new Error("Invalid admin data");
  }
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user._id, user.role);
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      });
  } else {
    res.status(400);
    throw new Error("Invalid admin data");
  }
});

const listUser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({ role: "client" });
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const listManager = asyncHandler(async (req, res) => {
  try {
    const users = await Manager.find();
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const userBlock = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const listHotels = asyncHandler(async (req, res) => {
  try {
    const hotels = await Hotel.find();
    if (hotels) {
      res.status(200).json(hotels);
    } else {
      res.status(404).json({ message: "No hotels found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const approveHotel = asyncHandler(async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { status } = req.body;
    console.log(hotelId, status);

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      res.status(400);
      throw new Error("Hotel not found");
    }
    hotel.isVerified = status;
    await hotel.save();

    res.status(200).json(hotel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const listUnlistHotel = asyncHandler(async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { status } = req.body;
    console.log(hotelId, status);

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      res.status(400);
      throw new Error("Hotel not found");
    }
    hotel.isListed = status;
    await hotel.save();

    res.status(200).json(hotel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
};

export default {
  registerAdmin,
  adminLogin,
  listUser,
  listManager,
  userBlock,
  listHotels,
  approveHotel,
  listUnlistHotel,
};
