const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// ----------------------------
// SERVE STATIC IMAGES
// ----------------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ----------------------------
// MULTER SETUP (UPLOAD IMAGES)
// ----------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ----------------------------
// HOME ROUTE
// ----------------------------
app.get("/", (req, res) => {
  res.send("API Running...");
});

// ----------------------------
// UPLOAD IMAGE API
// ----------------------------
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    image: req.file.filename
  });
});

// ----------------------------
// ADD GLASSES (SAVE TO DB)
// ----------------------------
app.post("/add-glass", (req, res) => {
  const { name, price, image, description } = req.body;

  const sql = `
    INSERT INTO glasses (name, price, image, description)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, price, image, description], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Glass added successfully",
      id: result.insertId
    });
  });
});

// ----------------------------
// GET ALL GLASSES
// ----------------------------
app.get("/glasses", (req, res) => {
  const sql = "SELECT * FROM glasses";

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});

// ----------------------------
// GET SINGLE GLASS (FOR FLASK)
// ----------------------------
app.get("/glasses/:id", (req, res) => {
  const id = req.params.id;

  const sql = "SELECT * FROM glasses WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(result[0]);
  });
});

// ----------------------------
// START SERVER
// ----------------------------
app.listen(5000, () => {
  console.log("🚀 Node server running on port 5000");
});