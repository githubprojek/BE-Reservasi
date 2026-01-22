import { generateErrorStructure } from "../validation/helper.js";
import { response_unprocessable_entity } from "../utils/response.js";

export const validateRoomId = (req, res, next) => {
  const error = [];
  const { roomId } = req.params;
  if (!roomId) {
    return error.push(generateErrorStructure("roomId", "Room roomId is required"));
  }
  if (error.length > 0) {
    return response_unprocessable_entity(res, "Validation Error", error);
  }
  next();
};

export const validateCreateRoom = (req, res, next) => {
  const error = [];
  const { hotel, name_room, jenis_room, harga_room, fasilitas_room, jumlah_room, bed_type, kapasitas, luas } = req.body;

  if (!hotel) {
    error.push(generateErrorStructure("hotel", "Hotel is required"));
  }
  if (!name_room) {
    error.push(generateErrorStructure("name_room", "Name Room is required"));
  }
  if (!jenis_room) {
    error.push(generateErrorStructure("jenis_room", "Jenis Room is required"));
  }
  if (!harga_room) {
    error.push(generateErrorStructure("harga_room", "Harga Room is required"));
  }
  if (!fasilitas_room) {
    error.push(generateErrorStructure("fasilitas_room", "Fasilitas Room is required"));
  }
  if (jumlah_room !== undefined) {
    if (!jumlah_room.trim() === "") {
      error.push(generateErrorStructure("jumlah_room", "Jumlah Room is required"));
    } else if (!/^\d+$/.test(jumlah_room)) {
      error.push(generateErrorStructure("jumlah_room", "Jumlah Room must be a number"));
    }
  }
  if (!bed_type) {
    error.push(generateErrorStructure("bed_type", "Bed Type is required"));
  }
  if (kapasitas !== undefined) {
    if (!kapasitas.trim() === "") {
      error.push(generateErrorStructure("kapasitas", "Jumlah Room is required"));
    } else if (!/^\d+$/.test(kapasitas)) {
      error.push(generateErrorStructure("kapasitas", "Jumlah Room must be a number"));
    }
  }
  if (luas !== undefined) {
    if (!luas.trim() === "") {
      error.push(generateErrorStructure("luas", "Jumlah Room is required"));
    } else if (!/^\d+$/.test(luas)) {
      error.push(generateErrorStructure("luas", "Jumlah Room must be a number"));
    }
  }
  if (error.length > 0) {
    return response_unprocessable_entity(res, "Validation Error", error);
  }
  next();
};
