import express from "express";
import { updateAddressData, getAddressData } from "../controllers/accountController.js";

const router = express.Router();

router.post("/update-address-data", updateAddressData);
router.get("/get-address-data", getAddressData)

export default router;
