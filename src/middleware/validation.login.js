import { generateErrorStructure } from "../validation/helper.js";

export const validateRegister = (req, res, next) => {
  const errors = [];
  const { email, fullName, notelp, password, role } = req.body;
  if (!email || email.trim() === "") {
    errors.push(generateErrorStructure("email", "Email is required"));
  }
  if (!fullName || fullName.trim() === "") {
    errors.push(generateErrorStructure("fullName", "Full name is required"));
  }
  if (!notelp || notelp.trim() === "") {
    errors.push(generateErrorStructure("notelp", "Phone number is required"));
  }
  if (!password || password.trim() === "") {
    errors.push(generateErrorStructure("password", "Password is required"));
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

export const validateLogin = (req, res, next) => {
  const errors = [];
  const { email, password } = req.body;
  if (!email || email.trim() === "") {
    errors.push(generateErrorStructure("email", "Email is required"));
  }
  if (!password || password.trim() === "") {
    errors.push(generateErrorStructure("password", "Password is required"));
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

export const validateUpdateUser = (req, res, next) => {
  const errors = [];
  const { email, fullName, notelp, role } = req.body;

  if (email !== undefined && email.trim() === "") {
    errors.push(generateErrorStructure("email", "Email cannot be empty"));
  }

  if (fullName !== undefined && fullName.trim() === "") {
    errors.push(generateErrorStructure("fullName", "Full name cannot be empty"));
  }

  if (notelp !== undefined) {
    if (notelp.trim() === "") {
      errors.push(generateErrorStructure("notelp", "Phone number cannot be empty"));
    } else if (!/^\d+$/.test(notelp)) {
      errors.push(generateErrorStructure("notelp", "Phone number must contain only numbers"));
    }
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
