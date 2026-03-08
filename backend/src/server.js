import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import photoRoutes from "./routes/photoRoutes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/photos", photoRoutes);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
