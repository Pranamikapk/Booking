import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import Manager from "../models/managerModel.js";
import { sendOTPEmail } from "../utils/otp.js";

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
};

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, licence, password } = req.body;

    let existingManager = await Manager.findOne({ email });
    if (existingManager) {
      return res.status(400).json({ message: "Manager already exists with this email address" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = generateOTP();

    const newManager = new Manager({
      name,
      email,
      phone,
      password: hashedPassword,
      licence,
      isVerified: false,
      isApproved: false,
    });

    try {
      await sendOTPEmail(newManager.email, otp);
      newManager.otp = otp; 
    } catch (emailError) {
      console.error(`Failed to send OTP email to ${newManager.email}:`, emailError.message);
      return res.status(500).json({ message: "Failed to send OTP email. Please try again." });
    }

    await newManager.save();

    res.status(201).json({
      message: "OTP sent successfully. Please verify to complete registration.",
      name: newManager.name,
      email: newManager.email,
      phone: newManager.phone,
      token: generateToken(newManager._id, "manager"),
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

const verifyOtp = async (req, res) => {
  let { email, otp } = req.body;
  try {
    const user = await Manager.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isOtpExpired = user.otpExpires && Date.now() > user.otpExpires;
    if (isOtpExpired) {
      console.log("OTP expired:", otp);
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    console.log("Stored OTP:", user.otp);
    console.log("Received OTP:", otp);

    if (user.otp.toString() === otp.toString()) {
      user.isVerified = true;
      user.otp = null;
      user.otpExpires = null;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id, user.role),
      });
    } else {
      console.log("Invalid OTP:", otp);
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Manager.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 1 * 60 * 1000;
    await user.save();

    await sendOTPEmail(user.email, otp);
    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const manager = await Manager.findOne({ email });
    if (!manager) {
      return res.status(400).json({ message: "Invalid manager data" });
    }

    if (await bcrypt.compare(password, manager.password)) {
      const token = generateToken(manager._id, "manager");
      res.json({
        _id: manager._id,
        name: manager.name,
        email: manager.email,
        phone: manager.phone,
        isBlocked: manager.isBlocked,
        isVerified: manager.isVerified,
        isApproved: manager.isApproved,
        token,
      });
    } else {
      res.status(400).json({ message: "Invalid password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, licence } = req.body;
    const manager = await Manager.findOne({ email });

    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    manager.name = name || manager.name;
    manager.phone = phone || manager.phone;
    manager.licence = licence || manager.licence;

    const updatedManager = await manager.save();

    res.status(200).json({
      _id: updatedManager._id,
      name: updatedManager.name,
      email: updatedManager.email,
      phone: updatedManager.phone,
      licence: updatedManager.licence,
      token: generateToken(updatedManager._id, "manager"),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default {
  register,
  resendOtp,
  verifyOtp,
  login,
  updateProfile,
};
