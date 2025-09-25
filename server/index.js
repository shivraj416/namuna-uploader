require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cloudinary = require('./cloudinary'); // configured cloudinary.v2

const app = express();

// Enable CORS
app.use(cors({ origin: true }));
app.use(express.json());

// Configure file upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp'),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  })
);

// In-memory storage (replace with DB for production)
const filesDB = {}; // key = "year:namuna" -> value = array of file metadata

// Health check
app.get('/', (req, res) => res.json({ ok: true }));

// ✅ GET files for a specific Namuna (frontend /namuna/:year/:id calls this)
app.get('/namuna/:year/:id', (req, res) => {
  const decodedYear = decodeURIComponent(req.params.year); // decode slashes
  const { id } = req.params;
  const key = `${decodedYear}:${id}`;
  const files = filesDB[key] || [];
  return res.json(files); // always return array
});

// ✅ GET files (alternative route) – return plain array too
app.get('/api/files', (req, res) => {
  const { year, namuna } = req.query;
  if (!year || !namuna) {
    return res.status(400).json({ error: 'year and namuna are required' });
  }

  const key = `${year}:${namuna}`;
  const files = filesDB[key] || [];
  return res.json(files); // return array, not wrapped
});

// ✅ POST upload a file
app.post('/api/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.file;
    const { year, namuna } = req.body;

    if (!year || !namuna) {
      return res.status(400).json({ error: 'year and namuna are required' });
    }

    const folder = `namuna/${year.replace('/', '-')}/namuna-${String(
      namuna
    ).padStart(2, '0')}`;

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder,
      use_filename: true,
      unique_filename: false,
      resource_type: 'auto',
    });

    try {
      fs.unlinkSync(file.tempFilePath);
    } catch (e) {}

    const fileMeta = {
      success: true,
      public_id: result.public_id,
      url: result.secure_url,
      raw: {
        resource_type: result.resource_type,
        format: result.format,
        bytes: result.bytes,
      },
    };

    // Save in memory
    const key = `${year}:${namuna}`;
    if (!filesDB[key]) filesDB[key] = [];
    filesDB[key].push(fileMeta);

    return res.json(fileMeta);
  } catch (err) {
    console.error('Upload error:', err);
    return res
      .status(500)
      .json({ error: 'upload_failed', details: err.message });
  }
});

// ✅ POST delete a file
app.post('/api/delete', async (req, res) => {
  try {
    const { public_id, year, namuna, resource_type } = req.body;
    if (!public_id || !year || !namuna) {
      return res
        .status(400)
        .json({ error: 'public_id, year, and namuna required' });
    }

    const type = resource_type || 'image';

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: type,
    });
    console.log('Cloudinary delete result:', result);

    if (result.result === 'ok' || result.result === 'not found') {
      const key = `${year}:${namuna}`;
      if (filesDB[key]) {
        filesDB[key] = filesDB[key].filter(
          (f) => f.public_id !== public_id
        );
      }
      return res.json({ success: true });
    } else {
      return res
        .status(500)
        .json({ error: 'delete_failed', details: result });
    }
  } catch (err) {
    console.error('Delete error:', err);
    return res
      .status(500)
      .json({ error: 'delete_failed', details: err.message });
  }
});

// Catch-all
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
