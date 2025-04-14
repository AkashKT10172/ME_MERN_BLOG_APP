// CRIO_SOLUTION_START_MODULE_ONE
import Post from '../models/Post.js';

// @desc    Create a new post
export const createPost = async (req, res) => {
  const { title, content, tags, image } = req.body;

  try {
    const post = await Post.create({
      title,
      content,
      tags,
      image,
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post', error: err.message });
  }
};

// @desc    Get all posts
export const getAllPosts = async (req, res) => {
  const { search, tags } = req.query;

  try {
    let query = {};

    // 🔍 Search by title or content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    // 🏷️ Filter by tags
    if (tags) {
      const tagsArray = tags.split(',').map((tag) => tag.trim());
      query.tags = { $in: tagsArray };
    }

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts', error: err.message });
  }
};


// @desc    Get single post
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('likes', 'name email');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likedByCurrentUser = req.user
      ? post.likes.some(user => user._id.toString() === req.user._id.toString())
      : false;

    res.json({
      ...post.toObject(),
      totalLikes: post.likes.length,
      likedByCurrentUser,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch post', error: err.message });
  }
};


// @desc    Update post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Allow update only by the author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const { title, content, tags, image } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags || post.tags;
    post.image = image || post.image;

    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update post', error: err.message });
  }
};

// @desc    Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne(); // ✅ Correct way to delete

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete post', error: err.message });
  }
};

export const likeOrUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id;
    const liked = post.likes.includes(userId);

    if (liked) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      message: liked ? 'Post unliked' : 'Post liked',
      totalLikes: post.likes.length,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle like', error: err.message });
  }
};
// CRIO_SOLUTION_END_MODULE_ONE