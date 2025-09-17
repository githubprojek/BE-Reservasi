import express from "express";
import { createRoom, getRoom, getRoomById, updateRoom, deleteRoom, getAvailableRooms } from "../controllers/room.controllers.js";
import { protectRoute, authorizeRoles } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/uploadImage.js";

const router = express.Router();

router.post("/createRoom", protectRoute, authorizeRoles("Super Admin"), upload.array("image_room"), createRoom);
router.get("/get-available", getAvailableRooms);
router.get("/getRoom", getRoom);
router.get("/getRoomById/:roomId", getRoomById);
router.put("/updateRoom/:roomId", protectRoute, authorizeRoles("Super Admin"), upload.array("image_room"), updateRoom);
router.delete("/deleteRoom/:roomId", protectRoute, authorizeRoles("Super Admin"), deleteRoom);
// router.post("/createRoom", protectRoute, authorizeRoles("Super Admin"), createRoom);
// router.get("/getRoom", protectRoute, getRoom);
// router.get("/getRoomById/:roomId", protectRoute, getRoomById);
// router.put("/updateRoom/:roomId", protectRoute, authorizeRoles("Admin, Super Admin"), updateRoom);
// router.delete("/deleteRoom/:roomId", protectRoute, authorizeRoles("Super Admin"), deleteRoom);

export default router;
