// CRIO_SOLUTION_START_MODULE_ONE
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  const { name, email, password, avatar } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, avatar });

    const token = generateToken(user);
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar : user.avatar,
        role: user.role
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar : user.avatar,
        role: user.role
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const googleLoginUser = async (req, res) => {
  const { name, email, avatar, role } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        avatar,
        role,
        password: '12345678', // no password needed
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role:'user'
      },
      token
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
// CRIO_SOLUTION_END_MODULE_ONE