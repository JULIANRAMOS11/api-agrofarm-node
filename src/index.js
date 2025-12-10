// src/index.js
// API AGROFARM - Evidencia GA7-220501096-AA5-EV03

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import pigsRoutes from "./routes/pigs.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    mensaje: "API AGROFARM funcionando correctamente",
  });
});

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Rutas de cerdos
app.use("/api/pigs", pigsRoutes);

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor AGROFARM escuchando en http://localhost:${PORT}`);
});
