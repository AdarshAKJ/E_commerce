import express from "express";
import { getPosts, addPosts } from "../controllers/post.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", addPosts);


export default router;

