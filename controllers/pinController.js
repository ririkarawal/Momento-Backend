const Pin = require('../model/PinModel');
const Upload = require('../model/UploadModel');
const User = require('../model/UserModel');
const sequelize = require('../database/db');

// Get all pins for logged-in user
const getPin = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const userId = req.user.id;
        console.log(`Getting pins for authenticated user: ${userId}`);

        // Get pins for the logged-in user
        const pins = await Pin.findAll({
            where: { userId: userId },
            include: [
                {
                    model: Upload,
                    as: 'Upload',
                    attributes: ['id', 'imagePath', 'description']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        console.log(`Found ${pins.length} pins for user ${userId}`);
        return res.status(200).json(pins);
    } catch (error) {
        console.error("Error in getPin:", error);
        res.status(500).json({
            error: "Failed to load pins",
            details: error.message
        });
    }
};

// Create a new pin
const createPin = async (req, res) => {
    let t;

    try {
        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        console.log("Create pin request body:", req.body);

        const { uploadId } = req.body;
        const userId = req.user.id;

        console.log(`Creating pin with userId=${userId}, uploadId=${uploadId}`);

        // Start transaction
        t = await sequelize.transaction();

        // Verify the upload exists
        const uploadExists = await Upload.findByPk(uploadId);
        if (!uploadExists) {
            if (t) await t.rollback();
            return res.status(404).json({
                error: "Upload not found",
                message: `No upload found with ID: ${uploadId}`
            });
        }

        // Check if pin already exists for this specific user and upload
        const existingPin = await Pin.findOne({
            where: {
                userId: userId,
                uploadId: uploadId
            }
        });

        if (existingPin) {
            if (t) await t.rollback();
            return res.status(409).json({
                error: "Pin already exists",
                message: "You have already pinned this image",
                pin: existingPin
            });
        }

        // Create new pin
        const newPin = await Pin.create({
            userId: userId,
            uploadId: uploadId,
            title: null
        }, { transaction: t });

        await t.commit();
        t = null;

        console.log(`Pin created successfully: ID=${newPin.id}`);

        // Fetch the complete pin with its upload
        const createdPin = await Pin.findByPk(newPin.id, {
            include: [
                {
                    model: Upload,
                    as: 'Upload',
                    attributes: ['id', 'imagePath', 'description']
                }
            ]
        });

        res.status(201).json(createdPin);
    } catch (error) {
        if (t) await t.rollback();

        console.error("Error in createPin:", error);

        res.status(500).json({
            error: "Failed to create pin",
            message: error.message
        });
    }
};

// Delete a pin
const deletePin = async (req, res) => {
    let t;

    try {
        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const pinId = req.params.id;
        const userId = req.user.id;

        console.log(`Delete pin request: ID ${pinId} by user ${userId}`);

        t = await sequelize.transaction();

        // Find the pin, ensuring it belongs to the current user
        const pin = await Pin.findOne({
            where: {
                id: pinId,
                userId: userId
            }
        });

        if (!pin) {
            if (t) await t.rollback();
            console.log(`Pin ${pinId} not found or doesn't belong to user ${userId}`);
            return res.status(404).json({ message: 'Pin not found or you do not have permission to delete it' });
        }

        await pin.destroy({ transaction: t });

        await t.commit();
        t = null;

        console.log(`Pin ${pinId} deleted successfully by user ${userId}`);
        res.status(200).json({ message: 'Pin deleted successfully' });
    } catch (err) {
        if (t) await t.rollback();

        console.error("Error in deletePin:", err);
        res.status(500).json({
            error: err.message
        });
    }
};

// Get pins for a specific user
const getUserPins = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`Getting pins for user ID: ${userId}`);

        const pins = await Pin.findAll({
            where: { userId: userId },
            include: [
                {
                    model: Upload,
                    as: 'Upload',
                    attributes: ['id', 'imagePath', 'description']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        console.log(`Found ${pins.length} pins for user ${userId}`);
        res.status(200).json(pins);
    } catch (error) {
        console.error("Error in getUserPins:", error);
        res.status(500).json({
            error: "Failed to load user pins",
            details: error.message
        });
    }
};

module.exports = {
    createPin,
    getPin,
    deletePin,
    getUserPins
};