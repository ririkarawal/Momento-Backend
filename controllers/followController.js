const Follow = require('../model/FollowModel');
const User = require('../model/UserModel');
const { Op } = require('sequelize');

exports.followUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { userId: followedId } = req.body;

    // Prevent self-following
    if (followerId === followedId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Check if user exists
    const userExists = await User.findByPk(followedId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      where: { followerId, followedId }
    });

    if (existingFollow) {
      // Unfollow if already following
      await existingFollow.destroy();
      return res.status(200).json({ 
        message: "Unfollowed successfully", 
        isFollowing: false 
      });
    }

    // Create new follow
    await Follow.create({ followerId, followedId });
    
    res.status(201).json({ 
      message: "Followed successfully", 
      isFollowing: true 
    });
  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({ message: "Error processing follow request" });
  }
};

exports.getFollowersCount = async (req, res) => {
  try {
    const userId = req.params.userId;

    const followersCount = await Follow.count({
      where: { followedId: userId }
    });

    res.status(200).json({ followers: followersCount });
  } catch (error) {
    console.error("Followers count error:", error);
    res.status(500).json({ message: "Error fetching followers count" });
  }
};

exports.getFollowingStatus = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { userId: followedId } = req.params;

    const follow = await Follow.findOne({
      where: { followerId, followedId }
    });

    res.status(200).json({ 
      isFollowing: !!follow 
    });
  } catch (error) {
    console.error("Following status error:", error);
    res.status(500).json({ message: "Error checking following status" });
  }
};