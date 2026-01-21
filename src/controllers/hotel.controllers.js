import Hotel from "../models/hotel.models.js";
import cloudinary from "../lib/cloudinary.js";
import Room from "../models/room.models.js";
import HotelService from "../services/hotel.service.js";
import { response_success, response_created, handleServiceErrorWithResponse, response_internal_server_error } from "../utils/response.js";

export const createHotel = async (req, res) => {
  try {
    const { nama_hotel, alamat_hotel, kota_hotel, email_hotel, notelp_hotel } = req.body;
    const files = req.files;
    let imageUrls = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "hotels" }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            })
            .end(file.buffer);
        });

        imageUrls.push(uploadResult.secure_url);
      }
    }

    const hotelControllerResponse = await HotelService.createHotel({
      nama_hotel,
      alamat_hotel,
      kota_hotel,
      email_hotel,
      notelp_hotel,
      image_hotel: imageUrls,
    });

    if (!hotelControllerResponse.status) {
      return handleServiceErrorWithResponse(res, hotelControllerResponse);
    }
    return response_created(res, { hotel: hotelControllerResponse.data }, "Hotel created successfully");
  } catch (err) {
    return response_internal_server_error(res, "Something went wrong while creating hotel");
  }
};

export const getHotel = async (req, res) => {
  const hotelControllerResponse = await HotelService.getHotelService();
  if (!hotelControllerResponse.status) {
    return handleServiceErrorWithResponse(res, hotelControllerResponse);
  }
  return response_success(res, { hotels: hotelControllerResponse.data });
};

export const getHotelById = async (req, res) => {
  const hotelControllerResponse = await HotelService.getHotelById(req.params.hotelId);
  if (!hotelControllerResponse.status) {
    return handleServiceErrorWithResponse(res, hotelControllerResponse);
  }
  return response_success(res, { hotel: hotelControllerResponse.data });
};

export const updateHotel = async (req, res) => {
  const { hotelId } = req.params;
  const { nama_hotel, alamat_hotel, kota_hotel, email_hotel, notelp_hotel, remove_images } = req.body;

  try {
    const files = req.files;
    let newImageUrls = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "hotels" }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            })
            .end(file.buffer);
        });
        newImageUrls.push(uploadResult.secure_url);
      }
    }

    const hotelControllerResponse = await HotelService.updateHotelService(hotelId, {
      nama_hotel,
      alamat_hotel,
      kota_hotel,
      email_hotel,
      notelp_hotel,
      new_images: newImageUrls,
      remove_images,
    });

    if (!hotelControllerResponse.status) {
      return handleServiceErrorWithResponse(res, hotelControllerResponse);
    }

    return response_success(res, { hotel: hotelControllerResponse.data }, "Hotel updated successfully");
  } catch (error) {
    console.error(error);
    return response_internal_server_error(res, "Something went wrong while updating hotel");
  }
};

export const deleteHotel = async (req, res) => {
  const hotelControllerResponse = await HotelService.deleteHotelService(req.params.hotelId);
  if (!hotelControllerResponse.status) {
    return handleServiceErrorWithResponse(res, hotelControllerResponse);
  }
  return response_success(res, null, "Hotel deleted successfully");
};
