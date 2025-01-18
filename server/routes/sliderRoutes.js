import express from "express";
import { editSlider } from "../controllers/sliderController.js";

const router = express.Router();

router.put("/edit-slider/:id", editSlider);

export default router;
