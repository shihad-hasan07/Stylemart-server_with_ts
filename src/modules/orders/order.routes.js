import { Router } from "express";
import { createOrder, deleteOrder, getAllOrders, getOrderById, getOrderByOrderNumber, getOrdersByUserId, updateOrderStatus, updatePaymentStatus } from "./order.controller.js";

const router = Router();

// Public Routes
router.post("/create", createOrder);
router.get("/order-number/:orderNumber", getOrderByOrderNumber);

// User Routes
router.get("/user/:userId", getOrdersByUserId);

// Admin Routes (Add authentication middleware later)
router.get("/all", getAllOrders);
router.get("/:orderId", getOrderById);
router.patch("/:orderId/status", updateOrderStatus);
router.patch("/:orderId/payment", updatePaymentStatus);
router.delete("/:orderId", deleteOrder);

export default router;