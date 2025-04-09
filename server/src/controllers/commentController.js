import Comment from '../models/commentModel.js';

export const addComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      text: req.body.text,
      author: req.user._id,
      post: req.params.id,
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment', error: err.message });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments', error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (
      comment.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comment', error: err.message });
  }
};
