import Room from "../models/room.models.js";
import cloudinary from "../lib/cloudinary.js";
import Hotel from "../models/hotel.models.js";
import Reservasi from "../models/reservasi.models.js";

export const createRoom = async (req, res) => {
  const { hotel, nameRoom, jenis_room, harga_room, fasilitas_room, jumlah_room, bed_type, kapasitas, luas } = req.body;

  try {
    if (!hotel || !nameRoom || !jenis_room || !harga_room || !jumlah_room || !bed_type || !kapasitas || !luas) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hotelData = await Hotel.findById(hotel);
    if (!hotelData) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const files = req.files;
    let imageUrl = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const uploadedResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "rooms" }, (err, result) => {
              if (err) reject(err);
              else resolve(result);
            })
            .end(file.buffer);
        });
        imageUrl.push(uploadedResponse.secure_url);
      }
    }

    const newRoom = new Room({
      hotel: hotelData._id,
      image_room: imageUrl,
      nameRoom,
      jenis_room,
      harga_room,
      fasilitas_room,
      jumlah_room,
      bed_type,
      kapasitas,
      luas,
    });

    const savedRoom = await newRoom.save();

    res.status(201).json({
      message: "Room created successfully",
      room: savedRoom,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong in createRoom" });
  }
};

export const getRoom = async (req, res) => {
  try {
    const rooms = await Room.find({}).populate("hotel").populate("fasilitas_room");

    const roomsWithAvailability = await Promise.all(
      rooms.map(async (room) => {
        const bookedCount = await Reservasi.countDocuments({
          room: room._id,
          checkOut: { $gte: new Date() }, // hanya hitung yang belum checkout
        });

        const availableRoom = room.jumlah_room - bookedCount;

        return {
          ...room.toObject(),
          bookedCount,
          availableRoom: availableRoom < 0 ? 0 : availableRoom,
        };
      })
    );

    res.status(200).json({ rooms: roomsWithAvailability });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong getRoom" });
  }
};

export const getRoomById = async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findById(roomId).populate("hotel").populate("fasilitas_room"); // ⬅️ Tambahin ini!
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ room });
    console.log(`Room dengan Id (${room._id}) successfully fetched`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong getRoomById" });
  }
};

export const updateRoom = async (req, res) => {
  const { roomId } = req.params;
  let { nameRoom, jenis_room, harga_room, fasilitas_room, jumlah_room, remove_images, bed_type, kapasitas, luas } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // FIX 1: Parse fasilitas_room & remove_images
    if (typeof fasilitas_room === "string") {
      fasilitas_room = JSON.parse(fasilitas_room);
    }
    if (typeof remove_images === "string") {
      remove_images = JSON.parse(remove_images);
    }

    const files = req.files;
    let imageUrl = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const uploadedResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "rooms" }, (err, result) => {
              if (err) reject(err);
              else resolve(result);
            })
            .end(file.buffer);
        });
        imageUrl.push(uploadedResponse.secure_url);
      }
    }

    // FIX 2: Hapus image lama yang dihapus user
    if (remove_images && remove_images.length > 0) {
      room.image_room = room.image_room.filter((url) => !remove_images.includes(url));
    }

    if (imageUrl.length > 0) {
      room.image_room.push(...imageUrl);
    }

    // ✅ FIX 3: Pakai nullish coalescing biar array kosong TETAP DISIMPAN
    room.jenis_room = jenis_room ?? room.jenis_room;
    room.nameRoom = nameRoom ?? room.nameRoom;
    room.harga_room = harga_room ?? room.harga_room;
    room.fasilitas_room = fasilitas_room ?? room.fasilitas_room;
    room.jumlah_room = jumlah_room ?? room.jumlah_room;
    room.bed_type = bed_type ?? room.bed_type;
    room.kapasitas = kapasitas ?? room.kapasitas;
    room.luas = luas ?? room.luas;

    const savedRoom = await room.save();

    res.status(200).json({
      message: "Room updated successfully",
      room: savedRoom,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong in updateRoom" });
  }
};

export const deleteRoom = async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findByIdAndDelete(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "RoomType deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong deleteRoom" });
  }
};

export const getAvailableRooms = async (req, res) => {
  try {
    const { hotelId, checkIn, checkOut } = req.query;

    if (!hotelId || !checkIn || !checkOut) {
      return res.status(400).json({ message: "hotelId, checkIn, dan checkOut wajib diisi" });
    }

    const checkInDate = new Date(checkIn);
    checkInDate.setHours(14, 0, 0, 0);

    const checkOutDate = new Date(checkOut);
    checkOutDate.setHours(12, 0, 0, 0);

    const rooms = await Room.find({ hotel: hotelId });

    const result = await Promise.all(
      rooms.map(async (room) => {
        const bookedCount = await Reservasi.countDocuments({
          room: room._id,
          checkIn: { $lte: checkOutDate },
          checkOut: { $gte: checkInDate },
        });

        const availableRoom = room.jumlah_room - bookedCount;

        return {
          ...room.toObject(),
          bookedCount,
          availableRoom: availableRoom < 0 ? 0 : availableRoom,
        };
      })
    );

    // hanya return yang available > 0
    res.status(200).json({ rooms: result.filter((r) => r.availableRoom > 0) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data available room", error: error.message });
  }
};
