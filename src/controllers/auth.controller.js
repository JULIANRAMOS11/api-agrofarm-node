// src/controllers/auth.controller.js
// Controlador de autenticación AGROFARM

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FILE_PATH = path.join(__dirname, "..", "data", "users.json");

function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error leyendo users.json:", error);
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2), "utf8");
}

// POST /api/auth/register
export function register(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "El usuario y la contraseña son obligatorios",
    });
  }

  const users = readUsers();
  const existingUser = users.find((u) => u.username === username);

  if (existingUser) {
    return res.status(409).json({
      error: "El usuario ya existe. Intente con otro nombre de usuario.",
    });
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    username,
    passwordHash,
    rol: "USER",
  };

  users.push(newUser);
  writeUsers(users);

  return res.status(201).json({
    mensaje: "Usuario registrado correctamente",
    usuario: {
      id: newUser.id,
      username: newUser.username,
      rol: newUser.rol,
    },
  });
}

// POST /api/auth/login
export function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "El usuario y la contraseña son obligatorios",
    });
  }

  const users = readUsers();
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({
      error: "Error en la autenticación: usuario o contraseña incorrectos",
    });
  }

  const isValidPassword = bcrypt.compareSync(password, user.passwordHash);

  if (!isValidPassword) {
    return res.status(401).json({
      error: "Error en la autenticación: usuario o contraseña incorrectos",
    });
  }

  return res.json({
    mensaje: "Autenticación satisfactoria",
    usuario: {
      id: user.id,
      username: user.username,
      rol: user.rol,
    },
  });
}
