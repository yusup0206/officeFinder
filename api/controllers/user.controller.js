import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import the 'path' module
import path from 'path';

// Use import.meta.url to get the current module URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the path where the images will be stored
const imagePath = path.join(
  __dirname,
  '../../public/assets/images/profile-imgs/'
);

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagePath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, 'profile-img-' + uniqueSuffix + extension);
  },
});

const upload = multer({ storage: storage });

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can only update your own account!'));
  }

  try {
    const updateFields = {
      username: req.body.username,
      email: req.body.email,
    };

    if (req.body.password) {
      updateFields.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (req.file) {
      const fileName = req.file.filename;
      updateFields.avatar = 'assets/images/profile-imgs/' + fileName;
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!updateUser) {
      return next(errorHandler(404, 'User not found'));
    }

    const { password, ...rest } = updateUser.toJSON();

    // Return the updated user data with the 'updatedUser' key
    res.status(200).json({ success: true, updatedUser: rest });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  const { username } = req.params;
  console.log(username);
  try {
    const user = await User.findOne({ username });

    const { password: pass, ...rest } = user.toJSON();

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Middleware to handle file uploads using multer
export const uploadAvatar = upload.single('avatar');

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};
