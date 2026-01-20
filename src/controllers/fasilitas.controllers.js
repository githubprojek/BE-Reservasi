import Fasilitas from "../models/fasilitas.models.js";
import FasilitasService from "../services/fasilitas.service.js";
import { response_success, response_created, handleServiceErrorWithResponse } from "../utils/response.js";

// CREATE fasilitas
export const createFasilitas = async (req, res) => {
  try {
    const { name, icon } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const newFasilitas = new Fasilitas({
      name,
      icon,
    });

    const savedFasilitas = await newFasilitas.save();

    res.status(201).json({
      message: "Fasilitas created successfully",
      fasilitas: savedFasilitas,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong createFasilitas" });
  }
};

// READ ALL fasilitas
export const getFasilitas = async (req, res) => {
  const fasilitasServiceResponse = await FasilitasService.getAllService();
  if (!fasilitasServiceResponse.status) {
    return handleServiceErrorWithResponse(res, fasilitasServiceResponse);
  }
  return response_success(res, { fasilitas: fasilitasServiceResponse.data });
};

// READ fasilitas by ID
export const getFasilitasById = async (req, res) => {
  const { fasilitasId } = req.params;
  const fasilitasServiceResponse = await FasilitasService.getFasilitasById(fasilitasId);
  if (!fasilitasServiceResponse.status) {
    return handleServiceErrorWithResponse(res, fasilitasServiceResponse);
  }
  return response_success(res, { fasilitas: fasilitasServiceResponse.data });
};

// UPDATE fasilitas
export const updateFasilitas = async (req, res) => {
  const { fasilitasId } = req.params;
  const { name, icon } = req.body;

  try {
    const fasilitas = await Fasilitas.findById(fasilitasId);

    if (!fasilitas) {
      return res.status(404).json({ message: "Fasilitas not found" });
    }

    fasilitas.name = name || fasilitas.name;
    fasilitas.icon = icon || fasilitas.icon;

    const updatedFasilitas = await fasilitas.save();

    res.status(200).json({
      message: "Fasilitas updated successfully",
      fasilitas: updatedFasilitas,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong updateFasilitas" });
  }
};

// DELETE fasilitas
export const deleteFasilitas = async (req, res) => {
  const { fasilitasId } = req.params;

  try {
    const fasilitas = await Fasilitas.findByIdAndDelete(fasilitasId);

    if (!fasilitas) {
      return res.status(404).json({ message: "Fasilitas not found" });
    }

    res.status(200).json({ message: "Fasilitas deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong deleteFasilitas" });
  }
};
