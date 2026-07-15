import { z } from 'zod';

const optionalUrl = z
  .string()
  .trim()
  .refine((val) => !val || val.startsWith('http://') || val.startsWith('https://'), {
    message: 'Must be a valid URL starting with http:// or https://',
  })
  .optional()
  .or(z.literal(''));

export const profileUpdateSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens',
    ),
  bio: z
    .string()
    .max(300, 'Bio cannot exceed 300 characters')
    .optional()
    .or(z.literal('')),
  twitter: optionalUrl,
  github: optionalUrl,
  linkedin: optionalUrl,
  website: optionalUrl,
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
