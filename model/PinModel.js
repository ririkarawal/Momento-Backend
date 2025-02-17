const {Sequelize, DataTypes} = require('sequelize');
const User = require("./UserModel")

const sequelize = require('../database/db');

const Pin = sequelize.define('Pins',{

    id:{
       type: DataTypes.INTEGER,
       primaryKey: true, 
       autoIncrement: true,
    } ,
    title: {
        type:DataTypes.STRING,
        
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

Pin.belongsTo(User, { foreignKey: "userId" });

module.exports = Pin;