import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Błąd wylogowania.' });
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Wylogowano pomyślnie.' });
    });
  });

export default router;
