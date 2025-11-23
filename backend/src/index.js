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

app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true })); 

// ✅ Health check endpoint - EN ÜSTTE OLMALI
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "BookWorm API is running",
    timestamp: new Date().toISOString()
  });
});

// ✅ API health endpoint
app.get("/api", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "API is healthy"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
  
  // ✅ Cron job'u başlat
  job.start();
  console.log("⏰ Keep-alive cron job started");
});