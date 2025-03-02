const { Sequelize, DataTypes } = require('sequelize'); 
const sequelize = require('../database/db'); 
const User = require("./UserModel");  

const Follow = sequelize.define('Follows', {   
  id: {     
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  followerId: {     
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE'
  },
  followedId: {     
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE'
  } 
}); 

// Associations 
Follow.belongsTo(User, {
  as: 'Follower',
  foreignKey: 'followerId'
}); 

Follow.belongsTo(User, {
  as: 'Followed',
  foreignKey: 'followedId'
}); 

User.hasMany(Follow, {
  as: 'Followings',
  foreignKey: 'followerId'
}); 

User.hasMany(Follow, {
  as: 'Followers',
  foreignKey: 'followedId'
}); 

module.exports = Follow;