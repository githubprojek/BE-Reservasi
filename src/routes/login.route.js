import express from "express";
import { login, register, logout, getLogin, updateStaff, deleteStaff, checkAuth } from "../controllers/login.controllers.js";
import { protectRoute, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", protectRoute, authorizeRoles("Super Admin"), register);
router.post("/login", login);
router.get("/check-auth", protectRoute, (req, res) => {
  res.status(200).json({ user: req.login });
});
router.post("/logout", logout);
router.get("/getUser", protectRoute, getLogin);
router.put("/updateStaff/:staffId", protectRoute, authorizeRoles("Super Admin"), updateStaff);
router.delete("/deleteStaff/:staffId", protectRoute, authorizeRoles("Super Admin"), deleteStaff);

export default router;
