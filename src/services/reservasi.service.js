import Reservasi from "../models/reservasi.models.js";
import Room from "../models/room.models.js";
import Hotel from "../models/hotel.models.js";
import HistoryReservasi from "../models/history.reservasi.models.js";
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
      const roomData = await Room.findById(room).populate("nameRoom harga_room");
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
        success: true,
        bookedCount: bookedCount + 1,
        availableRoom: availableRoom - 1,
        data: savedReservasi,
      };
    } catch (error) {
      logger.error("Error creating reservasi:", error);
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }

  static async getReservasiService() {
    try {
      logger.info("Fetching all reservasi");
      const reservasis = await Reservasi.find().populate("hotel", "nama_hotel").populate("room", "nameRoom harga_room");
      return {
        success: true,
        data: reservasis,
      };
    } catch (error) {
      logger.error("Error fetching all reservasi:", error);
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }

  static async getReservasiIdService(reservasiId) {
    try {
      logger.info(`Fetching reservasi with id: ${reservasiId}`);
      const reservasi = await Reservasi.findById(reservasiId).populate("hotel", "nama_hotel").populate("room", "nameRoom harga_room");
      if (!reservasi) {
        logger.warn(`reservasi with reservasiId: ${reservasiId} not found`);
        return INVALID_ID_SERVICE_RESPONSE;
      }
      return {
        success: true,
        data: reservasi,
      };
    } catch (error) {
      logger.error(`error fetch reservasi byId: ${reservasiId}`);
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }

  static async updateReservasiService(reservasiId, payload) {
    const { checkIn, checkOut, statusReservasi, paymentStatus, jumlahKamar, jumlahTamu } = payload;

    const reservasi = await Reservasi.findById(reservasiId).populate("room", "nameRoom harga_room");
    if (!reservasi) {
      return INVALID_ID_SERVICE_RESPONSE;
    }

    if (jumlahKamar !== undefined) reservasi.jumlahKamar = Number(jumlahKamar);
    if (jumlahTamu !== undefined) reservasi.jumlahTamu = Number(jumlahTamu);

    if (checkIn) {
      const checkInDate = new Date(checkIn);
      checkInDate.setHours(14, 0, 0, 0);
      reservasi.checkIn = checkInDate;
    }

    if (checkOut) {
      const checkOutDate = new Date(checkOut);
      checkOutDate.setHours(12, 0, 0, 0);
      reservasi.checkOut = checkOutDate;
    }

    if (reservasi.checkOut <= reservasi.checkIn) {
      return BadRequestWithMessage("Error date range");
    }

    if (checkIn || checkOut || jumlahKamar) {
      const diffTime = reservasi.checkOut - reservasi.checkIn;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      reservasi.totalPrice = diffDays * reservasi.room.harga_room * (reservasi.jumlahKamar || 1);
    }

    if (statusReservasi) reservasi.statusReservasi = statusReservasi;
    if (paymentStatus) reservasi.paymentStatus = paymentStatus;

    if (paymentStatus === "paid" && !reservasi.paidAt) {
      reservasi.paidAt = new Date();
    }

    const updateReservasi = await reservasi.save();

    return {
      success: true,
      data: updateReservasi,
      message: "Update reservasi successfully!",
    };
  }

  static async deleteReservasiService(reservasiId) {
    try {
      logger.info("Deleting reservasi with id:");
      const reservasi = await Reservasi.findByIdAndDelete(reservasiId);
      if (!reservasi) {
        return INVALID_ID_SERVICE_RESPONSE;
      }

      return {
        success: true,
        data: reservasi,
      };
    } catch (error) {
      logger.error("Error delete reservasi");
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }

  static async checkInReservasiService(reservasiId) {
    const reservasi = await Reservasi.findById(reservasiId);

    if (!reservasi) {
      return INVALID_ID_SERVICE_RESPONSE;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkInDate = new Date(reservasi.checkIn);
    checkInDate.setHours(0, 0, 0, 0);

    if (today < checkInDate) {
      return BadRequestWithMessage("invalid checkin date");
    }

    reservasi.statusReservasi = "checked-in";
    reservasi.checkedInAt = new Date();

    const checkinReservasi = await reservasi.save();

    return {
      success: true,
      data: checkinReservasi,
      message: "Successfully checkin",
    };
  }

  static async checkOutReservasiService(reservasiId) {
    const reservasi = await Reservasi.findById(reservasiId);

    if (!reservasi) {
      return INVALID_ID_SERVICE_RESPONSE;
    }

    if (reservasi.statusReservasi !== "checked-in") {
      return BadRequestWithMessage("INVALID_STATUS_FOR_CHECKOUT");
    }

    if (reservasi.paymentStatus !== "paid") {
      return BadRequestWithMessage("PAYMENT_NOT_COMPLETED");
    }

    reservasi.statusReservasi = "checked-out";
    await reservasi.save();

    await HistoryReservasi.create({
      reservasi: reservasiId,
    });

    return {
      success: true,
      data: reservasi,
      message: "Berhasil checkout",
    };
  }

  static async getArchiveReservasi() {
    try {
      logger.info("get archive: ");
      const archive = await HistoryReservasi.find().populate("reservasi");
      return {
        success: true,
        data: archive,
      };
    } catch (error) {
      logger.error("Cannot get archive");
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }
}

export default ReservasiService;
