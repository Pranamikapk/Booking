import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { sendOTPEmail } from "../utils/otp.js";

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation Errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, password } = req.body;

    let existingManager = await User.findOne({ email, role: "manager" });
    if (existingManager && existingManager.role === "client") {
      return res
        .status(400)
        .json({ message: "user already exists with this email address" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = generateOTP();

    if (
      existingManager &&
      existingManager.isVerified &&
      existingManager.role === "client"
    ) {
      existingManager.otp = otp;
      existingManager.password = hashedPassword;
      existingManager.phone = phone;
      existingManager.role = "manager";
      existingManager.isVerified = false;
      await existingManager.save();
      console.log("existingManager.role : ", existingManager.role);

      await sendOTPEmail(existingManager.email, otp);
      let token = generateToken(existingManager._id, "manager");
      console.log("managerToken:", token);

      return res.status(201).json({
        message:
          "OTP sent successfully. Please verify to complete registration.",
        email: existingManager.email,
        name: existingManager.name,
        phone: existingManager.phone,
        role: existingManager.role,
        token,
      });
    }

    const pendingManager = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      otp,
      role: "manager",
      isVerified: false,
    });

    await sendOTPEmail(pendingManager.email, otp);
    await pendingManager.save();
    console.log("pendingManager:", pendingManager.role);

    res.status(201).json({
      message: "OTP sent successfully. Please verify to complete registration.",
      name: pendingManager.name,
      email: pendingManager.email,
      phone: pendingManager.phone,
      role: pendingManager.role,
      token: generateToken(pendingManager._id, "manager"),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const manager = await User.findOne({ email, role: "manager" });
    console.log(manager);

    if (manager && (await bcrypt.compare(password, manager.password))) {
      const token = generateToken(manager._id, "manager");
      console.log("manager2:", token);

      res.json({
        _id: manager.id,
        name: manager.name,
        email: manager.email,
        phone: manager.phone,
        isBlocked: manager.isBlocked,
        role: "manager",
        token,
      });
    } else {
      res.status(400);
      throw new Error("Invalid manager data");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const manager = await User.findOne({ email });
    if (!manager) {
      return res.status(400).json({ message: "manager not found" });
    }

    manager.name = name || manager.name;
    manager.email = email || manager.email;
    manager.phone = phone || manager.phone;

    const updatedmanager = await manager.save();
    res.status(200).json({
      id: updatedmanager.id,
      name: updatedmanager.name,
      email: updatedmanager.email,
      phone: updatedmanager.phone,
      token: generateToken(updatedmanager._id, updatedmanager.role),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const generateToken = (id, role) => {
  console.log("Generating token with role:", role);

  return jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
};

export default {
  login,
  register,
  updateProfile,
};
