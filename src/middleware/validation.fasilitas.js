import { generateErrorStructure } from "../validation/helper.js";

export const validateFacilityId = (req, res, next) => {
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

export const validateCreateProduct = (req, res, next) => {
  const errors = [];
  const { name, price } = req.body;

  if (!name || name.trim() === "") {
    errors.push(generateErrorStructure("name", "Product name is required"));
  }

  if (price === undefined) {
    errors.push(generateErrorStructure("price", "Price is required"));
  } else if (typeof price !== "number") {
    errors.push(generateErrorStructure("price", "Price must be a number"));
  } else if (price <= 0) {
    errors.push(generateErrorStructure("price", "Price must be greater than 0"));
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
