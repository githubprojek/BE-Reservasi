import Fasilitas from "../models/fasilitas.models.js";
import FasilitasService from "../services/fasilitas.service.js";
import { response_success, response_created, handleServiceErrorWithResponse } from "../utils/response.js";

export const createFasilitas = async (req, res) => {
  const { name, icon } = req.body;
  const fasilitasServiceResponse = await FasilitasService.createFasilitas({ name, icon });
  if (!fasilitasServiceResponse.status) {
    return handleServiceErrorWithResponse(res, fasilitasServiceResponse);
  }
  return response_created(res, { fasilitas: fasilitasServiceResponse.data }, "Fasilitas created successfully");
};

export const getFasilitas = async (req, res) => {
  const fasilitasServiceResponse = await FasilitasService.getAllService();
  if (!fasilitasServiceResponse.status) {
    return handleServiceErrorWithResponse(res, fasilitasServiceResponse);
  }
  return response_success(res, { fasilitas: fasilitasServiceResponse.data });
};

export const getFasilitasById = async (req, res) => {
  const { fasilitasId } = req.params;
  const fasilitasServiceResponse = await FasilitasService.getFasilitasById(fasilitasId);
  if (!fasilitasServiceResponse.status) {
    return handleServiceErrorWithResponse(res, fasilitasServiceResponse);
  }
  return response_success(res, { fasilitas: fasilitasServiceResponse.data });
};

export const updateFasilitas = async (req, res) => {
  const { fasilitasId } = req.params;
  const { name, icon } = req.body;

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (icon !== undefined) updateData.icon = icon;
  const fasilitasServiceResponse = await FasilitasService.updateFasilitas(fasilitasId, updateData);
  if (!fasilitasServiceResponse.status) {
    return handleServiceErrorWithResponse(res, fasilitasServiceResponse);
  }
  return response_success(res, { fasilitas: fasilitasServiceResponse.data }, "Fasilitas updated successfully");
};

export const deleteFasilitas = async (req, res) => {
  const { fasilitasId } = req.params;

  const fasilitasServiceResponse = await FasilitasService.deleteFasilitas(fasilitasId);
  if (!fasilitasServiceResponse.status) {
    return handleServiceErrorWithResponse(res, fasilitasServiceResponse);
  }
  return response_success(res, null, "Fasilitas deleted successfully");
};
