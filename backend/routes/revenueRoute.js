import express from "express";
import { getRevenueStats, getRevenueDetails } from "../controllers/revenueController.js";
import authMiddleware from "../middleware/auth.js";

const revenueRoute = express.Router();

// Routes cho doanh thu (chỉ admin)
revenueRoute.get("/stats", authMiddleware, getRevenueStats);           // Lấy thống kê doanh thu
revenueRoute.get("/details", authMiddleware, getRevenueDetails);       // Lấy chi tiết doanh thu

export default revenueRoute;
