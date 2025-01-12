const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware for serving static files
app.use(express.static('public'));

// Storage configuration for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Handle file upload
app.post('/upload', upload.single('photoFile'), (req, res) => {
    if (req.file) {
        res.json({
            success: true,
            filePath: `/uploads/${req.file.filename}`,
        });
    } else {
        res.status(400).json({ success: false, message: 'Файл не загружен' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
