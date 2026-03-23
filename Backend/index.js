const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();
const db = require("./db"); 


app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

// using multer to store pics
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

//  add glasses route
app.post("/add-glass", (req, res) => {
  const { name, price, image, description } = req.body;

  const sql = "INSERT INTO glasses (name, price, image, description) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, price, image, description], (err, result) => {
    if (err) return res.send(err);
    res.send("Glass added!");
  });
});

// get all glasses route

app.get("/glasses", (req, res) => {
  db.query("SELECT * FROM glasses", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

// route for multer
app.post("/upload", upload.single("image"), (req, res) => {
  res.json({ image: req.file.filename });
});
