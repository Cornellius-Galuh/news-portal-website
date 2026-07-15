import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Category name must be at least 2 characters long' })
    .max(100, { message: 'Category name must not exceed 100 characters' })
    .trim(),
  description: z
    .string()
    .max(500, { message: 'Description must not exceed 500 characters' })
    .trim()
    .optional()
    .or(z.literal('')),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
