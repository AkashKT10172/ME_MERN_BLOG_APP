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
router.get('/me', protect, getMyProfile);      
router.put('/me', protect, updateMyProfile);   

// ✅ Then the dynamic route
router.get('/:id', getUserProfile);

export default router;