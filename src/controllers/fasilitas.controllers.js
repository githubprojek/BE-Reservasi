import FasilitasService from "../services/fasilitas.service.js";
import { response_success, response_created, handleServiceErrorWithResponse } from "../utils/response.js";

export const createFasilitas = async (req, res) => {
  const fasilitasControllerResponse = await FasilitasService.createFasilitas(req.body);
  if (!fasilitasControllerResponse.status) {
    return handleServiceErrorWithResponse(res, fasilitasControllerResponse);
  }
  return response_created(res, { fasilitas: fasilitasControllerResponse.data }, "Fasilitas created successfully");
};

export const getFasilitas = async (req, res) => {
  const fasilitasControllerResponse = await FasilitasService.getAllService();
  if (!fasilitasControllerResponse.status) {
    return handleServiceErrorWithResponse(res, fasilitasControllerResponse);
  }
  return response_success(res, { fasilitas: fasilitasControllerResponse.data });
};

export const getFasilitasById = async (req, res) => {
  const fasilitasControllerResponse = await FasilitasService.getFasilitasById(req.params.fasilitasId);
  if (!fasilitasControllerResponse.status) {
    return handleServiceErrorWithResponse(res, fasilitasControllerResponse);
  }
  return response_success(res, { fasilitas: fasilitasControllerResponse.data });
};

export const updateFasilitas = async (req, res) => {
  const { fasilitasId } = req.params;
  const { name, icon } = req.body;

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (icon !== undefined) updateData.icon = icon;
  const fasilitasControllerResponse = await FasilitasService.updateFasilitas(req.params.fasilitasId, req.body);
  if (!fasilitasControllerResponse.status) {
    return handleServiceErrorWithResponse(res, fasilitasControllerResponse);
  }
  return response_success(res, { fasilitas: fasilitasControllerResponse.data }, "Fasilitas updated successfully");
};

export const deleteFasilitas = async (req, res) => {
  const { fasilitasId } = req.params;

  const fasilitasControllerResponse = await FasilitasService.deleteFasilitas(fasilitasId);
  if (!fasilitasControllerResponse.status) {
    return handleServiceErrorWithResponse(res, fasilitasControllerResponse);
  }
  return response_success(res, null, "Fasilitas deleted successfully");
};
