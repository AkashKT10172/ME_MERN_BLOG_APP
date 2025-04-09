import express from 'express';
import {
  addComment,
  getPostComments,
  deleteComment
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/posts/:id/comments', protect, addComment);
router.get('/posts/:id/comments', getPostComments);
router.delete('/comments/:id', protect, deleteComment);

export default router;
