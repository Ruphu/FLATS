import { z } from 'zod';

export const LoginCredentialsSchema = z
  .object({
    email: z.email({ message: 'Unvalid URL' }),
    password: z
      .string({ message: 'Password must be a string' })
      .min(6, 'Password is too short')
      .max(100, 'Password is too long'),
  })
  .strict();

export type LoginCredentialsDto = z.infer<typeof LoginCredentialsSchema>;
