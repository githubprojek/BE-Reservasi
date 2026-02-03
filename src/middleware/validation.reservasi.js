import { generateErrorStructure } from "../validation/helper.js";
import { response_unprocessable_entity } from "../utils/response.js";

export const validateReservasiCreation = (req, res, next) => {
  const errors = [];
  const { guestName, guestEmail, guestPhone, hotel, room, jumlahTamu, jumlahKamar, checkIn, checkOut, paymentMethod } = req.body;
  if (!guestName) {
    errors.push(generateErrorStructure("guestName", "Guest name is required"));
  }
  if (!guestEmail) {
    errors.push(generateErrorStructure("guestEmail", "Guest email is required"));
  }
  if (guestPhone !== undefined) {
    if (guestPhone.trim() === "") {
      errors.push(generateErrorStructure("guestPhone", "Guest phone number cannot be empty"));
    } else if (!/^\d+$/.test(guestPhone)) {
      errors.push(generateErrorStructure("guestPhone", "Phone number must be numeric"));
    }
  }
  if (!hotel) {
    errors.push(generateErrorStructure("hotel", "Hotel ID is required"));
  }
  if (!room) {
    errors.push(generateErrorStructure("room", "Room ID is required"));
  }
  if (!jumlahTamu) {
    errors.push(generateErrorStructure("jumlahTamu", "Number of guests is required"));
  }
  if (!jumlahKamar) {
    errors.push(generateErrorStructure("jumlahKamar", "Number of rooms is required"));
  }
  if (!checkIn) {
    errors.push(generateErrorStructure("checkIn", "Check-in date is required"));
  }
  if (!checkOut) {
    errors.push(generateErrorStructure("checkOut", "Check-out date is required"));
  }
  if (checkOut <= checkIn) {
    errors.push(generateErrorStructure("checkOut", "Check-out date must be after check-in date"));
  }
  if (!paymentMethod) {
    errors.push(generateErrorStructure("paymentMethod", "Payment method is required"));
  }

  if (errors.length > 0) {
    return response_unprocessable_entity(res, "Validation Error", errors);
  }
  next();
};
