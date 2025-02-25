const { Sequelize, DataTypes } = require('sequelize');
const Upload = require("./UploadModel")
const User = require("./UserModel")
const sequelize = require('../database/db');
const Comment = sequelize.define('Comments', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    uploadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Upload,
            key: "id",
        },
        onDelete: "CASCADE",
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: "id",
        },
        onDelete: "SET NULL",
    }
});
Comment.belongsTo(Upload, { foreignKey: "uploadId" });
Comment.belongsTo(User, { foreignKey: "userId" });
module.exports = Comment; 