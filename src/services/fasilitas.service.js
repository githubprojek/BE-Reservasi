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
}

export default FasilitasService;
