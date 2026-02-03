import express from "express";
import { createMidtransTransaction, bayarDenganCoreAPI, cekStatusPembayaran, cancelReservasi } from "../controllers/payment.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/createMidtransTransaction/:reservasiId", createMidtransTransaction);
router.post("/core-payment/:reservasiId", bayarDenganCoreAPI);
router.get("/cek-status-pembayaran/:reservasiId", cekStatusPembayaran);
router.post("/cancelled/:reservasiId", cancelReservasi);

export default router;
