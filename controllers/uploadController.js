const Upload = require('../model/UploadModel');
const User = require('../model/UserModel');

const createUpload = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const newUpload = await Upload.create({
            description: req.body.description,
            isLiked: req.body.isLiked === "true",
            userId: req.body.userId,
            imagePath: req.file.filename // Store just the filename, without path
        });

        // Rest of your existing code remains the same
    } catch (error) {
        console.error("Error in createUpload:", error);
        res.status(500).json({ error: "Failed to upload" });
    }
};
const getUpload = async (req, res) => {
    try {
        console.log("Starting to fetch all uploads...");
        const uploads = await Upload.findAll({
            include: [{
                model: User,
                as: 'User',
                attributes: ['id', 'username']
            }],
            order: [['createdAt', 'DESC']]
        });
        console.log("Uploads fetched successfully:", JSON.stringify(uploads, null, 2));
        res.status(200).json(uploads);
    } catch (error) {
        console.error("Error in getUpload:", {
            message: error.message,
            sql: error.sql, // This will show the SQL query that failed
            fullError: error // Full error object
        });
        res.status(500).json({
            error: "Failed to load uploads",
            details: error.message
        });
    }
};

const getUserUploads = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log("Finding uploads for userId:", userId);

        // First check if user exists
        const user = await User.findByPk(userId);
        console.log("Found user:", user ? "Yes" : "No");

        const uploads = await Upload.findAll({
            where: { userId: userId },
            include: [{
                model: User,
                as: 'User',
                attributes: ['id', 'username']
            }],
            order: [['createdAt', 'DESC']]
        });
        console.log("Found uploads:", JSON.stringify(uploads, null, 2));
        res.status(200).json(uploads);
    } catch (error) {
        console.error("Error in getUserUploads:", {
            message: error.message,
            sql: error.sql,
            fullError: error
        });
        res.status(500).json({
            error: "Failed to load user uploads",
            details: error.message
        });
    }
};

// Keep your existing update and delete functions
const updateUpload = async (req, res) => {
    try {
        const upload = await Upload.findByPk(req.params.id);
        if (!upload) {
            return res.status(404).json({ message: 'Upload not found' });
        }
        await upload.update(req.body);
        res.json(upload);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteUpload = async (req, res) => {
    try {
        const upload = await Upload.findByPk(req.params.id);
        if (!upload) {
            return res.status(404).json({ message: 'Upload not found' });
        }
        await upload.destroy();
        res.json({ message: 'Upload deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createUpload,
    getUpload,
    getUserUploads,
    updateUpload,
    deleteUpload
};