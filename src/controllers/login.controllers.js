import Login from "../models/login.models.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
  const { email, fullName, notelp, password, role } = req.body;

  try {
    if (!email || !fullName || !notelp || !password || !role) {
      return res.status(400).json({ message: "Semua field diperlukan" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password harus minimal 6 karakter" });
    }

    const existingUser = await Login.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Pengguna sudah ada" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Buat tamu baru dengan data reservasi
    const newLogin = new Login({
      email,
      fullName,
      notelp,
      password: passwordHash,
      role,
    });

    await newLogin.save();
    res.status(201).json({ message: "Admin berhasil didaftarkan", data: newLogin });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan saat mendaftar" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Semua field diperlukan" });
    }

    const login = await Login.findOne({ email });
    if (!login) return res.status(404).json({ message: "Tamu tidak ditemukan" });

    const isPasswordMatch = await bcrypt.compare(password, login.password);
    if (!isPasswordMatch) return res.status(400).json({ message: "Kredensial tidak valid" });

    // Pakai generateToken dan simpan hasilnya
    const token = generateToken(login._id, res);
    res.status(200).json({
      _id: login._id,
      fullName: login.fullName,
      email: login.email,
      notelp: login.notelp,
      role: login.role,
      message: `${login.fullName} dengan role ${login.role} berhasil login`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan saat login" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Login.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logout berhasil" });
};

export const getLogin = async (req, res) => {
  try {
    const login = await Login.find();
    res.status(200).json({ login });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan saat mendapatkan tamu" });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const staffId = req.params.id;
    const { email, fullName, notelp, role, password } = req.body;

    // Siapkan field yang akan diupdate
    const updateFields = { email, fullName, notelp, role };

    // Jika password baru dikirim ➜ hash dulu
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    const staff = await Login.findByIdAndUpdate(staffId, updateFields, { new: true });

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({
      message: "Staff updated successfully",
      staff,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating staff", error: error.message });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const staffId = req.params.staffId;

    const staff = await Login.findByIdAndDelete(staffId);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting staff", error: error.message });
  }
};
