const {Sequelize, DataTypes} = require('sequelize');
const User = require("./UserModel")

const sequelize = require('../database/db');

const Upload = sequelize.define('Uploads',{

    id:{
       type: DataTypes.INTEGER,
       primaryKey: true, 
       autoIncrement: true,
    } ,
    description: {
        type:DataTypes.STRING,
        
     },
     isLiked:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
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
    
});

Upload.belongsTo(User, { foreignKey: "userId" });

module.exports = Upload;