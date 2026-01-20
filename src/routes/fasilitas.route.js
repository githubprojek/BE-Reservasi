import express from "express";
import { createFasilitas, getFasilitas, getFasilitasById, updateFasilitas, deleteFasilitas } from "../controllers/fasilitas.controllers.js";
import { protectRoute, authorizeRoles } from "../middleware/auth.middleware.js";
import { validateFacilityId } from "../middleware/validation.fasilitas.js";
const router = express.Router();

router.post("/createFasilitas", protectRoute, authorizeRoles("Super Admin"), createFasilitas);
router.get("/getFasilitas", getFasilitas);
router.get("/getFasilitas/:fasilitasId", validateFacilityId, getFasilitasById);
router.put("/updateFasilitas/:fasilitasId", protectRoute, authorizeRoles("Super Admin"), updateFasilitas);
router.delete("/deleteFasilitas/:fasilitasId", protectRoute, authorizeRoles("Super Admin"), deleteFasilitas);

export default router;
