import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import pigsRoutes from "./routes/pigs.routes.js";
import { pool } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN?.split(",").map((o) =>
  o.trim()
);

app.use(cors({ origin: FRONTEND_ORIGIN || "*", credentials: false }));
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT NOW() AS now");
    res.json({ ok: true, now: rows[0].now });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/pigs", pigsRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => {
  console.log(`API AGROFARM running on http://localhost:${PORT}`);
});
