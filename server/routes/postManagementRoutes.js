import express from "express";
import { addPost, updatePost, deletePost,  getPosts, getAcceptedPosts, getAcceptedCommentsCount, getCommentsCount, getPostsByCategory } from "../controllers/postManagementController.js";

const router = express.Router();

router.post('/add-post', addPost);
router.put("/update-post/:id", updatePost);
router.delete("/delete-post/:id", deletePost);
router.get("/get-posts", getPosts);
router.get("/get-accepted-posts", getAcceptedPosts);
router.get("/get-posts-by-category/:category", getPostsByCategory);
router.get("/get-accepted-comments-count/:id", getAcceptedCommentsCount);
router.get("/get-comments-count/:id", getCommentsCount);

export default router;
