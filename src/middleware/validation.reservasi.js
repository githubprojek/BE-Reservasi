import { generateErrorStructure } from "../validation/helper.js";
import { response_unprocessable_entity } from "../utils/response.js";

export const validateReservasiId = (req, res, next) => {
  const errors = [];
  const { reservasiId } = req.params;

  if (!reservasiId) {
    errors.push(generateErrorStructure("reservasiId", "Reservasi ID is required"));
  }

  if (errors.length > 0) {
    return response_unprocessable_entity(res, "Validation Error", errors);
  }

  next();
};

export const validateCreateReservasi = (req, res, next) => {
  const errors = [];
  const { guestName, guestEmail, guestPhone, hotel, room, jumlahTamu, jumlahKamar, checkIn, checkOut } = req.body;

  if (!guestName || guestName.trim() === "") {
    errors.push(generateErrorStructure("guestName", "Guest name is required"));
  }

  if (!guestEmail || guestEmail.trim() === "") {
    errors.push(generateErrorStructure("guestEmail", "Guest email is required"));
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
      errors.push(generateErrorStructure("guestEmail", "Invalid email format"));
    }
  }

  if (!guestPhone || guestPhone.trim() === "") {
    errors.push(generateErrorStructure("guestPhone", "Guest phone is required"));
  } else {
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(guestPhone.replace(/[\s-]/g, ""))) {
      errors.push(generateErrorStructure("guestPhone", "Invalid phone number format (10-15 digits)"));
    }
  }

  if (!hotel || hotel.trim() === "") {
    errors.push(generateErrorStructure("hotel", "Hotel is required"));
  }

  if (!room || room.trim() === "") {
    errors.push(generateErrorStructure("room", "Room is required"));
  }

  if (!jumlahTamu) {
    errors.push(generateErrorStructure("jumlahTamu", "Number of guests is required"));
  } else if (isNaN(jumlahTamu) || Number(jumlahTamu) < 1) {
    errors.push(generateErrorStructure("jumlahTamu", "Number of guests must be at least 1"));
  }

  if (jumlahKamar !== undefined) {
    if (isNaN(jumlahKamar) || Number(jumlahKamar) < 1) {
      errors.push(generateErrorStructure("jumlahKamar", "Number of rooms must be at least 1"));
    }
  }

  if (!checkIn) {
    errors.push(generateErrorStructure("checkIn", "Check-in date is required"));
  } else {
    const checkInDate = new Date(checkIn);
    if (isNaN(checkInDate.getTime())) {
      errors.push(generateErrorStructure("checkIn", "Invalid check-in date format"));
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      checkInDate.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        errors.push(generateErrorStructure("checkIn", "Check-in date cannot be in the past"));
      }
    }
  }

  if (!checkOut) {
    errors.push(generateErrorStructure("checkOut", "Check-out date is required"));
  } else {
    const checkOutDate = new Date(checkOut);
    if (isNaN(checkOutDate.getTime())) {
      errors.push(generateErrorStructure("checkOut", "Invalid check-out date format"));
    } else if (checkIn) {
      const checkInDate = new Date(checkIn);
      if (checkOutDate <= checkInDate) {
        errors.push(generateErrorStructure("checkOut", "Check-out date must be after check-in date"));
      }
    }
  }

  if (errors.length > 0) {
    return response_unprocessable_entity(res, "Validation Error", errors);
  }

  next();
};

export const validateUpdateReservasi = (req, res, next) => {
  const errors = [];
  const { checkIn, checkOut, statusReservasi, paymentStatus, jumlahKamar, jumlahTamu } = req.body;

  if (jumlahTamu !== undefined) {
    if (isNaN(jumlahTamu) || Number(jumlahTamu) < 1) {
      errors.push(generateErrorStructure("jumlahTamu", "Number of guests must be at least 1"));
    }
  }

  if (jumlahKamar !== undefined) {
    if (isNaN(jumlahKamar) || Number(jumlahKamar) < 1) {
      errors.push(generateErrorStructure("jumlahKamar", "Number of rooms must be at least 1"));
    }
  }

  if (checkIn !== undefined) {
    const checkInDate = new Date(checkIn);
    if (isNaN(checkInDate.getTime())) {
      errors.push(generateErrorStructure("checkIn", "Invalid check-in date format"));
    }
  }

  if (checkOut !== undefined) {
    const checkOutDate = new Date(checkOut);
    if (isNaN(checkOutDate.getTime())) {
      errors.push(generateErrorStructure("checkOut", "Invalid check-out date format"));
    }
  }

  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate) {
      errors.push(generateErrorStructure("checkOut", "Check-out date must be after check-in date"));
    }
  }

  if (statusReservasi !== undefined) {
    const validStatuses = ["pending", "confirmed", "checked-in", "checked-out", "cancelled"];
    if (!validStatuses.includes(statusReservasi)) {
      errors.push(generateErrorStructure("statusReservasi", `Status must be one of: ${validStatuses.join(", ")}`));
    }
  }

  if (paymentStatus !== undefined) {
    const validPaymentStatuses = ["pending", "paid", "cancelled", "refunded"];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      errors.push(generateErrorStructure("paymentStatus", `Payment status must be one of: ${validPaymentStatuses.join(", ")}`));
    }
  }

  if (errors.length > 0) {
    return response_unprocessable_entity(res, "Validation Error", errors);
  }

  next();
};

export const validateDeleteReservasi = (req, res, next) => {
  const errors = [];
  const { reservasiId } = req.params;

  if (!reservasiId) {
    errors.push(generateErrorStructure("reservasiId", "Reservasi ID is required"));
  }

  if (errors.length > 0) {
    return response_unprocessable_entity(res, "Validation Error", errors);
  }

  next();
};

export const validateCheckIn = (req, res, next) => {
  const errors = [];
  const { reservasiId } = req.params;

  if (!reservasiId) {
    errors.push(generateErrorStructure("reservasiId", "Reservasi ID is required"));
  }

  if (errors.length > 0) {
    return response_unprocessable_entity(res, "Validation Error", errors);
  }

  next();
};

export const validateCheckOut = (req, res, next) => {
  const errors = [];
  const { reservasiId } = req.params;

  if (!reservasiId) {
    errors.push(generateErrorStructure("reservasiId", "Reservasi ID is required"));
  }

  if (errors.length > 0) {
    return response_unprocessable_entity(res, "Validation Error", errors);
  }

  next();
};
