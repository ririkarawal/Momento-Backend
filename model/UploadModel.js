const { Sequelize, DataTypes } = require("sequelize");
const User = require("./UserModel");
const sequelize = require("../database/db");

const Upload = sequelize.define("Uploads", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isLiked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        },
        onDelete: "CASCADE",
    },
    imagePath: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'Uploads',
    timestamps: true,
});

// Ensure this is after both models are defined
Upload.belongsTo(User, { 
    foreignKey: "userId",
    as: 'User',
    onDelete: 'CASCADE'
});

// Add this line to force proper table creation order
Upload.sync({ alter: false }); // Don't alter existing tables

module.exports = Upload;