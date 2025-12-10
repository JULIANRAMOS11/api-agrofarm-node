// src/routes/auth.routes.js
// Rutas de autenticación AGROFARM

import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = Router();

// Ruta final: POST http://localhost:4000/api/auth/register
router.post("/register", register);

// Ruta final: POST http://localhost:4000/api/auth/login
router.post("/login", login);

export default router;
