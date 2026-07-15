import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import AppError from '../utils/app-error';

// Ensure upload directories exist
const profileUploadDir = path.join(__dirname, '../../uploads/profiles');
if (!fs.existsSync(profileUploadDir)) {
  fs.mkdirSync(profileUploadDir, { recursive: true });
}

// Configure disk storage for avatars
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, profileUploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const userId = req.user?._id ? req.user._id.toString() : 'unknown';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `profile-${userId}-${uniqueSuffix}${ext}`);
  },
});

// Filter only image files
const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files (jpeg, jpg, png, webp, gif) are allowed!', 400));
  }
};

// 5MB max limit
export const uploadAvatarMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
