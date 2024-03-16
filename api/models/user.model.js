import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.BASE_URL;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: '/assets/images/default-user.png',
    },
  },
  { timestamps: true }
);

userSchema.virtual('avatarUrl').get(function (params) {
  return `${baseURL}${this.avatar}`;
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

export default User;
