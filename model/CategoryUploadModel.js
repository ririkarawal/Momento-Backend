const {Sequelize, DataTypes} = require('sequelize');
const User = require("./CategoryUploadModel")

const sequelize = require('../database/db');
const Category = require('./CategoryModel');
const Upload = require("./UploadModel")

const CategoryUpload = sequelize.define('CategoryUploads',{
    CategoryUploadid:{
        type: DataTypes.INTEGER,
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

Category.belongsTo(Category, { foreignKey: "Categoryid" });
Upload.belongsTo(Upload, { foreignKey: "Uploadid" });

module.exports = CategoryUpload;