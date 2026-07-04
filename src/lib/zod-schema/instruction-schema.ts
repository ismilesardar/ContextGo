import { z } from 'zod';

export const instructionSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(120, { message: 'Title is too long' }),
  description: z
    .string()
    .max(500, { message: 'Description is too long' })
    .optional(),
  content: z.string().min(1, { message: 'Content is required' })
});

export type InstructionFormValues = z.infer<typeof instructionSchema>;

export const instructionDetailsSchema = instructionSchema.pick({
  title: true,
  description: true
});

export type InstructionDetailsFormValues = z.infer<
  typeof instructionDetailsSchema
>;

export const instructionStatusSchema = z.object({
  status: z.enum(['draft', 'published'])
});

export type InstructionStatusValues = z.infer<typeof instructionStatusSchema>;
