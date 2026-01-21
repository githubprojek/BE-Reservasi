import { logger } from "../logger/logger.js";
import Hotel from "../models/hotel.models.js";
import Room from "../models/room.models.js";
import { INTERNAL_SERVER_ERROR_SERVICE_RESPONSE, INVALID_ID_SERVICE_RESPONSE, BadRequestWithMessage } from "../entities/service.js";

class HotelService {
  static async getHotelService() {
    try {
      logger.info("Fetching all Hotels");
      const hotels = await Hotel.find();
      return {
        status: true,
        data: hotels,
      };
    } catch (error) {
      logger.error("Error fetching all Hotels:", error);
      throw INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }

  static async getHotelById(hotelId) {
    try {
      logger.info(`Fetching hotel with ID: ${hotelId}`);
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        logger.warn(`Hotel with ID: ${hotelId} not found`);
        return INVALID_ID_SERVICE_RESPONSE;
      }
      return {
        status: true,
        data: hotel,
      };
    } catch (error) {
      logger.error("Error fetching hotel by ID:", error);
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }

  static async createHotel(hotelData) {
    try {
      logger.info("Creating new hotel");
      const newHotel = new Hotel(hotelData);
      const savedHotel = await newHotel.save();
      return {
        status: true,
        data: savedHotel,
      };
    } catch (error) {
      logger.error("Error creating hotel:", error);
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }

  static async updateHotelService(hotelId, payload) {
    try {
      logger.info(`Updating hotel with ID: ${hotelId}`);

      const { email_hotel, notelp_hotel, new_images = [], remove_images = [] } = payload;
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return INVALID_ID_SERVICE_RESPONSE;
      }

      const emailInUse = await Hotel.findOne({
        email_hotel,
        _id: { $ne: hotelId },
      });
      if (emailInUse) {
        return BadRequestWithMessage("Email already in use by another hotel");
      }

      let imageUrls = hotel.image_hotel || [];

      if (new_images.length > 0) {
        imageUrls = [...imageUrls, ...new_images];
      }

      if (remove_images.length > 0) {
        imageUrls = imageUrls.filter((url) => !remove_images.includes(url));
      }

      hotel.nama_hotel = payload.nama_hotel;
      hotel.alamat_hotel = payload.alamat_hotel;
      hotel.kota_hotel = payload.kota_hotel;
      hotel.email_hotel = payload.email_hotel;
      hotel.notelp_hotel = payload.notelp_hotel;
      hotel.image_hotel = imageUrls;

      const updatedHotel = await hotel.save();

      return {
        status: true,
        data: updatedHotel,
        message: "Hotel updated successfully",
      };
    } catch (error) {
      logger.error("Error updating hotel:", error);
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }

  static async deleteHotelService(hotelId) {
    try {
      logger.info(`Deleting hotel with ID: ${hotelId}`);
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return INVALID_ID_SERVICE_RESPONSE;
      }

      await Room.deleteMany({ hotel: hotelId });

      await hotel.deleteOne();

      return {
        status: true,
        message: "Hotel deleted successfully",
      };
    } catch (error) {
      logger.error("Error deleting hotel:", error);
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }
}

export default HotelService;
