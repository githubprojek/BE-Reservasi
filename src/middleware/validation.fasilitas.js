import { generateErrorStructure } from "../validation/helper.js";

export const validateFasilitasId = (req, res, next) => {
  const errors = [];
  const { fasilitasId } = req.params;

  if (!fasilitasId) {
    errors.push(generateErrorStructure("fasilitasId", "Product fasilitasId is required"));
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

export const validateCreateFasilitas = (req, res, next) => {
  const errors = [];
  const { name } = req.body;

  if (!name || name.trim() === "") {
    errors.push(generateErrorStructure("name", "Facilty name is required"));
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

export const validateUpdateFasilitas = (req, res, next) => {
  const errors = [];
  const { name } = req.body;

  if (name !== undefined && name.trim() === "") {
    errors.push(generateErrorStructure("name", "Facility name cannot be empty"));
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

export const validateDeleteFasilitas = (req, res, next) => {
  const errors = [];
  const { fasilitasId } = req.params;
  if (!fasilitasId) {
    errors.push(generateErrorStructure("fasilitasId", "Facility fasilitasId is required"));
  }
  next();
};
