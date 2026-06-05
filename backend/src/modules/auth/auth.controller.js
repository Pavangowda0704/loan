// backend/src/modules/auth/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as AuthModel from "./auth.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "loanease_secret_2024";
const JWT_EXPIRES = "7d";

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name)     return res.status(400).json({ success: false, message: "Name is required" });
    if (!password) return res.status(400).json({ success: false, message: "Password is required" });
    if (!email && !phone)
      return res.status(400).json({ success: false, message: "Email or phone is required" });

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ success: false, message: "Invalid email format" });

    if (phone && !/^[0-9]{10}$/.test(phone))
      return res.status(400).json({ success: false, message: "Phone must be 10 digits" });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });

    if (email) {
      const existing = await AuthModel.findByEmailOrPhone(email);
      if (existing) return res.status(409).json({ success: false, message: "Email already registered" });
    }
    if (phone) {
      const existing = await AuthModel.findByEmailOrPhone(phone);
      if (existing) return res.status(409).json({ success: false, message: "Phone already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userId = await AuthModel.createUser({ name, email, phone, password_hash });
    const token  = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: { id: userId, name, email, phone },
    });
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password)
      return res.status(400).json({ success: false, message: "Email/phone and password are required" });

    const user = await AuthModel.findByEmailOrPhone(identifier.trim());
    if (!user)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await AuthModel.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await AuthModel.getUserApplications(req.userId);
    res.json({ success: true, applications });
  } catch (err) {
    console.error("getMyApplications error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch applications" });
  }
};

// ✅ NEW — Admin: get all registered users
export const getAllUsers = async (req, res) => {
  try {
    const users = await AuthModel.getAllUsers();
    res.json({ success: true, users });
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};