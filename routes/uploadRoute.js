const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadController = require('../controllers/UploadController');
const { createUpload, getUpload, getUserUploads, updateUpload, deleteUpload } = require('../controllers/uploadController');

// Multer configuration with enhanced logging
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, '../uploads');
        
        // Ensure uploads directory exists with detailed logging
        if (!fs.existsSync(uploadsDir)) {
            try {
                fs.mkdirSync(uploadsDir, { recursive: true });
                console.log('Uploads directory created:', uploadsDir);
            } catch (err) {
                console.error('Failed to create uploads directory:', err);
            }
        }
        
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueFileName = `${Date.now()}${path.extname(file.originalname)}`;
        console.log('Saving file:', {
            originalName: file.originalname,
            uniqueFileName: uniqueFileName
        });
        cb(null, uniqueFileName);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Validate file type
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

// Routes with enhanced error handling
router.post('/create', 
    (req, res, next) => {
        console.log('Upload request body:', req.body);
        next();
    },
    upload.single('image'), 
    (err, req, res, next) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ error: err.message });
        }
        next();
    },
    createUpload
);

router.get('/view_uploads', getUpload);
router.get('/user/:userId', getUserUploads);
router.put('/update/:id', updateUpload);
router.delete('/delete/:id', deleteUpload);
router.get('/category/:categoryId', uploadController.getUploadsByCategory);

module.exports = router;