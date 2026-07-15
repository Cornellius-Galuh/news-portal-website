import mongoose, { Schema } from 'mongoose';
import { IUserDocument } from '../interfaces/user.interface';
import { UserRole } from '../types/enums';

const socialLinkSchema = new Schema(
  {
    platform: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const userSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username must be at most 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio must be at most 500 characters'],
      default: null,
    },
    socialLinks: {
      type: [socialLinkSchema],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: 'joinedAt',
      updatedAt: 'updatedAt',
    },
  },
);

// Indexes
userSchema.index({ role: 1 });

// Exclude soft-deleted users from default queries
userSchema.pre('find', function () {
  this.where({ isDeleted: false });
});

userSchema.pre('findOne', function () {
  this.where({ isDeleted: false });
});

const User = mongoose.model<IUserDocument>('User', userSchema);

export default User;
