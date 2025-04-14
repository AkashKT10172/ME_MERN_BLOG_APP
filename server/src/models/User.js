// CRIO_SOLUTION_START_MODULE_ONE
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false // Don't return password by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    googleId: {
      type: String // For Google OAuth
    },
    avatar: {
      type: String,
      default: 'https://ui-avatars.com/api/?name=User'
    },    
  },
  {
    timestamps: true
  }
);

// Hash password before saving (only if modified)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
// CRIO_SOLUTION_END_MODULE_ONE