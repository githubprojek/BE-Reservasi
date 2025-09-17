import mongoose from "mongoose";

const fasilitasSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Fasilitas = mongoose.model("Fasilitas", fasilitasSchema);
export default Fasilitas;
