import express from "express";
import { addComment, updateComment, deleteComment, getComments, getAcceptedComments } from "../controllers/commentController.js";

const router = express.Router();

router.post('/add-comment', addComment);
router.put("/update-comment/:id", updateComment);
router.delete("/delete-comment/:id", deleteComment);
router.get("/get-comments", getComments);
router.get("/get-accepted-comments", getAcceptedComments);

export default router;
