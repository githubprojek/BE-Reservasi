import Reservasi from "../models/reservasi.models.js";
import Room from "../models/room.models.js";
import Hotel from "../models/hotel.models.js";
import { coreApi } from "../lib/midtrans.js";
import { archiveReservasi } from "../lib/checkoutHelper.js";
import HistoryReservasi from "../models/history.reservasi.models.js";

export const bayarDenganCoreAPI = async (req, res) => {
  try {
    const { reservasiId } = req.params;
    const { paymentMethod } = req.body; // ✅ Ambil dari frontend

    const reservasi = await Reservasi.findById(reservasiId);
    if (!reservasi) {
      return res.status(404).json({ message: "Reservasi tidak ditemukan" });
    }

    // ✅ Validasi metode
    const allowedMethods = ["bni", "bri", "qris"];
    if (!allowedMethods.includes(paymentMethod)) {
      return res.status(400).json({ message: "Metode pembayaran tidak didukung" });
    }

    // ✅ Simpan metode pembayaran ke database
    reservasi.paymentMethod = paymentMethod;

    // ✅ Payload dasar
    const chargePayload = {
      // payment_type: paymentMethod,
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

    // ✅ Tambahan payload berdasarkan tipe pembayaran
    switch (paymentMethod) {
      case "qris":
        chargePayload.payment_type = "qris";
        chargePayload.qris = {};
        break;
      case "bni":
        chargePayload.payment_type = "bank_transfer";
        chargePayload.bank_transfer = {
          bank: "bni",
        };
        break;
      case "bri":
        chargePayload.payment_type = "bank_transfer";
        chargePayload.bank_transfer = {
          bank: "bri",
        };
        break;
    }

    // ✅ Lakukan charge
    const chargeRes = await coreApi.charge(chargePayload);

    // ✅ Simpan status awal
    reservasi.paymentStatus = "pending";
    await reservasi.save();

    // ✅ Kirim respons
    res.status(200).json({
      message: "Transaksi berhasil dibuat",
      reservasiId: reservasi._id,
      paymentType: paymentMethod,
      data: chargeRes,
    });
  } catch (err) {
    console.error("Midtrans Error:", err);
    res.status(500).json({
      message: "Gagal membuat transaksi Core API",
      error: err.message,
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

export const createReservasi = async (req, res) => {
  try {
    const { guestName, guestEmail, guestPhone, hotel, room, jumlahTamu, jumlahKamar, checkIn, checkOut, keterangan, paymentMethod } = req.body;

    if (!guestName || !guestEmail || !guestPhone || !hotel || !room || !jumlahTamu || !checkIn || !checkOut) {
      return res.status(400).json({ message: "Semua field wajib diisi!" });
    }

    const hotelData = await Hotel.findById(hotel);
    if (!hotelData) {
      return res.status(404).json({ message: "Hotel tidak ditemukan" });
    }

    const roomData = await Room.findById(room);
    if (!roomData) {
      return res.status(404).json({ message: "Room tidak ditemukan" });
    }

    const checkInDate = new Date(checkIn);
    checkInDate.setHours(14, 0, 0, 0);

    const checkOutDate = new Date(checkOut);
    checkOutDate.setHours(12, 0, 0, 0);

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ message: "Tanggal check-out harus setelah check-in" });
    }

    const bookedCount = await Reservasi.countDocuments({
      room: roomData._id,
      $or: [
        {
          checkIn: { $lte: checkOutDate },
          checkOut: { $gte: checkInDate },
        },
      ],
    });

    const availableRoom = roomData.jumlah_room - bookedCount;
    if (availableRoom <= 0) {
      return res.status(400).json({
        message: "Tidak ada kamar tersedia di tanggal yang dipilih",
      });
    }

    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) {
      return res.status(400).json({
        message: "Tanggal check-in/check-out tidak valid",
      });
    }

    const totalPrice = diffDays * roomData.harga_room * (jumlahKamar || 1);

    const newReservasi = new Reservasi({
      guestName,
      guestEmail,
      guestPhone,
      hotel: hotelData._id,
      room: roomData._id,
      jumlahTamu,
      jumlahKamar: jumlahKamar || 1,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
      keterangan,
      statusReservasi: "pending",
      paymentStatus: "pending",
      paymentMethod: paymentMethod || "qris",
    });

    const savedReservasi = await newReservasi.save();

    res.status(201).json({
      message: "Reservasi berhasil dibuat",
      reservasi: savedReservasi,
      bookedCount: bookedCount + 1,
      availableRoom: availableRoom - 1,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi kesalahan di createReservasi",
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

export const getReservasi = async (req, res) => {
  try {
    const reservasi = await Reservasi.find({}).populate("hotel").populate("room");
    res.status(200).json({ reservasi });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Terjadi kesalahan di getReservasi",
      error: error.message,
    });
  }
};

export const getReservasiById = async (req, res) => {
  const { reservasiId } = req.params;
  try {
    const reservasi = await Reservasi.findById(reservasiId).populate("hotel").populate("room");
    if (!reservasi) {
      return res.status(404).json({ message: "Reservasi tidak ditemukan" });
    }
    res.status(200).json({ reservasi });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Terjadi kesalahan di getReservasiById",
      error: error.message,
    });
  }
};

export const updateReservasi = async (req, res) => {
  const { reservasiId } = req.params;
  const { checkIn, checkOut, statusReservasi, paymentStatus, jumlahKamar, jumlahTamu } = req.body;

  try {
    const reservasi = await Reservasi.findById(reservasiId).populate("room");
    if (!reservasi) {
      return res.status(404).json({ message: "Reservasi tidak ditemukan" });
    }

    if (jumlahKamar !== undefined) reservasi.jumlahKamar = Number(jumlahKamar);
    if (jumlahTamu !== undefined) reservasi.jumlahTamu = Number(jumlahTamu);

    if (checkIn) {
      const checkInDate = new Date(checkIn);
      checkInDate.setHours(14, 0, 0, 0);
      reservasi.checkIn = checkInDate;
    }

    if (checkOut) {
      const checkOutDate = new Date(checkOut);
      checkOutDate.setHours(12, 0, 0, 0);
      reservasi.checkOut = checkOutDate;
    }

    if (reservasi.checkOut <= reservasi.checkIn) {
      return res.status(400).json({
        message: "Tanggal check-out harus setelah check-in",
      });
    }

    if (checkIn || checkOut || jumlahKamar) {
      const diffTime = Math.abs(reservasi.checkOut - reservasi.checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      reservasi.totalPrice = diffDays * reservasi.room.harga_room * (reservasi.jumlahKamar || 1);
    }

    if (statusReservasi) reservasi.statusReservasi = statusReservasi;
    if (paymentStatus) reservasi.paymentStatus = paymentStatus;

    if (paymentStatus === "paid" && !reservasi.paidAt) {
      reservasi.paidAt = new Date();
    }

    const updatedReservasi = await reservasi.save();

    res.status(200).json({
      message: "Reservasi berhasil diupdate",
      reservasi: updatedReservasi,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Terjadi kesalahan di updateReservasi",
      error: error.message,
    });
  }
};

export const deleteReservasi = async (req, res) => {
  const { reservasiId } = req.params;
  try {
    const reservasi = await Reservasi.findByIdAndDelete(reservasiId);
    if (!reservasi) {
      return res.status(404).json({ message: "Reservasi tidak ditemukan" });
    }

    res.status(200).json({ message: "Reservasi berhasil dihapus" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Terjadi kesalahan di deleteReservasi",
      error: error.message,
    });
  }
};

export const manualCheckout = async (req, res) => {
  const { reservasiId } = req.params;
  try {
    const archivedId = await archiveReservasi(reservasiId);
    res.status(200).json({
      message: `Reservasi ${archivedId} successfully moved to history`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

export const getHistoryReservasi = async (req, res) => {
  try {
    const history = await HistoryReservasi.find({}).populate("hotel").populate("room");
    res.status(200).json({ history });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get history reservasi" });
  }
};
// ✅ CONTROLLER: Check-In Reservasi
export const checkInReservasi = async (req, res) => {
  const { reservasiId } = req.params;

  try {
    const reservasi = await Reservasi.findById(reservasiId);
    if (!reservasi) {
      return res.status(404).json({ message: "Reservasi tidak ditemukan" });
    }

    if (reservasi.statusReservasi !== "confirmed") {
      return res.status(400).json({ message: "Reservasi tidak valid untuk check-in" });
    }

    reservasi.statusReservasi = "checked-in";
    reservasi.checkedInAt = new Date(); // opsional, kalau mau simpan timestamp check-in

    await reservasi.save();

    res.status(200).json({
      message: "Reservasi berhasil di-check-in",
      reservasi,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Terjadi kesalahan di checkInReservasi",
      error: error.message,
    });
  }
};

export const checkOutReservasi = async (req, res) => {
  const { reservasiId } = req.params;

  try {
    const reservasi = await Reservasi.findById(reservasiId);
    if (!reservasi) {
      return res.status(404).json({ message: "Reservasi tidak ditemukan" });
    }

    if (reservasi.statusReservasi !== "checked-in") {
      return res.status(400).json({ message: "Reservasi belum check-in, tidak bisa check-out" });
    }

    // Update status jadi checked-out
    reservasi.statusReservasi = "checked-out";
    await reservasi.save();

    // Langsung arsip ke history
    await archiveReservasi(reservasiId);

    res.status(200).json({
      message: "Reservasi berhasil di-check-out dan diarsipkan",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Terjadi kesalahan di checkOutReservasi",
      error: error.message,
    });
  }
};
