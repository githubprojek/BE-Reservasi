import express from "express";
import { archiveReservasi, createReservasi, getReservasi, getReservasiById, updateReservasi, deleteReservasi, checkInReservasi, checkOutReservasi } from "../controllers/reservasi.controllers.js";
import { validateReservasiId, validateCreateReservasi, validateUpdateReservasi, validateDeleteReservasi, validateCheckIn, validateCheckOut } from "../middleware/validation.reservasi.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/createReservasi", validateCreateReservasi, createReservasi);
router.get("/getReservasi", getReservasi);
router.get("/getReservasi/:reservasiId", validateReservasiId, getReservasiById);
router.put("/updateReservasi/:reservasiId", validateReservasiId, validateUpdateReservasi, updateReservasi);
router.delete("/deleteReservasi/:reservasiId", validateReservasiId, validateDeleteReservasi, deleteReservasi);

router.post("/checkin/:reservasiId", validateCheckIn, checkInReservasi);
router.post("/checkout/:reservasiId", validateCheckOut, checkOutReservasi);
router.get("/archive", archiveReservasi);

export default router;
