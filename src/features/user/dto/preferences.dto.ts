import { z } from 'zod';

export const CreatePreferencesSchema = z
  .object({
    area: z
      .number({ message: 'Area must be a number' })
      .max(10000, 'Area is too large'),
    typeFlat: z.enum(['Новостройка', 'Вторичка'], {
      message: 'TypeFlat must be either "Новостройка" or "Вторичка"',
    }),
  })
  .strict();

export type CreatePreferencesDTO = z.infer<typeof CreatePreferencesSchema>;
