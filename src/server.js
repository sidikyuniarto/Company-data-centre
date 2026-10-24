
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Company Data Centre",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/db-check", async (req, res) => {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [rows] = await connection.query(
      "SELECT 1 AS database_connected"
    );

    res.json({
      status: "ok",
      message: "Koneksi MySQL berhasil",
      result: rows[0]
    });
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(500).json({
      status: "error",
      message: "Koneksi database gagal. Periksa konfigurasi database."
    });
  } finally {
    if (connection) {
      await connection.end().catch(() => {});
    }
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Company Data Centre berjalan pada port ${PORT}`);
});
