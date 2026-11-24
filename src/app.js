import express from "express";
import cors from "cors";
import basesRoutes from "./routes/basesRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import hidraRoutes from "./routes/hidra.routes.js";

const app = express();

app.use(cors(opcoesCors()));
app.use(express.json());

app.use("/api", basesRoutes);
app.use("/api", chatRoutes);
app.use("/api", hidraRoutes);

function opcoesCors() {
  const configuradas = String(process.env.FRONTEND_URL || "")
    .split(",")
    .map((origem) => origem.trim())
    .filter(Boolean);
  const desenvolvimento = process.env.NODE_ENV !== "production";
  const permitidas = new Set([
    ...configuradas,
    ...(desenvolvimento ? ["http://localhost:5173", "http://127.0.0.1:5173"] : []),
  ]);

  return {
    origin(origem, callback) {
      if (!origem || permitidas.has(origem)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
  };
}

export default app;
