const {Sequelize, DataTypes} = require('sequelize');
const Upload = require("./UploadModel")

const sequelize = require('../database/db');
const { text } = require('body-parser');

const Comment = sequelize.define('Comments',{

    id:{
       type: DataTypes.INTEGER,
       primaryKey: true, 
       autoIncrement: true,
    } ,
    text: {
        type:DataTypes.INTEGER,
        
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
    
});

Comment.belongsTo(Upload, { foreignKey: "uploadId" });

module.exports = Comment;