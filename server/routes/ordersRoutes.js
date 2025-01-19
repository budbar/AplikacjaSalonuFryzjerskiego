import express from "express";
import { getOrders, editOrderStatus, getAllOrders } from "../controllers/ordersController.js";

const router = express.Router();

router.get("/get-orders/:id", getOrders);
router.put("/edit-order-status/:id", editOrderStatus);
router.get("/get-all-orders", getAllOrders);

export default router;
