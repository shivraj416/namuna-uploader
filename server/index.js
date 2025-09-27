require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cloudinary = require('./cloudinary'); // your configured cloudinary.v2

const app = express();

// ✅ Fix CORS: allow Netlify frontend + local dev
const allowedOrigins = [
  "http://localhost:5173",         // Vite dev
  "http://localhost:3000",         // React dev alt
  "https://gramparule.netlify.app" // Netlify live site
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS: " + origin));
  },
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());
app.use(fileUpload({ createParentPath: true }));

// In-memory DB (use real DB in production)
let filesDB = {};

// Prefix all routes with /api
const router = express.Router();

// ✅ GET files for a specific Namuna
router.get('/namuna/:year/:id', (req, res) => {
  const decodedYear = decodeURIComponent(req.params.year);
  const { id } = req.params;
  const key = `${decodedYear}:${id}`;
  const files = filesDB[key] || [];
  return res.json(files);
});

// ✅ UPLOAD file to Cloudinary
router.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { year, namuna } = req.body;
    const safeYear = decodeURIComponent(year);
    const key = `${safeYear}:${namuna}`;

    const file = req.files.file;
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    const tempPath = path.join(tempDir, file.name);

    await file.mv(tempPath);

    const result = await cloudinary.uploader.upload(tempPath, {
      folder: `namuna/${safeYear}/${namuna}`,
      resource_type: "auto",
    });

    fs.unlinkSync(tempPath);

    if (!filesDB[key]) filesDB[key] = [];
    filesDB[key].push({ url: result.secure_url, public_id: result.public_id });

    return res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

// ✅ DELETE file from Cloudinary
router.delete('/delete', async (req, res) => {
  try {
    const { year, namuna, public_id } = req.body;
    const safeYear = decodeURIComponent(year);
    const key = `${safeYear}:${namuna}`;

    await cloudinary.uploader.destroy(public_id);

    if (filesDB[key]) {
      filesDB[key] = filesDB[key].filter(file => file.public_id !== public_id);
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Delete failed', details: err.message });
  }
});

// Use the /api prefix
app.use('/api', router);

// Optional: catch-all error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
