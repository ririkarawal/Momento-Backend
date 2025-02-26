const Pin = require('../model/PinModel');
const Upload = require('../model/UploadModel');

const getPin = async (req, res) => {
    try {
        const pins = await Pin.findAll({
            include: [
                { 
                    model: Upload, 
                    attributes: ['id', 'imagePath', 'description'] 
                }
            ],
            attributes: ['id', 'userId', 'uploadId']
        });
        res.status(200).json(pins);
    } catch (error) {
        console.error("Error fetching pins:", error);
        res.status(500).json({ error: "Failed to load pins" });
    }
}

const createPin = async (req, res) => {
    try {
        // Ensure user is authenticated
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { uploadId } = req.body;
        const userId = req.user.id;

        // Check if upload exists
        const upload = await Upload.findByPk(uploadId);
        if (!upload) {
            return res.status(404).json({ error: "Upload not found" });
        }

        // Check if pin already exists
        const existingPin = await Pin.findOne({
            where: { userId, uploadId }
        });

        if (existingPin) {
            return res.status(400).json({ error: "Image already pinned" });
        }

        // Create new pin
        const newPin = await Pin.create({
            userId,
            uploadId
        });

        // Fetch the pin with associated upload
        const createdPin = await Pin.findByPk(newPin.id, {
            include: [{ model: Upload }]
        });

        res.status(201).json(createdPin);
    } catch (error) {
        console.error("Error creating pin:", error);
        res.status(500).json({ error: "Failed to create pin" });
    }
}

const deletePin = async (req, res) => {
    try {
        // Ensure user is authenticated
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const pinId = req.params.id;
        const userId = req.user.id;

        // Find the pin
        const pin = await Pin.findOne({
            where: { 
                id: pinId, 
                userId: userId 
            }
        });

        if (!pin) {
            return res.status(404).json({ message: 'Pin not found' });
        }

        // Delete the pin
        await pin.destroy();

        res.json({ message: 'Pin deleted successfully' });
    } catch (err) {
        console.error("Error deleting pin:", err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = { createPin, getPin, deletePin }