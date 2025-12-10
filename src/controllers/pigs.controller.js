// src/controllers/pigs.controller.js
// Controlador de cerdos (pigs) AGROFARM

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PIGS_FILE_PATH = path.join(__dirname, "..", "data", "pigs.json");

function readPigs() {
  try {
    const data = fs.readFileSync(PIGS_FILE_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error leyendo pigs.json:", error);
    return [];
  }
}

function writePigs(pigs) {
  fs.writeFileSync(PIGS_FILE_PATH, JSON.stringify(pigs, null, 2), "utf8");
}

// GET /api/pigs
export function getAllPigs(req, res) {
  const pigs = readPigs();
  return res.json(pigs);
}

// GET /api/pigs/:id
export function getPigById(req, res) {
  const id = parseInt(req.params.id, 10);
  const pigs = readPigs();
  const pig = pigs.find((p) => p.id === id);

  if (!pig) {
    return res.status(404).json({ error: "Cerdo no encontrado" });
  }

  return res.json(pig);
}

// POST /api/pigs
export function createPig(req, res) {
  const {
    codigo_arete,
    sexo,
    fecha_nacimiento,
    estado,
    etapa,
    peso_actual,
    lote,
  } = req.body;

  if (!codigo_arete || !sexo || !fecha_nacimiento) {
    return res.status(400).json({
      error:
        "Los campos codigo_arete, sexo y fecha_nacimiento son obligatorios",
    });
  }

  const pigs = readPigs();

  const newPig = {
    id: pigs.length > 0 ? pigs[pigs.length - 1].id + 1 : 1,
    codigo_arete,
    sexo,
    fecha_nacimiento,
    estado: estado || "ACTIVO",
    etapa: etapa || "DESCONOCIDA",
    peso_actual: peso_actual || 0,
    lote: lote || "SIN_LOTE",
  };

  pigs.push(newPig);
  writePigs(pigs);

  return res.status(201).json({
    mensaje: "Cerdo creado correctamente",
    cerdo: newPig,
  });
}

// PUT /api/pigs/:id
export function updatePig(req, res) {
  const id = parseInt(req.params.id, 10);
  const pigs = readPigs();
  const index = pigs.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Cerdo no encontrado" });
  }

  const pig = pigs[index];
  const {
    codigo_arete,
    sexo,
    fecha_nacimiento,
    estado,
    etapa,
    peso_actual,
    lote,
  } = req.body;

  pigs[index] = {
    ...pig,
    codigo_arete: codigo_arete ?? pig.codigo_arete,
    sexo: sexo ?? pig.sexo,
    fecha_nacimiento: fecha_nacimiento ?? pig.fecha_nacimiento,
    estado: estado ?? pig.estado,
    etapa: etapa ?? pig.etapa,
    peso_actual: peso_actual ?? pig.peso_actual,
    lote: lote ?? pig.lote,
  };

  writePigs(pigs);

  return res.json({
    mensaje: "Cerdo actualizado correctamente",
    cerdo: pigs[index],
  });
}

// PATCH /api/pigs/:id/status
export function updatePigStatus(req, res) {
  const id = parseInt(req.params.id, 10);
  const { estado } = req.body;

  if (!estado) {
    return res
      .status(400)
      .json({ error: "El campo estado es obligatorio para esta operación" });
  }

  const pigs = readPigs();
  const index = pigs.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Cerdo no encontrado" });
  }

  pigs[index].estado = estado;
  writePigs(pigs);

  return res.json({
    mensaje: "Estado del cerdo actualizado correctamente",
    cerdo: pigs[index],
  });
}

// DELETE /api/pigs/:id
export function deletePig(req, res) {
  const id = parseInt(req.params.id, 10);
  const pigs = readPigs();
  const index = pigs.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Cerdo no encontrado" });
  }

  const deleted = pigs[index];
  pigs.splice(index, 1);
  writePigs(pigs);

  return res.json({
    mensaje: "Cerdo eliminado correctamente",
    cerdo: deleted,
  });
}
