import { z } from 'zod';

export const RegistrationDataSchema = z
  .object({
    name: z
      .string({ message: 'Name must be a string' })
      .min(2, 'Name is too short')
      .max(100, 'Name is too long'),
    email: z.email({ message: 'Invalid email URL' }),
    password: z
      .string({ message: 'Password must be a string' })
      .min(6, 'Password is too short')
      .max(100, 'Password is too long'),
  })
  .strict();

export type RegistrationDataDto = z.infer<typeof RegistrationDataSchema>;
