import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
import commentRoutes from './routes/commentRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api', commentRoutes);

app.get('/', (req, res) => {
  res.send('Blog API is running 🚀');
});

export default app;
