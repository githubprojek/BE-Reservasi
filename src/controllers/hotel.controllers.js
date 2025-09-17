import Hotel from "../models/hotel.models.js";
import cloudinary from "../lib/cloudinary.js";
import Room from "../models/room.models.js";

export const createHotel = async (req, res) => {
  try {
    const { nama_hotel, alamat_hotel, kota_hotel, email_hotel, notelp_hotel } = req.body;

    if (!nama_hotel || !alamat_hotel || !kota_hotel || !email_hotel || !notelp_hotel) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Cek duplikat email
    const existingHotel = await Hotel.findOne({ email_hotel });
    if (existingHotel) {
      return res.status(400).json({ message: "Email hotel sudah digunakan." });
    }

    const existingnoTelp = await Hotel.findOne({ notelp_hotel });
    if (existingnoTelp) {
      return res.status(400).json({ message: "notelp hotel sudah digunakan." });
    }

    const files = req.files;
    let imageUrls = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "hotels" }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            })
            .end(file.buffer);
        });

        imageUrls.push(uploadResult.secure_url);
      }
    }

    const newHotel = new Hotel({
      nama_hotel,
      alamat_hotel,
      kota_hotel,
      email_hotel,
      notelp_hotel,
      image_hotel: imageUrls,
    });

    await newHotel.save();

    res.status(201).json({
      message: "Hotel created successfully",
      hotel: newHotel,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error in createHotel" });
  }
};

export const getHotel = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json({ hotels });
    console.log("Hotel fetched successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong getHotel" });
  }
};

export const getHotelById = async (req, res) => {
  const { hotelId } = req.params;

  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    console.log(`Hotel with id ${hotelId} fetched successfully`);
    res.status(200).json({ hotel });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong getHotelById" });
  }
};

export const updateHotel = async (req, res) => {
  const { hotelId } = req.params;
  const { nama_hotel, alamat_hotel, kota_hotel, email_hotel, notelp_hotel, remove_images } = req.body;

  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    if (!nama_hotel || !alamat_hotel || !kota_hotel || !email_hotel || !notelp_hotel) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!/^\d+$/.test(notelp_hotel)) {
      return res.status(400).json({ message: "Phone number must be numeric" });
    }

    // ✅ Cek duplikat email (kecuali dirinya sendiri)
    const emailInUse = await Hotel.findOne({ email_hotel, _id: { $ne: hotelId } });
    if (emailInUse) {
      return res.status(400).json({ message: "Email hotel sudah digunakan hotel lain." });
    }

    // Upload gambar baru (jika ada)
    const files = req.files;
    let imageUrls = hotel.image_hotel || [];

    if (files && files.length > 0) {
      for (const file of files) {
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "hotels" }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            })
            .end(file.buffer);
        });

        imageUrls.push(uploadResult.secure_url);
      }
    }

    if (remove_images && remove_images.length > 0) {
      imageUrls = imageUrls.filter((url) => !remove_images.includes(url));
    }

    hotel.image_hotel = imageUrls;
    hotel.nama_hotel = nama_hotel;
    hotel.alamat_hotel = alamat_hotel;
    hotel.kota_hotel = kota_hotel;
    hotel.email_hotel = email_hotel;
    hotel.notelp_hotel = notelp_hotel;

    const savedHotel = await hotel.save();

    res.status(200).json({
      message: "Hotel updated successfully",
      hotel: savedHotel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong while updating hotel" });
  }
};

export const deleteHotel = async (req, res) => {
  const { hotelId } = req.params;
  try {
    // Cari hotel dulu
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Hapus semua room (optional)
    try {
      await Room.deleteMany({ hotel: hotelId });
    } catch (err) {
      console.log("Room deletion error:", err);
    }

    // Hapus hotel
    await hotel.deleteOne();

    console.log("Hotel and related rooms deleted successfully");
    res.status(200).json({ message: "Hotel and all its rooms have been deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong while deleting hotel" });
  }
};
