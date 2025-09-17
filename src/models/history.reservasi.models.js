// models/reservasi.history.models.js
import mongoose from "mongoose";

const reservasiHistorySchema = new mongoose.Schema(
  {
    guestName: { type: String, required: true },
    guestEmail: { type: String, required: true },
    guestPhone: { type: String, required: true },

    hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },

    jumlahTamu: { type: Number, required: true },
    jumlahKamar: { type: Number, default: 1 },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },

    totalPrice: { type: Number, required: true },

    paymentMethod: { type: String },
    paymentStatus: { type: String },
    statusReservasi: { type: String }, // bisa simpan status terakhir (checked-out)
    paidAt: { type: Date },

    keterangan: { type: String },

    archivedAt: { type: Date, default: Date.now }, // timestamp kapan diarsip
  },
  { timestamps: true }
);

const ReservasiHistory = mongoose.model("ReservasiHistory", reservasiHistorySchema);
export default ReservasiHistory;
