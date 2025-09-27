require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cloudinary = require('./cloudinary'); // your configured cloudinary.v2

const app = express();

// ✅ Fix CORS: allow Netlify frontend + local dev
app.use(
  cors({
    origin: [
      "http://localhost:5173",         // Vite dev
      "http://localhost:3000",         // React dev alt
      "https://gramparule.netlify.app" // Netlify live site
    ],
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(fileUpload());

// In-memory DB (use real DB later)
let filesDB = {};

/**
 * ✅ GET files for a specific Namuna
 */
app.get('/namuna/:year/:id', (req, res) => {
  const decodedYear = decodeURIComponent(req.params.year); // "2025/26"
  const { id } = req.params;
  const key = `${decodedYear}:${id}`;
  const files = filesDB[key] || [];
  return res.json(files);
});

/**
 * ✅ UPLOAD file to Cloudinary
 */
app.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { year, namuna } = req.body;
    const safeYear = decodeURIComponent(year); // "2025/26"
    const key = `${safeYear}:${namuna}`;

    const file = req.files.file;
    const tempPath = path.join(__dirname, 'temp', file.name);

    // Save temporarily
    await file.mv(tempPath);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(tempPath, {
      folder: `namuna/${safeYear}/${namuna}`,
      resource_type: "auto",
    });

    // Clean up
    fs.unlinkSync(tempPath);

    // Save in memory
    if (!filesDB[key]) filesDB[key] = [];
    filesDB[key].push({ url: result.secure_url, public_id: result.public_id });

    return res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

/**
 * ✅ DELETE file from Cloudinary
 */
app.delete('/delete', async (req, res) => {
  try {
    const { year, namuna, public_id } = req.body;
    const safeYear = decodeURIComponent(year);
    const key = `${safeYear}:${namuna}`;

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(public_id);

    // Remove from memory
    if (filesDB[key]) {
      filesDB[key] = filesDB[key].filter(file => file.public_id !== public_id);
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Delete failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
