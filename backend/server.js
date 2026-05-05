import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import showtimeRoutes from "./routes/showtimeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import seatRoutes from "./routes/seatRoutes.js";

dotenv.config();



const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend çalışıyor." });
});

app.use("/api/movies", movieRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

pool
  .query("SELECT NOW()")
  .then((result) => {
    console.log("PostgreSQL bağlandı:", result.rows[0]);
  })
  .catch((error) => {
    console.error("PostgreSQL bağlantı hatası:", error.message);
  });

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor.`);
});