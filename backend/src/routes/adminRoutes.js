import express from "express";
import { adminAuth } from "../../src/middleware/authMiddleware.js";
import adminController from "../controller/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/register", adminController.registerAdmin);
adminRouter.post("/login", adminController.adminLogin);
adminRouter.get("/users", adminAuth, adminController.listUser);
adminRouter.post("/userBlock", adminAuth, adminController.userBlock);
adminRouter.get("/managers", adminController.listManager);
adminRouter.get("/hotels", adminController.listHotels);
adminRouter.post("/approve/:hotelId", adminAuth, adminController.approveHotel);
adminRouter.post("/list/:hotelId", adminAuth, adminController.listUnlistHotel);

export default adminRouter;
