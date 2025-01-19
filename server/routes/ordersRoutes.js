import express from "express";
import { getOrders, editOrderStatus } from "../controllers/ordersController.js";

const router = express.Router();

router.get("/get-orders/:id", getOrders);
router.put("/edit-order-status/:id", editOrderStatus);

export default router;
