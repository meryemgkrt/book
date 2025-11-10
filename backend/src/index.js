import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRouters.js";
import { connectDB } from "./lib/db.js";
import job from "./lib/cron.js";

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

job.start();
app.use(express.json()); // JSON verileri için
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
  console.log(`Kodun çalışıyor ${PORT}`);
  connectDB();
});
