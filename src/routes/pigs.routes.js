// src/routes/pigs.routes.js
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

// Listar todos los cerdos
router.get("/", getAllPigs);

// Detalle de un cerdo
router.get("/:id", getPigById);

// Crear cerdo
router.post("/", createPig);

// Actualizar todos los datos del cerdo
router.put("/:id", updatePig);

// Actualizar solo el estado del cerdo
router.patch("/:id/status", updatePigStatus);

// Eliminar cerdo
router.delete("/:id", deletePig);

export default router;
