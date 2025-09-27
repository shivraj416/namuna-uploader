require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const cloudinary = require("./cloudinary");
const requireAuth = require("./verifyClerk"); // Clerk middleware

const app = express();

// ------------------- CORS -------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://gramparule.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ------------------- Middlewares -------------------
app.use(express.json());
app.use(fileUpload({ createParentPath: true }));

// ------------------- In-memory DB -------------------
let filesDB = {}; // replace with real DB in production

// ------------------- Routes -------------------
const router = express.Router();

// ✅ PUBLIC: GET files for a specific Namuna
router.get("/namuna/:year/:id", (req, res) => {
  const decodedYear = decodeURIComponent(req.params.year);
  const { id } = req.params;
  const key = `${decodedYear}:${id}`;
  const files = filesDB[key] || [];
  return res.json(files);
});

// ✅ PROTECTED routes: upload
router.post("/upload", requireAuth, async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { year, namuna } = req.body;
    const safeYear = decodeURIComponent(year);
    const key = `${safeYear}:${namuna}`;

    const file = req.files.file;
    const tempDir = path.join(__dirname, "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    const tempPath = path.join(tempDir, file.name);

    await file.mv(tempPath);

    const result = await cloudinary.uploader.upload(tempPath, {
      folder: `namuna/${safeYear}/${namuna}`,
      resource_type: "auto",
    });

    fs.unlinkSync(tempPath);

    const fileData = {
      url: result.secure_url,
      public_id: result.public_id,
      raw: { resource_type: result.resource_type, format: result.format },
    };

    if (!filesDB[key]) filesDB[key] = [];
    filesDB[key].push(fileData);

    return res.json(fileData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

// ✅ PROTECTED route: delete
router.delete("/delete", requireAuth, async (req, res) => {
  try {
    const { year, namuna, public_id } = req.body;

    // ✅ Validate body
    if (!year || !namuna || !public_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const safeYear = decodeURIComponent(year);
    const key = `${safeYear}:${namuna}`;

    await cloudinary.uploader.destroy(public_id);

    if (filesDB[key]) {
      filesDB[key] = filesDB[key].filter((f) => f.public_id !== public_id);
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/delete error:", err);
    return res.status(500).json({ error: "Delete failed", details: err.message });
  }
});

// ------------------- Use router -------------------
app.use("/api", router);

// ------------------- Global Error Handler -------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// ------------------- Start server -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
