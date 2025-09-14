import express from "express";
import { createOrder, getUserOrders, getOrderDetail, getAllOrders, updateOrderStatus, getOrderStats } from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";

const orderRoute = express.Router();

// Routes cơ bản
orderRoute.post("/create", authMiddleware, createOrder);           // Tạo đơn hàng mới
orderRoute.get("/user", authMiddleware, getUserOrders);            // Lấy danh sách đơn hàng của user
orderRoute.get("/detail/:orderId", authMiddleware, getOrderDetail); // Lấy chi tiết đơn hàng

// Routes cho admin
orderRoute.get("/admin/all", authMiddleware, getAllOrders);        // Lấy tất cả đơn hàng cho admin
orderRoute.put("/admin/update-status/:orderId", authMiddleware, updateOrderStatus); // Cập nhật trạng thái đơn hàng
orderRoute.get("/admin/stats", authMiddleware, getOrderStats);     // Lấy thống kê đơn hàng

export default orderRoute;
