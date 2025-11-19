require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const busboy = require("busboy");
const cloudinary = require("./cloudinary"); // your Cloudinary config

const app = express();

// ------------------- SUPER FAST CORS -------------------
const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:3000",
  "https://gramparule.netlify.app",
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error("CORS Not Allowed: " + origin));
    },
    credentials: true,
  })
);

// ------------------- Middlewares -------------------
app.use(express.json());
app.use(compression()); // ⚡ compress all responses

// ------------------- In-memory DB -------------------
let filesDB = {}; // Replace with real DB later

// ------------------- FAST: GET FILES -------------------
app.get("/api/namuna/:year/:id", (req, res) => {
  const { year, id } = req.params;
  const key = `${decodeURIComponent(year)}:${id}`;
  res.set("Cache-Control", "public, max-age=60"); // ⚡ 1 min caching
  return res.json(filesDB[key] || []);
});

// ------------------- ULTRA FAST UPLOAD -------------------
app.post("/api/upload", async (req, res) => {
  try {
    const bb = busboy({ headers: req.headers });

    let year, namuna;
    let uploadPromise;

    bb.on("field", (fieldname, val) => {
      if (fieldname === "year") year = decodeURIComponent(val);
      if (fieldname === "namuna") namuna = val;
    });

    bb.on("file", (fieldname, file, info) => {
      const { filename } = info;

      const cloudStream = cloudinary.uploader.upload_stream(
        {
          folder: `namuna/${year}/${namuna}`,
          resource_type: "auto",
        },
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });

          const key = `${year}:${namuna}`;
          const fileData = {
            url: result.secure_url,
            public_id: result.public_id,
            raw: { type: result.resource_type, format: result.format },
          };

          if (!filesDB[key]) filesDB[key] = [];
          filesDB[key].push(fileData);

          res.json(fileData);
        }
      );

      file.pipe(cloudStream); // ⚡ Direct stream upload
    });

    req.pipe(bb);
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

// ------------------- FAST DELETE -------------------
app.delete("/api/delete", async (req, res) => {
  try {
    const { year, namuna, public_id } = req.body;

    if (!year || !namuna || !public_id) {
      return res.status(400).json({ error: "Missing fields" });
    }

    await cloudinary.uploader.destroy(public_id);

    const safeYear = decodeURIComponent(year);
    const key = `${safeYear}:${namuna}`;

    if (filesDB[key]) {
      filesDB[key] = filesDB[key].filter((f) => f.public_id !== public_id);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
});

// ------------------- Start Server -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⚡ Ultra-fast server on ${PORT}`));
