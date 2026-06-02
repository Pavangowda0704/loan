import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";

import applicationRoutes from "./routes/applicationRoutes.js";
import personalLoanRoutes from "./modules/personalLoan/personalLoan.routes.js";
import vehicleLoanRoutes from "./modules/vehicleLoan/vehicleLoan.routes.js";
import homeLoanRoutes from "./modules/homeLoan/homeLoan.routes.js";
import businessLoanRoutes from "./modules/businessLoan/businessLoan.routes.js";

import { errorHandler } from "./shared/middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_LOCAL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const uploadsDir = path.join(process.cwd(), "uploads");

app.use(
  "/uploads",
  express.static(uploadsDir, {
    index: false,
    setHeaders: (res, filePath) => {
      const ext = path.extname(filePath).toLowerCase();

      const mimeMap = {
        ".pdf": "application/pdf",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
      };

      if (mimeMap[ext]) {
        res.setHeader("Content-Type", mimeMap[ext]);
      }

      res.setHeader("Content-Disposition", "inline");
    },
  })
);

app.get("/", (req, res) => {
  res.send("LoanEase API is running");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    message: "LoanEase backend is running",
  });
});

app.use("/api/applications", applicationRoutes);
app.use("/api/personal-loans", personalLoanRoutes);
app.use("/api/vehicle-loans", vehicleLoanRoutes);
app.use("/api/home-loans", homeLoanRoutes);
app.use("/api/business-loans", businessLoanRoutes);

app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect database:", error.message);
    process.exit(1);
  });