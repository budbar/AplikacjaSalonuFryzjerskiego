import express from "express";
// import verifyToken from "../middleware/auth.js";
import { addImage, updateImage, deleteImage, getImages } from "../controllers/multimediaController.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({ storage });
  
  router.post('/add-image', upload.single('file'), addImage);
  router.put("/update-image/:id", updateImage);
  router.delete("/delete-image/:id", deleteImage);

  router.get("/get-images", getImages);
export default router;
