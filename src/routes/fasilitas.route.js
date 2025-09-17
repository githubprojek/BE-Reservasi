import express from "express";
import { createFasilitas, getFasilitas, getFasilitasById, updateFasilitas, deleteFasilitas } from "../controllers/fasilitas.controllers.js";
import { protectRoute, authorizeRoles } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/createFasilitas", protectRoute, authorizeRoles("Super Admin"), createFasilitas);
router.get("/getFasilitas", getFasilitas);
router.get("/getFasilitas/:fasilitasId", protectRoute, getFasilitasById);
router.put("/updateFasilitas/:fasilitasId", protectRoute, authorizeRoles("Super Admin"), updateFasilitas);
router.delete("/deleteFasilitas/:fasilitasId", protectRoute, authorizeRoles("Super Admin"), deleteFasilitas);

export default router;
