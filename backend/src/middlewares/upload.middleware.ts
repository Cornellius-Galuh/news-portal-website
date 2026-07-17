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

// Filter only image files (Supports all image formats: jpg, jpeg, png, webp, gif, svg, avif, bmp, tiff, heic, etc.)
const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  const isImage = file.mimetype.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|bmp|svg|avif|heic|heif|tiff|ico)$/i.test(file.originalname);

  if (isImage) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed!', 400));
  }
};

// 50MB max limit
export const uploadAvatarMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

// Ensure article upload directory exists
const articleUploadDir = path.join(__dirname, '../../uploads/articles');
if (!fs.existsSync(articleUploadDir)) {
  fs.mkdirSync(articleUploadDir, { recursive: true });
}

// Configure disk storage for articles
const articleStorage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, articleUploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const articleId = req.params.id || 'unknown';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase() || '.jpeg';
    cb(null, `article-${articleId}-${uniqueSuffix}${ext}`);
  },
});

// Filter only image files (Supports every possible image format)
const articleFileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  const isImage = file.mimetype.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|bmp|svg|avif|heic|heif|tiff|ico)$/i.test(file.originalname);

  if (isImage) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed for articles!', 400));
  }
};

export const uploadArticleCoverMiddleware = multer({
  storage: articleStorage,
  fileFilter: articleFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
}).single('coverImage');

export const uploadArticleImagesMiddleware = multer({
  storage: articleStorage,
  fileFilter: articleFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB per file
  },
}).array('images', 25); // Max 25 images to accommodate both gallery and inline rich text images
