// CRIO_SOLUTION_START_MODULE_ONE
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
router.get('/', getAllPosts); // done
router.get('/:id', optionalAuth, getPostById); // done

// Protected
router.post('/', protect, createPost); // done
router.put('/:id', protect, updatePost); // done
router.delete('/:id', protect, deletePost); // done
router.post('/:id/like', protect, likeOrUnlikePost); // done

export default router;
// CRIO_SOLUTION_END_MODULE_ONE