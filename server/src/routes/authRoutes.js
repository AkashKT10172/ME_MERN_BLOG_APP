// CRIO_SOLUTION_START_MODULE_ONE
import express from 'express';
import { registerUser, loginUser, googleLoginUser } from '../controllers/authController.js';

const router = express.Router();

// @route   POST /api/auth/register
router.post('/register', registerUser);

// @route   POST /api/auth/login
router.post('/login', loginUser);

//@route POST /api/auth/google-login
router.post('/google-login', googleLoginUser);

export default router;
// CRIO_SOLUTION_END_MODULE_ONE