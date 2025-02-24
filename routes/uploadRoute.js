const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createUpload, getUpload, getUserUploads, updateUpload, deleteUpload } = require('../controllers/uploadController');

// Absolute path for uploads
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    console.log('Uploads directory created:', UPLOADS_DIR);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Uploads directory path:', UPLOADS_DIR);
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueFileName = `${Date.now()}${path.extname(file.originalname)}`;
        console.log('File being saved:', {
            originalName: file.originalname,
            uniqueFileName: uniqueFileName
        });
        cb(null, uniqueFileName);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images are allowed.'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file size limit
    }
});

router.post('/create', 
    (req, res, next) => {
        console.log('Complete Upload Request:', {
            body: req.body,
            files: req.files,
            file: req.file
        });
        next();
    },
    upload.single('image'), 
    createUpload
);

router.get('/view_uploads', getUpload);
router.get('/user/:userId', getUserUploads);
router.put('/update/:id', updateUpload);
router.delete('/delete/:id', deleteUpload);

module.exports = router;