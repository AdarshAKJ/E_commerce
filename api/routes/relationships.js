import express from "express";
import { getRelationship, deletRelationship, addRelationship } from "../controllers/relationship.js";

const router = express.Router();

router.get("/", getRelationship);
router.post("/", addRelationship);
router.delete("/", deletRelationship);

export default router;
