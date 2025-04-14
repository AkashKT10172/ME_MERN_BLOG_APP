// CRIO_SOLUTION_START_MODULE_ONE
import express from 'express';
import {
  addComment,
  getPostComments,
  deleteComment
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/posts/:id/comments', protect, addComment); // done
router.get('/posts/:id/comments', getPostComments); // done
router.delete('/comments/:id', protect, deleteComment); // done

export default router;
// CRIO_SOLUTION_END_MODULE_ONE