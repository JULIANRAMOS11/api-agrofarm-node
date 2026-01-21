import { Router } from "express";
import {
  getAllPigs,
  getPigById,
  createPig,
  updatePig,
  updatePigStatus,
  deletePig,
} from "../controllers/pigs.controller.js";

const router = Router();

router.get("/", getAllPigs);
router.get("/:id", getPigById);
router.post("/", createPig);
router.put("/:id", updatePig);
router.patch("/:id/status", updatePigStatus);
router.delete("/:id", deletePig);

export default router;
