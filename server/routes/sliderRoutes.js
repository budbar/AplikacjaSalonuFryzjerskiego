import express from "express";
import { editSlider, getSliderImages } from "../controllers/sliderController.js";

const router = express.Router();

router.put("/edit-slider/:id", editSlider);
router.get("/get-slider-images", getSliderImages);

export default router;
