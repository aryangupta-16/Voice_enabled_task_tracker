import { z } from 'zod';

export const voiceParseValidationSchema = z.object({
  transcript: z.string().min(10, 'Transcript must be at least 10 characters'),
  timezone: z.string().optional(),
});

export const voiceCreateTaskValidationSchema = z.object({
  transcript: z.string().min(10),
  parsedData: z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(2000).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    dueDate: z.string().datetime().optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  }),
  timezone: z.string().optional(),
});
