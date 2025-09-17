import mongoose from "mongoose";

const reservasiSchema = new mongoose.Schema(
  {
    guestName: {
      type: String,
      required: true,
    },
    guestEmail: {
      type: String,
      required: true,
    },
    guestPhone: {
      type: String,
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    jumlahTamu: {
      type: Number,
      required: true,
    },
    jumlahKamar: {
      type: Number,
      default: 1,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    statusReservasi: {
      type: String,
      enum: ["pending", "checked-in", "checked-out", "cancelled"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["bni", "bri", "qris"],
      default: "qris",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },

    keterangan: {
      type: String,
    },
  },
  { timestamps: true }
);

const Reservasi = mongoose.model("Reservasi", reservasiSchema);
export default Reservasi;
