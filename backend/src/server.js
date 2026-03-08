import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import photoRoutes from "./routes/photoRoutes.js";
import { env } from "./config/env.js";
import { ensureDefaultAdminUser } from "./services/bootstrapService.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/photos", photoRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  return res.status(500).json({ message: "Erro interno do servidor" });
});

async function startServer() {
  await ensureDefaultAdminUser();

  app.listen(env.port, () => {
    console.log(`API running on port ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start API", error);
  process.exit(1);
});
