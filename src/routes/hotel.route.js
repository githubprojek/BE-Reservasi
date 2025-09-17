import express from "express";
import { createHotel, getHotel, getHotelById, updateHotel, deleteHotel } from "../controllers/hotel.controllers.js";
import { protectRoute, authorizeRoles } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/uploadImage.js";

const router = express.Router();

router.post("/createHotel", protectRoute, authorizeRoles("Super Admin"), upload.array("image_hotel"), createHotel);
router.get("/getHotel", getHotel);
router.get("/getHotelById/:hotelId", protectRoute, getHotelById);
router.put("/updateHotel/:hotelId", protectRoute, authorizeRoles("Super Admin"), upload.array("image_hotel"), updateHotel);
router.delete("/deleteHotel/:hotelId", protectRoute, authorizeRoles("Super Admin"), deleteHotel);

// router.post("/createHotel", protectRoute, createHotel);
// router.get("/getHotel", getHotel);
// router.get("/getHotelById/:hotelId", protectRoute, getHotelById);
// router.put("/updateHotel/:hotelId", protectRoute, updateHotel);
// router.delete("/deleteHotel/:hotelId", protectRoute, deleteHotel);

export default router;
