import express from "express";
import { updateAddressData, getAddressData, getUserNames } from "../controllers/accountController.js";

const router = express.Router();

router.post("/update-address-data", updateAddressData);
router.get("/get-address-data", getAddressData)
router.get("/get-user-names/:id", getUserNames);

export default router;
