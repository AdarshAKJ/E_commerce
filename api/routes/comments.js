import express from "express";
import { getComments } from "../controllers/comment.js";

const router = express.Router();

router.get("/getComments", getComments);


export default router;

