// backend/src/modules/auth/auth.routes.js
import { Router } from "express";
import { register, login, getMe, getMyApplications, getAllUsers } from "./auth.controller.js";
import { requireAuth } from "../../shared/middleware/authMiddleware.js";

const router = Router();

router.post("/register",       register);
router.post("/login",          login);
router.get("/me",              requireAuth, getMe);
router.get("/my-applications", requireAuth, getMyApplications);
router.get("/users",           getAllUsers);   // ✅ NEW — admin users list (no auth needed, admin has its own password guard)

export default router;