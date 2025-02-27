const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const User = require("./UserModel");
const Upload = require("./UploadModel");

const Pin = sequelize.define('Pin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    uploadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Uploads',
            key: 'id'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Pins',
    timestamps: true,
    indexes: [
        // This creates a compound unique index on userId and uploadId
        // to ensure a user can only pin an upload once
        {
            unique: true,
            fields: ['userId', 'uploadId']
        }
    ]
});

// Define associations
Pin.belongsTo(User, {
    foreignKey: 'userId'
});

Pin.belongsTo(Upload, {
    foreignKey: 'uploadId',
    as: 'Upload'
});

module.exports = Pin;