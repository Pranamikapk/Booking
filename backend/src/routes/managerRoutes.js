import express from "express";
import { body } from "express-validator";
import multer from "multer";
import { listReservations } from "../controller/bookingController.js";
import {
  createHotel,
  deleteHotel,
  listHotelById,
  listHotels,
  listUnlistHotel,
  updateHotel,
} from "../controller/hotelController.js";
import managerController from "../controller/managerController.js";
import userController from "../controller/userController.js";
import { managerAuth, protect } from "../middleware/authMiddleware.js";

const managerRouter = express.Router();

managerRouter.post(
  "/register",
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("phone").not().isEmpty().withMessage("Invalid phone number"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  managerController.register
);

managerRouter.post("/login", managerController.login);
managerRouter.put("/account", protect, managerController.updateProfile);
managerRouter.post("/api/auth/google-login", userController.googleLogin);
managerRouter.post("/resendOtp", managerController.resendOtp);
managerRouter.post("/verifyOtp", managerController.verifyOtp);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

managerRouter.post(
  "/addHotel",
  upload.array("photos", 6),
  managerAuth,
  createHotel
);
managerRouter.get("/hotels/:managerId", managerAuth, listHotels);
managerRouter.get("/hotel/:hotelId", managerAuth, listHotelById);
managerRouter.put("/hotel/:hotelId/edit", managerAuth, updateHotel);
managerRouter.put("/list/:hotelId", managerAuth, listUnlistHotel);
managerRouter.delete("/hotel/:hotelId", managerAuth, deleteHotel);


managerRouter.get("/reservations/:managerId",managerAuth,listReservations)
export default managerRouter;
