const {Sequelize, DataTypes} = require('sequelize');
const User = require("./UserModel")

const sequelize = require('../database/db');

const Category = sequelize.define('Category',{

    id:{
       type: DataTypes.INTEGER,
       primaryKey: true, 
       autoIncrement: true,
    } ,
    name: {
        type:DataTypes.STRING,
        allowNull: false,
        
    }
});


module.exports = Category;