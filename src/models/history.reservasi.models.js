// models/reservasi.history.models.js
import mongoose from "mongoose";

const reservasiHistorySchema = new mongoose.Schema(
  {
    reservasi: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservasi",
      required: true,
    },
    archivedAt: { type: Date, default: Date.now },

    notes: { type: String },
  },
  { timestamps: true },
);

const ReservasiHistory = mongoose.model("ReservasiHistory", reservasiHistorySchema);
export default ReservasiHistory;
