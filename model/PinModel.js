const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../database/db');
const User = require("./UserModel");
const Upload = require("./UploadModel");

const Pin = sequelize.define('Pins', {
    id: {
       type: DataTypes.INTEGER,
       primaryKey: true, 
       autoIncrement: true,
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
    uploadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Upload,
            key: "id",
        },
        onDelete: "CASCADE",
    }
}, {
    // Optional: add unique constraint to prevent duplicate pins
    indexes: [
        {
            unique: true,
            fields: ['userId', 'uploadId']
        }
    ]
});

// Associations
Pin.belongsTo(User, { foreignKey: "userId" });
Pin.belongsTo(Upload, { foreignKey: "uploadId" });
User.hasMany(Pin, { foreignKey: "userId" });
Upload.hasMany(Pin, { foreignKey: "uploadId" });

module.exports = Pin;