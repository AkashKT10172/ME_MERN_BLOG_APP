import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likeOrUnlikePost
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getAllPosts);
router.get('/:id', optionalAuth, getPostById);

// Protected
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likeOrUnlikePost);

export default router;
