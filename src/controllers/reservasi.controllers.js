import Reservasi from "../models/reservasi.models.js";
import { coreApi } from "../lib/midtrans.js";
import { response_success, response_created, handleServiceErrorWithResponse, response_internal_server_error } from "../utils/response.js";
import ReservasiService from "../services/reservasi.service.js";

export const createReservasi = async (req, res) => {
  try {
    const createReservasiController = await ReservasiService.createReservasi(req.body);

    if (!createReservasiController.success) {
      return handleServiceErrorWithResponse(res, createReservasiController);
    }

    return response_created(res, { reservasi: createReservasiController.data, bookedCount: createReservasiController.bookedCount, availableRoom: createReservasiController.availableRoom }, "Reservasi created successfully");
  } catch (error) {
    return response_internal_server_error(res, "Something went wrong while creating reservasi");
  }
};

export const getReservasi = async (req, res) => {
  const getReservasiController = await ReservasiService.getReservasiService();
  if (!getReservasiController.success) {
    return handleServiceErrorWithResponse(res, getReservasiController);
  }
  return response_success(res, { reservasi: getReservasiController.data });
};

export const getReservasiById = async (req, res) => {
  const { reservasiId } = req.params;

  const getReservasiIdController = await ReservasiService.getReservasiIdService(reservasiId);
  if (!getReservasiIdController.success) {
    return handleServiceErrorWithResponse(res, getReservasiIdController);
  }
  return response_success(res, { reservasi: getReservasiIdController.data });
};

export const updateReservasi = async (req, res) => {
  const updateReservasiController = await ReservasiService.updateReservasiService(req.params.reservasiId, req.body);
  if (!updateReservasiController.success) {
    return handleServiceErrorWithResponse(res, updateReservasiController);
  }
  return response_success(res, { reservasi: updateReservasiController.data }, "Update Reservasi Successfully");
};

export const deleteReservasi = async (req, res) => {
  const { reservasiId } = req.params;
  const deleteReservasiController = await ReservasiService.deleteReservasiService(reservasiId);
  if (!deleteReservasiController.success) {
    return handleServiceErrorWithResponse(res, deleteReservasiController);
  }
  return response_success(res, null, "Deleted reservasi Successfully");
};

export const checkInReservasi = async (req, res) => {
  const { reservasiId } = req.params;
  const checkInReservasiController = await ReservasiService.checkInReservasiService(reservasiId);

  return response_success(res, { reservasi: checkInReservasiController }, "Reservasi berhasil di-check-in");
};

export const checkOutReservasi = async (req, res) => {
  const { reservasiId } = req.params;
  const checkOutReservasiController = await ReservasiService.checkOutReservasiService(reservasiId);
  if (!checkOutReservasiController.success) {
    return handleServiceErrorWithResponse(res, checkOutReservasiController);
  }
  return response_success(res, { reservasi: checkOutReservasiController }, "Reservasi berhasil di-check-out dan diarsipkan");
};

export const archiveReservasi = async (req, res) => {
  const archivedReservasi = await ReservasiService.getArchiveReservasi();
  if (!archivedReservasi.success) {
    return handleServiceErrorWithResponse(res, archivedReservasi);
  }
  return response_success(res, { reservasi: archivedReservasi.data });
};
