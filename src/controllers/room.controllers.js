import Room from "../models/room.models.js";
import cloudinary from "../lib/cloudinary.js";
import Hotel from "../models/hotel.models.js";
import Reservasi from "../models/reservasi.models.js";
import RoomService from "../services/room.service.js";
import { response_success, response_created, handleServiceErrorWithResponse } from "../utils/response.js";

export const createRoom = async (req, res) => {
  const { hotel, name_room, jenis_room, harga_room, fasilitas_room, jumlah_room, bed_type, kapasitas, luas } = req.body;

  try {
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

    const createRoomControllerService = await RoomService.createRoom({
      hotel,
      image_room: imageUrl,
      name_room,
      jenis_room,
      harga_room,
      fasilitas_room,
      jumlah_room,
      bed_type,
      kapasitas,
      luas,
    });
    if (!createRoomControllerService.status) {
      return handleServiceErrorWithResponse(res, createRoomControllerService);
    }

    return response_created(res, { room: createRoomControllerService.data }, "Room created successfully");
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
          checkOut: { $gte: new Date() },
        });

        const availableRoom = room.jumlah_room - bookedCount;

        return {
          ...room.toObject(),
          bookedCount,
          availableRoom: availableRoom < 0 ? 0 : availableRoom,
        };
      }),
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
    const room = await Room.findById(roomId).populate("hotel").populate("fasilitas_room");
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
  const { name_room, jenis_room, harga_room, fasilitas_room, jumlah_room, bed_type, kapasitas, luas, image_room, remove_images } = req.body;

  const files = req.files;
  let imageUrl = [];

  try {
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

    const payload = {
      name_room,
      jenis_room,
      harga_room,
      fasilitas_room,
      jumlah_room,
      bed_type,
      kapasitas,
      luas,
      new_images: imageUrl,
    };

    if (image_room) {
      payload.image_room = typeof image_room === "string" ? JSON.parse(image_room) : image_room;
    }

    if (remove_images) {
      payload.remove_images = typeof remove_images === "string" ? JSON.parse(remove_images) : remove_images;
    }

    const result = await RoomService.updateRoom(roomId, payload);

    if (!result.status) {
      return handleServiceErrorWithResponse(res, result);
    }

    return response_success(res, { room: result.data }, result.message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong in updateRoom" });
  }
};

export const deleteRoom = async (req, res) => {
  const { roomId } = req.params;
  const deleteRoomControllerService = await RoomService.deleteRoom(roomId);
  if (!deleteRoomControllerService.status) {
    return handleServiceErrorWithResponse(res, deleteRoomControllerService);
  }
  return response_success(res, {}, deleteRoomControllerService.message);
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
      }),
    );

    res.status(200).json({ rooms: result.filter((r) => r.availableRoom > 0) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data available room", error: error.message });
  }
};
