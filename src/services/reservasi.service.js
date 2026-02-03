import Reservasi from "../models/reservasi.models.js";
import Room from "../models/room.models.js";
import Hotel from "../models/hotel.models.js";
import { INTERNAL_SERVER_ERROR_SERVICE_RESPONSE, INVALID_ID_SERVICE_RESPONSE, BadRequestWithMessage } from "../entities/service.js";
import { logger } from "../logger/logger.js";

class ReservasiService {
  static async createReservasi(reservasiData) {
    try {
      const { guestName, guestEmail, guestPhone, hotel, room, jumlahTamu, jumlahKamar = 1, checkIn, checkOut, keterangan, paymentMethod = "bca" } = reservasiData;
      const hotelData = await Hotel.findById(hotel).populate("nama_hotel");
      if (!hotelData) {
        return INVALID_ID_SERVICE_RESPONSE;
      }
      const roomData = await Room.findById(room).populate("name_room");
      if (!roomData) {
        return INVALID_ID_SERVICE_RESPONSE;
      }
      const checkInDate = new Date(checkIn);
      checkInDate.setHours(14, 0, 0, 0);
      const checkOutDate = new Date(checkOut);
      checkOutDate.setHours(12, 0, 0, 0);

      if (checkOutDate <= checkInDate) {
        return BadRequestWithMessage("Check-out date must be after check-in date");
      }

      const bookedCount = await Reservasi.countDocuments({
        room: roomData._id,
        $or: [
          {
            checkIn: { $lte: checkOutDate },
            checkOut: { $gte: checkInDate },
          },
        ],
      });

      const availableRoom = roomData.jumlah_room - bookedCount;
      if (availableRoom <= 0) {
        return BadRequestWithMessage("No available rooms for the selected dates");
      }

      const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      if (dayDiff <= 0) {
        return BadRequestWithMessage("Check-out date must be after check-in date");
      }
      const totalPrice = roomData.harga_room * jumlahKamar * dayDiff;

      const newReservasi = new Reservasi({
        guestName,
        guestEmail,
        guestPhone,
        hotel: hotelData._id,
        room: roomData._id,
        jumlahTamu,
        jumlahKamar,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        keterangan,
        totalPrice,
        statusReservasi: "pending",
        paymentStatus: "pending",
        paymentMethod: paymentMethod || "bca",
      });

      const savedReservasi = await newReservasi.save();
      return {
        status: true,
        bookedCount: bookedCount + 1,
        availableRoom: availableRoom - 1,
        data: savedReservasi,
      };
    } catch (error) {
      logger.error("Error creating reservasi:", error);
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }
}

export default ReservasiService;

// static async getReservasiService() {
//   try {
//     logger.info("Fetching all reservasi");
//     const reservasis = await Reservasi.find().populate("hotel", "nama_hotel").populate("room", "name_room");
//     return {
//       status: true,
//       data: reservasis,
//     };
//   } catch (error) {
//     logger.error("Error fetching all reservasi:", error);
//     return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
//   }
// }
