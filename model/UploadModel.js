const { Sequelize, DataTypes } = require("sequelize");
const User = require("./UserModel");
const Category = require('./CategoryModel');
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
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Category,
            key: "id",
        }
    },
    imagePath: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'Uploads',
    timestamps: true,
});

Upload.belongsTo(User, { 
    foreignKey: "userId",
    as: 'User',
    onDelete: 'CASCADE'
});

Upload.belongsTo(Category, { 
    foreignKey: "categoryId",
    as: 'Category'
});

Upload.sync({ alter: false });

module.exports = Upload;