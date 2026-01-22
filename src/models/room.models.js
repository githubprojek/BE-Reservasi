import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    image_room: {
      type: [String],
    },
    name_room: {
      type: String,
    },

    jenis_room: {
      type: String,
      enum: ["Standard", "Superior", "Deluxe", "Suite", "Family"],
      required: true,
    },

    harga_room: {
      type: Number,
      required: true,
    },

    fasilitas_room: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Fasilitas",
      },
    ],

    jumlah_room: {
      type: Number,
      required: true,
    },

    bed_type: {
      type: String,
      enum: ["King", "Queen", "Twin", "Single"],
      required: true,
    },

    kapasitas: {
      type: Number,
      required: true,
    },
    luas: {
      type: Number, // in sqm
      required: true,
    },
  },
  { timestamps: true },
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
