import Post from "../models/Post.js";
import User from "../models/User.js";

// In userController.js
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .populate('likes', '_id'); // To count likes

    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ post: post._id });
        return {
          ...post.toObject(),
          commentCount,
        };
      })
    );

    res.json(postsWithCounts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your posts', error: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    const postCount = await Post.countDocuments({ author: user._id });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      postCount
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch profile", error: err.message });
  }
};

// Private: get current user
export const getMyProfile = async (req, res) => {
  try {
    console.log('getMyProfile: req.user =', req.user);

    // Check if user exists
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const postCount = await Post.countDocuments({ author: req.user._id });

    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      postCount
    });
  } catch (err) {
    console.error('Error in getMyProfile:', err.message);
    res.status(500).json({ message: 'Server error in getMyProfile' });
  }
};


// Private: update current user
export const updateMyProfile = async (req, res) => {
  const user = req.user;
  const { name, avatar } = req.body;

  if (name) user.name = name;
  if (avatar) user.avatar = avatar;

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  });
};
