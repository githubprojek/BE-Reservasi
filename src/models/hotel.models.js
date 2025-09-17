import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    image_hotel: {
      type: [String],
    },
    nama_hotel: {
      type: String,
      required: true,
    },
    alamat_hotel: {
      type: String,
      required: true,
    },
    kota_hotel: {
      type: String,
      required: true,
    },
    email_hotel: {
      type: String,
      required: true,
      unique: true,
    },
    notelp_hotel: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);
export default Hotel;
