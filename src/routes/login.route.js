import express from "express";
import { login, register, logout, getUser, updateUser, deleteUser } from "../controllers/login.controllers.js";
import { protectRoute, authorizeRoles } from "../middleware/auth.middleware.js";
import { validateRegister, validateLogin, validateUpdateUser } from "../middleware/validation.login.js";
const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.get("/getUser", getUser);
router.put("/updateUser/:userId", validateUpdateUser, updateUser);
router.delete("/deleteUser/:userId", deleteUser);
// router.post("/register", protectRoute, authorizeRoles("Super Admin"), register);
// router.post("/login", login);
// router.get("/check-auth", protectRoute, (req, res) => {
//   res.status(200).json({ user: req.login });
// });
// router.post("/logout", logout);
// router.get("/getUser", protectRoute, getLogin);
// router.put("/updateStaff/:staffId", protectRoute, authorizeRoles("Super Admin"), updateStaff);
// router.delete("/deleteStaff/:staffId", protectRoute, authorizeRoles("Super Admin"), deleteStaff);

export default router;
