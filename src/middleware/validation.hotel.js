import { generateErrorStructure } from "../validation/helper.js";
import { response_unprocessable_entity } from "../utils/response.js";

export const validateHotelId = (req, res, next) => {
  const errors = [];
  const { hotelId } = req.params;

  if (!hotelId) {
    errors.push(generateErrorStructure("hotelId", "hotelId is required"));
  }
  if (errors.length > 0) {
    return res.status(422).json({
      content: null,
      message: "Validation Error",
      errors,
    });
  }

  next();
};

export const validateCreateHotel = (req, res, next) => {
  const errors = [];
  const { nama_hotel, alamat_hotel, kota_hotel, email_hotel, notelp_hotel } = req.body;
  if (!nama_hotel || nama_hotel.trim() === "") {
    errors.push(generateErrorStructure("nama_hotel", "Hotel name is required"));
  }
  if (!alamat_hotel || alamat_hotel.trim() === "") {
    errors.push(generateErrorStructure("alamat_hotel", "Hotel address is required"));
  }
  if (!kota_hotel || kota_hotel.trim() === "") {
    errors.push(generateErrorStructure("kota_hotel", "Hotel city is required"));
  }
  if (!email_hotel || email_hotel.trim() === "") {
    errors.push(generateErrorStructure("email_hotel", "Hotel email is required"));
  }
  if (notelp_hotel !== undefined) {
    if (notelp_hotel.trim() === "") {
      errors.push(generateErrorStructure("notelp_hotel", "Hotel phone number cannot be empty"));
    } else if (!/^\d+$/.test(notelp_hotel)) {
      errors.push(generateErrorStructure("notelp_hotel", "Phone number must be numeric"));
    }
  }
  if (errors.length > 0) {
    return response_unprocessable_entity(res, "Validation Error", errors);
  }
  next();
};

export const validateUpdateHotel = (req, res, next) => {
  const errors = [];
  const { nama_hotel, alamat_hotel, kota_hotel, email_hotel, notelp_hotel } = req.body;
  if (nama_hotel !== undefined && nama_hotel.trim() === "") {
    errors.push(generateErrorStructure("nama_hotel", "Hotel name cannot be empty"));
  }
  if (alamat_hotel !== undefined && alamat_hotel.trim() === "") {
    errors.push(generateErrorStructure("alamat_hotel", "Hotel address cannot be empty"));
  }
  if (kota_hotel !== undefined && kota_hotel.trim() === "") {
    errors.push(generateErrorStructure("kota_hotel", "Hotel city cannot be empty"));
  }
  if (email_hotel !== undefined && email_hotel.trim() === "") {
    errors.push(generateErrorStructure("email_hotel", "Hotel email cannot be empty"));
  }
  if (notelp_hotel !== undefined) {
    if (notelp_hotel.trim() === "") {
      errors.push(generateErrorStructure("notelp_hotel", "Hotel phone number cannot be empty"));
    } else if (!/^\d+$/.test(notelp_hotel)) {
      errors.push(generateErrorStructure("notelp_hotel", "Phone number must be numeric"));
    }
  }
  if (errors.length > 0) {
    return response_unprocessable_entity(res, "Validation Error", errors);
  }
  next();
};

export const validateDeleteHotel = (req, res, next) => {
  const errors = [];
  const { hotelId } = req.params;
  if (!hotelId) {
    errors.push(generateErrorStructure("hotelId", "hotelId is required"));
  }
  if (errors.length > 0) {
    return response_unprocessable_entity(res, "Validation Error", errors);
  }
  next();
};
