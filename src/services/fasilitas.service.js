import { logger } from "../logger/logger.js";
import { INTERNAL_SERVER_ERROR_SERVICE_RESPONSE, INVALID_ID_SERVICE_RESPONSE, BadRequestWithMessage } from "../entities/service.js";
import Fasilitas from "../models/fasilitas.models.js";

class FasilitasService {
  static async getAllService() {
    try {
      logger.info("Fetching all Facility");
      const fasilitas = await Fasilitas.find();
      return {
        status: true,
        data: fasilitas,
      };
    } catch (error) {
      logger.error("Error fetching fasilitas: ", error);
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }

  static async getFasilitasById(fasilitasId) {
    try {
      logger.info(`Fetching product with fasilitasId: ${fasilitasId}`);
      const fasilitas = await Fasilitas.findById(fasilitasId);

      if (!fasilitas) {
        logger.warn(`Fasilitas with fasilitasId: ${fasilitasId} not found`);
        return INVALID_ID_SERVICE_RESPONSE;
      }

      return {
        status: true,
        data: fasilitas,
      };
    } catch (error) {
      logger.error("Error fetching product by fasilitasId: ", error);
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }

  static async createFasilitas(fasilitasData) {
    try {
      logger.info("Creating new fasilitas");
      const newFasilitas = new Fasilitas(fasilitasData);
      const savedFasilitas = await newFasilitas.save();
      return {
        status: true,
        data: savedFasilitas,
      };
    } catch (error) {
      logger.error("Error creating fasilitas: ", error);
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }

  static async updateFasilitas(fasilitasId, updateData) {
    try {
      logger.info(`Updating fasilitas with fasilitasId: ${fasilitasId}`);
      const updatedFasilitas = await Fasilitas.findByIdAndUpdate(fasilitasId, updateData, { new: true });
      if (!updatedFasilitas) {
        logger.warn(`Fasilitas with fasilitasId: ${fasilitasId} not found for update`);
        return INVALID_ID_SERVICE_RESPONSE;
      }
      return {
        status: true,
        data: updatedFasilitas,
      };
    } catch (error) {
      logger.error("Error updating fasilitas: ", error);
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }

  static async deleteFasilitas(fasilitasId) {
    try {
      logger.info(`Deleting fasilitas with fasilitasId: ${fasilitasId}`);
      const deletedFasilitas = await Fasilitas.findByIdAndDelete(fasilitasId);
      if (!deletedFasilitas) {
        logger.warn(`Fasilitas with fasilitasId: ${fasilitasId} not found for deletion`);
        return INVALID_ID_SERVICE_RESPONSE;
      }
      return {
        status: true,
        data: deletedFasilitas,
      };
    } catch (error) {
      logger.error("Error deleting fasilitas: ", error);
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }
}

export default FasilitasService;
