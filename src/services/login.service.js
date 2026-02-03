import { logger } from "../logger/logger.js";
import { INTERNAL_SERVER_ERROR_SERVICE_RESPONSE, INVALID_ID_SERVICE_RESPONSE, BadRequestWithMessage } from "../entities/service.js";
import Login from "../models/login.models.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/auth-token.js";
import dotenv from "dotenv";

dotenv.config();

class LoginService {
  static async registerService(userData) {
    try {
      const { email, fullName, notelp, password, role } = userData;
      const existingUser = await Login.findOne({ email });
      if (existingUser) return BadRequestWithMessage("Email already in use");
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      logger.info("Registering new user");
      const newUser = new Login({ email, fullName, notelp, password: passwordHash, role });
      const savedUser = await newUser.save();
      return {
        status: true,
        data: savedUser,
      };
    } catch (error) {
      logger.error("Error registering user: ", error);
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }

  static async loginService(email, password) {
    try {
      const login = await Login.findOne({ email });
      if (!login) return { status: false, code: 404, message: "User not found" };
      const isPasswordMatch = await bcrypt.compare(password, login.password);
      if (!isPasswordMatch) return BadRequestWithMessage("Email or password is incorrect");

      const token = generateToken(login._id);
      return {
        status: true,
        data: { user: login, token },
      };
    } catch (error) {
      logger.error("Error during login: ", error);
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }

  static async getUserService() {
    try {
      const login = await Login.find();
      return {
        status: true,
        data: login,
      };
    } catch (error) {
      logger.error("Error getting users: ", error);
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }

  static async updateUserService(userId, updateData) {
    try {
      const user = await Login.findByIdAndUpdate(userId, updateData, { new: true });
      if (!user) return INVALID_ID_SERVICE_RESPONSE;
      return {
        status: true,
        data: user,
      };
    } catch (error) {
      logger.error("Error updating user: ", error);
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }

  static async deleteUserService(userId) {
    try {
      const user = await Login.findByIdAndDelete(userId);
      if (!user) return INVALID_ID_SERVICE_RESPONSE;
      return {
        status: true,
        data: null,
      };
    } catch (error) {
      logger.error("Error deleting user: ", error);
      return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
  }

  static async getMeService(userId) {
    try {
      const user = await Login.findById(userId);
      if (!user) {
        return INVALID_ID_SERVICE_RESPONSE;
      }
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return logger.error("getMe service error:", error);
    }
  }
}

export default LoginService;
