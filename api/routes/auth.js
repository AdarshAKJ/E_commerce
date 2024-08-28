import express from "express";
import { login, register, logout, list } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/list", list);


export default router;

