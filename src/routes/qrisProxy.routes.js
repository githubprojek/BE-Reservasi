// routes/qrisProxy.js
import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/qris-qr-code", async (req, res) => {
  const { url } = req.query;

  if (!url) return res.status(400).json({ message: "URL dibutuhkan" });

  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer", // penting untuk gambar
    });

    res.set("Content-Type", "image/png"); // atau image/jpeg sesuai konten aslinya
    res.send(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memuat QR code" });
  }
});

export default router;
