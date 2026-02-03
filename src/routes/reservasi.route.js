import express from "express";
import {
  manualCheckout,
  getHistoryReservasi,
  createReservasi,
  getReservasi,
  getReservasiById,
  updateReservasi,
  deleteReservasi,
  createMidtransTransaction,
  checkInReservasi,
  checkOutReservasi,
  bayarDenganCoreAPI,
  cekStatusPembayaran,
  cancelReservasi,
} from "../controllers/reservasi.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

import { validateReservasiCreation } from "../middleware/validation.reservasi.js";

const router = express.Router();

router.post("/createReservasi", validateReservasiCreation, createReservasi);
router.post("/createMidtransTransaction/:reservasiId", createMidtransTransaction);
router.get("/getReservasi", protectRoute, getReservasi);
router.get("/getReservasiById/:reservasiId", protectRoute, getReservasiById);
router.put("/updateReservasi/:reservasiId", protectRoute, updateReservasi);
router.delete("/deleteReservasi/:reservasiId", protectRoute, deleteReservasi);

// ✅ Pisahkan endpoint manual checkout & checkin/checkout staff
router.post("/manualCheckout/:reservasiId", protectRoute, manualCheckout);
router.post("/checkin/:reservasiId", protectRoute, checkInReservasi);
router.post("/checkout/:reservasiId", protectRoute, checkOutReservasi);
router.get("/getCheckout", protectRoute, getHistoryReservasi);

//Payment midtrans
router.post("/core-payment/:reservasiId", bayarDenganCoreAPI);
router.get("/cek-status-pembayaran/:reservasiId", cekStatusPembayaran);
router.post("/cancelled/:reservasiId", cancelReservasi);
// router.post("/createReservasi", validateReservasiCreation, createReservasi);
// router.post("/createMidtransTransaction/:reservasiId", createMidtransTransaction);
// router.get("/getReservasi", protectRoute, getReservasi);
// router.get("/getReservasiById/:reservasiId", protectRoute, getReservasiById);
// router.put("/updateReservasi/:reservasiId", protectRoute, updateReservasi);
// router.delete("/deleteReservasi/:reservasiId", protectRoute, deleteReservasi);

// // ✅ Pisahkan endpoint manual checkout & checkin/checkout staff
// router.post("/manualCheckout/:reservasiId", protectRoute, manualCheckout);
// router.post("/checkin/:reservasiId", protectRoute, checkInReservasi);
// router.post("/checkout/:reservasiId", protectRoute, checkOutReservasi);
// router.get("/getCheckout", protectRoute, getHistoryReservasi);

// //Payment midtrans
// router.post("/core-payment/:reservasiId", bayarDenganCoreAPI);
// router.get("/cek-status-pembayaran/:reservasiId", cekStatusPembayaran);
// router.post("/cancelled/:reservasiId", cancelReservasi);

export default router;
