import { query } from "../config/db.js";

export async function getAllPigs(_req, res) {
  try {
    const { rows } = await query("SELECT * FROM pigs ORDER BY id");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo cerdos", detail: err.message });
  }
}

export async function getPigById(req, res) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  try {
    const { rows } = await query("SELECT * FROM pigs WHERE id = $1", [id]);
    if (!rows[0]) return res.status(404).json({ error: "Cerdo no encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo cerdo", detail: err.message });
  }
}

export async function createPig(req, res) {
  const { codigo_arete, sexo, fecha_nacimiento, estado, peso_actual, lote_id, etapa_id, raza_id } = req.body;
  if (!codigo_arete || !sexo || !fecha_nacimiento) {
    return res.status(400).json({ error: "codigo_arete, sexo y fecha_nacimiento son obligatorios" });
  }

  try {
    const { rows } = await query(
      `INSERT INTO pigs (codigo_arete, sexo, fecha_nacimiento, estado, peso_actual, lote_id, etapa_id, raza_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        codigo_arete,
        sexo,
        fecha_nacimiento,
        estado || "ACTIVO",
        peso_actual ?? 0,
        lote_id || null,
        etapa_id || null,
        raza_id || null,
      ]
    );
    res.status(201).json({ mensaje: "Cerdo creado", cerdo: rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Error creando cerdo", detail: err.message });
  }
}

export async function updatePig(req, res) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  const { codigo_arete, sexo, fecha_nacimiento, estado, peso_actual, lote_id, etapa_id, raza_id } = req.body;

  try {
    const { rows } = await query(
      `UPDATE pigs
         SET codigo_arete = COALESCE($1, codigo_arete),
             sexo = COALESCE($2, sexo),
             fecha_nacimiento = COALESCE($3, fecha_nacimiento),
             estado = COALESCE($4, estado),
             peso_actual = COALESCE($5, peso_actual),
             lote_id = COALESCE($6, lote_id),
             etapa_id = COALESCE($7, etapa_id),
             raza_id = COALESCE($8, raza_id)
       WHERE id = $9
       RETURNING *`,
      [codigo_arete, sexo, fecha_nacimiento, estado, peso_actual, lote_id, etapa_id, raza_id, id]
    );

    if (!rows[0]) return res.status(404).json({ error: "Cerdo no encontrado" });
    res.json({ mensaje: "Cerdo actualizado", cerdo: rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Error actualizando cerdo", detail: err.message });
  }
}

export async function updatePigStatus(req, res) {
  const id = Number(req.params.id);
  const { estado } = req.body;
  if (Number.isNaN(id) || !estado) {
    return res.status(400).json({ error: "ID y estado son obligatorios" });
  }

  try {
    const { rows } = await query("UPDATE pigs SET estado = $1 WHERE id = $2 RETURNING *", [
      estado,
      id,
    ]);
    if (!rows[0]) return res.status(404).json({ error: "Cerdo no encontrado" });
    res.json({ mensaje: "Estado actualizado", cerdo: rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Error actualizando estado", detail: err.message });
  }
}

export async function deletePig(req, res) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  try {
    const { rows } = await query("DELETE FROM pigs WHERE id = $1 RETURNING *", [id]);
    if (!rows[0]) return res.status(404).json({ error: "Cerdo no encontrado" });
    res.json({ mensaje: "Cerdo eliminado", cerdo: rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Error eliminando cerdo", detail: err.message });
  }
}
