import express from "express";
import { addImage } from "../controllers/multimediaController.js";

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

export default router;
