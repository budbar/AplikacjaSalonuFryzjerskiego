import express from "express";
import { addComment, updateComment, deleteComment, getComments, getAcceptedComments } from "../controllers/commentController.js";

const router = express.Router();

router.post('/add-comment', addComment);
router.put("/update-comment/:id", updateComment);
router.delete("/delete-comment/:id", deleteComment);
router.get("/get-comments/:id", getComments);
router.get("/get-accepted-comments/:id", getAcceptedComments);

export default router;
