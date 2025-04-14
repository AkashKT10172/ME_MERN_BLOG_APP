// CRIO_SOLUTION_START_MODULE_ONE
import express from 'express';
import {
  getUserProfile,
  getMyProfile, 
  updateMyProfile,  
  getMyPosts 
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Specific routes FIRST
router.get('/me/posts', protect, getMyPosts);  
router.get('/me', protect, getMyProfile); // done  
router.put('/me', protect, updateMyProfile);  // done 

// ✅ Then the dynamic route
router.get('/:id', getUserProfile); // done

export default router;
// CRIO_SOLUTION_END_MODULE_ONE