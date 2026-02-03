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
  const getRoomControllerService = await RoomService.getRoom();
  if (!getRoomControllerService.status) {
    return handleServiceErrorWithResponse(res, getRoomControllerService);
  }
  return response_success(res, { rooms: getRoomControllerService.data });
};

export const getRoomById = async (req, res) => {
  const { roomId } = req.params;

  const getRoomByIdControllerService = await RoomService.getRoomById(roomId);
  if (!getRoomByIdControllerService.status) {
    return handleServiceErrorWithResponse(res, getRoomByIdControllerService);
  }
  return response_success(res, { room: getRoomByIdControllerService.data });
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

    const checkInDate = new Date(checkIn);
    checkInDate.setHours(14, 0, 0, 0);

    const checkOutDate = new Date(checkOut);
    checkOutDate.setHours(12, 0, 0, 0);

    const availableRoomControllerService = await RoomService.getAvailableRooms(hotelId, checkInDate, checkOutDate);

    if (!availableRoomControllerService.status) {
      return handleServiceErrorWithResponse(res, availableRoomControllerService);
    }

    return response_success(res, { rooms: availableRoomControllerService.data });
  } catch (error) {
    console.error("Unexpected error in getAvailableRooms controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
