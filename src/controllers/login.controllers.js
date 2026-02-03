import Login from "../models/login.models.js";
import { response_success, response_created, handleServiceErrorWithResponse } from "../utils/response.js";
import LoginService from "../services/login.service.js";
import { setAuthCookie } from "../lib/auth-token.js";

import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
  const registerControllerResponse = await LoginService.registerService(req.body);
  if (!registerControllerResponse.status) {
    return handleServiceErrorWithResponse(res, registerControllerResponse);
  }
  return response_created(res, { user: registerControllerResponse.data }, "User registered successfully");
};

export const login = async (req, res) => {
  const loginControllerResponse = await LoginService.loginService(req.body.email, req.body.password);
  if (!loginControllerResponse.status) {
    return handleServiceErrorWithResponse(res, loginControllerResponse);
  }
  setAuthCookie(res, loginControllerResponse.data.token);
  return response_success(res, { user: loginControllerResponse.data.user }, "Login successful");
};

export const logout = (req, res) => {
  res.clearCookie("jwt");
  return response_success(res, null, "Logout successful");
};

export const getUser = async (req, res) => {
  const getUserControllerResponse = await LoginService.getUserService();
  if (!getUserControllerResponse.status) {
    return handleServiceErrorWithResponse(res, getUserControllerResponse);
  }
  return response_success(res, { users: getUserControllerResponse.data }, "Users retrieved successfully");
};

export const updateUser = async (req, res) => {
  const updateUserControllerResponse = await LoginService.updateUserService(req.params.userId, req.body);
  if (!updateUserControllerResponse.status) {
    return handleServiceErrorWithResponse(res, updateUserControllerResponse);
  }
  return response_success(res, { user: updateUserControllerResponse.data }, "User updated successfully");
};

export const deleteUser = async (req, res) => {
  const deleteUserControllerResponse = await LoginService.deleteUserService(req.params.userId);
  if (!deleteUserControllerResponse.status) {
    return handleServiceErrorWithResponse(res, deleteUserControllerResponse);
  }
  return response_success(res, null, "User deleted successfully");
};

export const getMe = async (req, res) => {
  const getMeControllerResponse = await Login.getMeService(req.params.userId);
  if (!getMeControllerResponse.status) {
    return handleServiceErrorWithResponse(res, getMeControllerResponse);
  }
  return response_success(res, { users: getMeControllerResponse.data }, "Get me successfully");
};
