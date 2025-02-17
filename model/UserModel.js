const {Sequelize, DataTypes} = require('sequelize');

const sequelize = require('../database/db');

const User = sequelize.define('Users',{

    id:{
       type: DataTypes.INTEGER,
       primaryKey: true, 
       autoIncrement: true,
    } ,
    username: {
        type:DataTypes.STRING,
        allowNull: false,
     },
     email:{
        type:DataTypes.STRING,
        allowNull: false,
     },
    password: {
        type:DataTypes.STRING,
        allowNull: false,
    },
    isAdmin: {
        type:DataTypes.BOOLEAN,
        defaultValue:false,

    },
    
});

module.exports = User;