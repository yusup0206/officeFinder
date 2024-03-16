import express from 'express';
import {
  updateUser,
  uploadAvatar,
  getUser,
  deleteUser,
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUSer.js';

const router = express.Router();

// Apply the uploadAvatar middleware before verifyToken
router.post('/update/:id', uploadAvatar, verifyToken, updateUser);
router.delete('/delete/:id', uploadAvatar, verifyToken, deleteUser);
router.get('/:username', getUser); // ATASAN

export default router;
