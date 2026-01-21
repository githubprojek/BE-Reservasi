import express from "express";
import { createFasilitas, getFasilitas, getFasilitasById, updateFasilitas, deleteFasilitas } from "../controllers/fasilitas.controllers.js";
import { protectRoute, authorizeRoles } from "../middleware/auth.middleware.js";
import { validateFasilitasId, validateCreateFasilitas, validateUpdateFasilitas, validateDeleteFasilitas } from "../middleware/validation.fasilitas.js";
const router = express.Router();

// router.post("/createFasilitas", protectRoute, authorizeRoles("Super Admin"), createFasilitas);
// router.get("/getFasilitas", getFasilitas);
// router.get("/getFasilitas/:fasilitasId", protectRoute, validateFacilityId, getFasilitasById);
// router.put("/updateFasilitas/:fasilitasId", protectRoute, authorizeRoles("Super Admin"), updateFasilitas);
// router.delete("/deleteFasilitas/:fasilitasId", protectRoute, authorizeRoles("Super Admin"), deleteFasilitas);

router.post("/createFasilitas", validateCreateFasilitas, createFasilitas);
router.get("/getFasilitas", getFasilitas);
router.get("/getFasilitas/:fasilitasId", validateFasilitasId, getFasilitasById);
router.put("/updateFasilitas/:fasilitasId", validateUpdateFasilitas, updateFasilitas);
router.delete("/deleteFasilitas/:fasilitasId", validateDeleteFasilitas, deleteFasilitas);

export default router;
