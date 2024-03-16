import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(cookieParser());

// Serve static files from the shared 'public' directory
const publicPath = path.join(__dirname, '../public');
console.log(publicPath);
app.use(express.static(publicPath));

// Your existing route handling code goes here...
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
