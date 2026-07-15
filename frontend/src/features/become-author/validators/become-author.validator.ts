import { z } from 'zod';

export const becomeAuthorSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(30, 'Please provide at least 30 characters explaining why you want to join our editorial network.')
    .max(1000, 'Reason cannot exceed 1000 characters.'),
});

export type BecomeAuthorFormData = z.infer<typeof becomeAuthorSchema>;
