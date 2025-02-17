const {Sequelize, DataTypes} = require('sequelize');
const User = require("./CategoryUploadModel")

const sequelize = require('../database/db');
const Category = require('./CategoryModel');
const Upload = require("./UploadModel")

const CategoryUpload = sequelize.define('CategoryUploads',{
    CategoryUploadid:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
     } ,

    Categoryid:{
       type: DataTypes.INTEGER,
       references: {
           model: Category,
           key: "id",
       },
       onDelete: "CASCADE",
    } ,
    Uploadid: {
        type:DataTypes.STRING,
        references: { 
            model: User,
            key: "id",
        },
        onDelete: "CASCADE",
     },
     
    
});

CategoryUpload.belongsTo(Category, { foreignKey: "Categoryid" });
CategoryUpload.belongsTo(Upload, { foreignKey: "Uploadid" });

module.exports = CategoryUpload;