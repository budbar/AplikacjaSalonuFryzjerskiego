import express from "express";
import { addNotification, getNotifications, getNotificationsByCategory, getNotificationsById, updateNotificationStatus } from "../controllers/notificationsController.js";

const router = express.Router();

router.post('/add-notification', addNotification);
router.get('/get-notifications', getNotifications);
router.get('/get-notifications-by-category/:category', getNotificationsByCategory);
router.get('/get-notifications-by-id/:id', getNotificationsById);
router.put('/update-notifications-status/:id', updateNotificationStatus);

export default router;
