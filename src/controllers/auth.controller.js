import bcrypt from "bcryptjs";
import { query } from "../config/db.js";

export async function register(req, res) {
  const { username, password, role = "USER" } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "username y password son obligatorios" });
  }

  try {
    const existing = await query("SELECT id FROM users WHERE username = $1", [
      username,
    ]);
    if (existing.rowCount > 0) {
      return res.status(409).json({ error: "El usuario ya existe" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const { rows } = await query(
      "INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role",
      [username, passwordHash, role]
    );

    res.status(201).json({ mensaje: "Usuario registrado", usuario: rows[0] });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error registrando usuario", detail: err.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "email y password son obligatorios" });
  }

  try {
    const { rows } = await query(
      "SELECT id, username, email, role, password_hash FROM users WHERE email = $1",
      [email]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    res.json({
      mensaje: "Login OK",
      usuario: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: "Error en login", detail: err.message });
  }
}
