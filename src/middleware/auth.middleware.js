import jwt from "jsonwebtoken";
import Login from "../models/login.models.js";
import dotenv from "dotenv";

dotenv.config();

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized = No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const login = await Login.findById(decoded.userId).select("-password");
    if (!login) {
      return res.status(404).json({ message: "User not found" });
    }

    req.login = login;
    next();
  } catch (error) {
    console.log("error in protectRoute middleware", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.login || !roles.includes(req.login.role)) {
      // Mengganti req.user dengan req.login
      return res.status(403).json({ message: "Forbidden: You do not have the right permissions" });
    }
    next();
  };
};
