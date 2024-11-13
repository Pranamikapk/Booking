import bcrypt from "bcryptjs";
import crypto from "crypto";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import Hotel from "../models/hotelModel.js";
import User from "../models/userModel.js";
import { passwordResetEmail, sendOTPEmail } from "../utils/otp.js";

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

const userRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation Errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email,phone, password } = req.body;
    let existingUser = await User.findOne({ email });

    if (
      existingUser &&
      existingUser.isVerified &&
      existingUser.role === "manager"
    ) {
      return res
        .status(400)
        .json({ message: "User already exists with this email address" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = generateOTP();

    if (existingUser && !existingUser.isVerified) {
      existingUser.otp = otp;
      existingUser.password = hashedPassword;
      await existingUser.save();
      await sendOTPEmail(existingUser.email, otp);
      return res.status(201).json({
        message:
          "OTP sent successfully. Please verify to complete registration.",
        email: existingUser.email,
        name: existingUser.name,
        phone: existingUser.phone,
        role: "client",
        token: generateToken(existingUser._id, existingUser.role),
      });
    }

    const pendingUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      otp,
      role: "client",
      isVerified: false,
    });

    await sendOTPEmail(pendingUser.email, otp);
    await pendingUser.save();

    res.status(201).json({
      message: "OTP sent successfully. Please verify to complete registration.",
      name: pendingUser.name,
      email: pendingUser.email,
      phone: pendingUser.phone,
      role: pendingUser.role,
      token: generateToken(pendingUser._id, pendingUser.role),
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

const verifyOtp = async (req, res) => {
  let { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
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
    const user = await User.findOne({ email });
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

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    res.status(200).json({
      message: "Login successful",
      name: user.name,
      email: user.email,
      phone: user.phone,
      isBlocked: user.isBlocked,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    console.log("Updating user:", req.user);
    const { name, email ,phone} = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;


    const updatedUser = await user.save();

    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      token: generateToken(updatedUser._id, updateUser.role),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const googleLogin = async (req, res) => {
  const { name, email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        isVerified: true,
        password: undefined,
      });
      await user.save();
    }
    let token = generateToken(user._id, user.role);
    user.token = token;
    await user.save();
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        token: user.token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = Date.now() + 3600000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = tokenExpires;
    await user.save();

    const resetUrl = `http://localhost:5173/resetPassword?token=${resetToken}`;
    await passwordResetEmail(user.email, resetUrl);

    res
      .status(200)
      .json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Error sending reset email:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  console.log("Inside");
  const { token, newPassword } = req.body;
  console.log(token, newPassword);

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();
    console.log("Password reset successful for:", user.email);
    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const listHotels = async (req, res) => {
  try {
    
    const hotels = await Hotel.find({
      isListed: true,
    });
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const search = async (req, res) => {
  try {
    const { term, checkInDate } = req.query;
    if (!term || !checkInDate) {
      return res.status(400).json({ message: "Search term and check-in date are required" });
    }

    const checkIn = new Date(checkInDate);

    const hotels = await Hotel.find({
      $and: [
        {
          $or: [
            { "address.state": { $regex: term, $options: "i" } },
            { "rooms.room": { $regex: term, $options: "i" } },
          ],
        },
        {
          bookings: {
            $not: {
              $elemMatch: {
                checkIn: { $lte: checkIn },
                checkOut: { $gte: checkIn },
              },
            },
          },
        },
        { isListed: true },
      ],
    });
    res.json(hotels);
  } catch (error) {
    console.error("Error searching hotels:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
};

export default {
  userRegister,
  userLogin,
  updateUser,
  resendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  googleLogin,
  listHotels,
  
};
