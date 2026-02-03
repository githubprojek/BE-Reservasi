import express from "express";
import { createRoom, getRoom, getRoomById, updateRoom, deleteRoom, getAvailableRooms } from "../controllers/room.controllers.js";
import { protectRoute, authorizeRoles } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/uploadImage.js";
import { validateRoomId, validateCreateRoom, validateAvailableRoom } from "../middleware/validation.room.js";
const router = express.Router();

router.post("/createRoom", validateCreateRoom, upload.array("image_room"), createRoom);
router.get("/getAvailable", validateAvailableRoom, getAvailableRooms);
router.get("/getRoom", getRoom);
router.get("/getRoom/:roomId", validateRoomId, getRoomById);
router.put("/updateRoom/:roomId", validateRoomId, upload.array("image_room"), updateRoom);
router.delete("/deleteRoom/:roomId", validateRoomId, deleteRoom);

// router.post("/createRoom", protectRoute, authorizeRoles("Super Admin"), upload.array("image_room"), createRoom);
// router.get("/get-available", getAvailableRooms);
// router.get("/getRoom", getRoom);
// router.get("/getRoomById/:roomId", getRoomById);
// router.put("/updateRoom/:roomId", protectRoute, authorizeRoles("Super Admin"), upload.array("image_room"), updateRoom);
// router.delete("/deleteRoom/:roomId", protectRoute, authorizeRoles("Super Admin"), deleteRoom);

export default router;
