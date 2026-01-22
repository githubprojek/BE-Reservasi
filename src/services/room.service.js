import Room from "../models/room.models.js";
import cloudinary from "../lib/cloudinary.js";
import Hotel from "../models/hotel.models.js";
import Reservasi from "../models/reservasi.models.js";
import { INTERNAL_SERVER_ERROR_SERVICE_RESPONSE, INVALID_ID_SERVICE_RESPONSE, BadRequestWithMessage } from "../entities/service.js";
import { logger } from "../logger/logger.js";
class RoomService {
  static async createRoom(roomData) {
    try {
      logger.info("Creating new room");
      const hotelData = await Hotel.findById(roomData.hotel);
      if (!hotelData) {
        logger.warn(`Hotel with ID: ${roomData.hotel} not found`);
        return INVALID_ID_SERVICE_RESPONSE;
      }

      const newRoom = new Room({ ...roomData, hotel: hotelData._id });
      const savedRoom = await newRoom.save();

      return {
        status: true,
        data: savedRoom,
      };
    } catch (error) {
      logger.error("Error creating room:", error);
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }
  static async updateRoom(roomId, payload) {
    try {
      logger.info(`Updating room with ID: ${roomId}`);

      const room = await Room.findById(roomId);
      if (!room) {
        logger.warn(`Room with ID: ${roomId} not found`);
        return INVALID_ID_SERVICE_RESPONSE;
      }

      let imageUrls = room.image_room || [];

      if (payload.image_room?.length) {
        imageUrls = payload.image_room;
      } else {
        if (payload.new_images?.length) {
          imageUrls = [...imageUrls, ...payload.new_images];
        }

        if (payload.remove_images?.length) {
          imageUrls = imageUrls.filter((url) => !payload.remove_images.includes(url));
        }
      }

      if (payload.name_room !== undefined) room.name_room = payload.name_room;
      if (payload.jenis_room !== undefined) room.jenis_room = payload.jenis_room;
      if (payload.harga_room !== undefined) room.harga_room = payload.harga_room;
      if (payload.fasilitas_room !== undefined) room.fasilitas_room = payload.fasilitas_room;
      if (payload.jumlah_room !== undefined) room.jumlah_room = payload.jumlah_room;
      if (payload.bed_type !== undefined) room.bed_type = payload.bed_type;
      if (payload.kapasitas !== undefined) room.kapasitas = payload.kapasitas;
      if (payload.luas !== undefined) room.luas = payload.luas;

      room.image_room = imageUrls;

      const updatedRoom = await room.save();

      return {
        status: true,
        data: updatedRoom,
        message: "Room updated successfully",
      };
    } catch (error) {
      logger.error("Error updating room:", error);
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }
  static async deleteRoom(roomId) {
    try {
      logger.info(`Deleting room with ID: ${roomId}`);
      const room = await Room.findByIdAndDelete(roomId);
      if (!room) {
        logger.warn(`Room with ID: ${roomId} not found`);
        return INVALID_ID_SERVICE_RESPONSE;
      }
      return {
        status: true,
        message: "Room deleted successfully",
      };
    } catch (error) {
      logger.error("Error deleting room:", error);
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }
}

export default RoomService;
