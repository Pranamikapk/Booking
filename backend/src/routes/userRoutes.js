import express from "express";
import { body } from "express-validator";
import { createBooking, verifyPayment } from "../controller/bookingController.js";
import { hotelDetails } from "../controller/hotelController.js";
import userController, { search } from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post(
  "/register",
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.userRegister
);

userRouter.post("/login", userController.userLogin);
userRouter.post("/api/auth/google-login", userController.googleLogin);
userRouter.put("/user", protect, userController.updateUser);

userRouter.post("/resendOtp", userController.resendOtp);
userRouter.post("/verifyOtp", userController.verifyOtp);
userRouter.post("/forgotPassword", userController.forgotPassword);
userRouter.post("/resetPassword", userController.resetPassword);

//Hotels
userRouter.get("/hotels", userController.listHotels);
userRouter.get("/hotel/:hotelId", hotelDetails);
userRouter.get("/hotel/search", search);

//Booking
userRouter.post("/booking",protect, createBooking)
userRouter.post("/verifyPayment", verifyPayment);




export default userRouter;
