import Reservasi from "../models/reservasi.models.js";
import Room from "../models/room.models.js";
import Hotel from "../models/hotel.models.js";
import { coreApi } from "../lib/midtrans.js";
import { archiveReservasi } from "../lib/checkoutHelper.js";
import HistoryReservasi from "../models/history.reservasi.models.js";
import { response_success, response_created, handleServiceErrorWithResponse, response_internal_server_error } from "../utils/response.js";
import ReservasiService from "../services/reservasi.service.js";

export const bayarDenganCoreAPI = async (req, res) => {
  try {
    const { reservasiId } = req.params;
    const { paymentMethod } = req.body;

    const reservasi = await Reservasi.findById(reservasiId);
    if (!reservasi) {
      return res.status(404).json({ message: "Reservasi tidak ditemukan" });
    }

    const supportedBanks = ["bca", "bri"];
    if (!supportedBanks.includes(paymentMethod)) {
      return res.status(400).json({
        message: "Metode pembayaran tidak didukung",
        received: paymentMethod,
      });
    }

    reservasi.paymentMethod = paymentMethod;

    const chargePayload = {
      payment_type: "bank_transfer",
      transaction_details: {
        order_id: `RSV-${reservasi._id}`,
        gross_amount: Number(reservasi.totalPrice),
      },
      customer_details: {
        first_name: reservasi.guestName,
        email: reservasi.guestEmail,
        phone: reservasi.guestPhone,
      },
      bank_transfer: {
        bank: paymentMethod,
      },
    };

    const chargeRes = await coreApi.charge(chargePayload);

    reservasi.paymentStatus = "pending";
    await reservasi.save();

    res.status(200).json({
      message: "Transaksi berhasil dibuat",
      reservasiId: reservasi._id,
      paymentType: paymentMethod,
      data: chargeRes,
    });
  } catch (err) {
    console.error("Midtrans Error:", err?.ApiResponse || err);
    res.status(500).json({
      message: "Gagal membuat transaksi Core API",
      error: err?.ApiResponse || err.message,
    });
  }
};

export const cekStatusPembayaran = async (req, res) => {
  try {
    const { reservasiId } = req.params;

    const reservasi = await Reservasi.findById(reservasiId);
    if (!reservasi) {
      return res.status(404).json({ message: "Reservasi tidak ditemukan" });
    }

    const orderId = `RSV-${reservasi._id}`;

    const statusRes = await coreApi.transaction.status(orderId);
    const status = statusRes.transaction_status; // 'settlement', 'pending', 'cancel', etc.

    // Update status di DB sesuai status Midtrans
    if (status === "settlement") {
      reservasi.paymentStatus = "paid";
    } else if (status === "cancel" || status === "expire") {
      reservasi.paymentStatus = "cancelled";
    } else {
      reservasi.paymentStatus = status; // bisa tetap 'pending' atau lainnya
    }

    await reservasi.save();

    res.status(200).json({
      message: "Status pembayaran berhasil dicek dan diperbarui",
      status: reservasi.paymentStatus,
      data: statusRes,
    });
  } catch (err) {
    console.error("Cek Status Error:", err);
    res.status(500).json({
      message: "Gagal mengecek status pembayaran",
      error: err.message,
    });
  }
};

export const cancelReservasi = async (req, res) => {
  const { reservasiId } = req.params;

  try {
    const reservasi = await Reservasi.findById(reservasiId);
    if (!reservasi) {
      return res.status(404).json({ message: "Reservasi tidak ditemukan" });
    }

    const orderId = `RSV-${reservasi._id}`;

    // Hanya boleh cancel jika status masih pending
    if (reservasi.paymentStatus !== "pending") {
      return res.status(400).json({
        message: `Reservasi tidak bisa dibatalkan karena status pembayaran adalah '${reservasi.paymentStatus}'`,
      });
    }

    // Cancel transaksi di Midtrans
    const cancelResponse = await coreApi.transaction.cancel(orderId);

    // Update status di database
    reservasi.paymentStatus = "cancelled";
    reservasi.statusReservasi = "cancelled";
    await reservasi.save();

    res.status(200).json({
      message: "Reservasi berhasil dibatalkan",
      midtrans: cancelResponse,
    });
  } catch (error) {
    console.error("Batalkan Reservasi Error:", error.message);
    res.status(500).json({
      message: "Gagal membatalkan reservasi",
      error: error.message,
    });
  }
};

export const createMidtransTransaction = async (req, res) => {
  try {
    const { reservasiId } = req.params;

    const reservasi = await Reservasi.findById(reservasiId);
    if (!reservasi) {
      return res.status(404).json({ message: "Reservasi tidak ditemukan" });
    }

    if (reservasi.totalPrice <= 0) {
      return res.status(400).json({ message: "Total harga tidak valid" });
    }

    const parameter = {
      transaction_details: {
        order_id: `RSV-${reservasi._id}`,
        gross_amount: reservasi.totalPrice,
      },
      customer_details: {
        first_name: reservasi.guestName,
        email: reservasi.guestEmail,
        phone: reservasi.guestPhone,
      },
    };

    const midtransRes = await coreApi.createTransaction(parameter);

    res.status(200).json({
      snapToken: midtransRes.token,
      redirectUrl: midtransRes.redirect_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal membuat transaksi Midtrans", error: error.message });
  }
};
