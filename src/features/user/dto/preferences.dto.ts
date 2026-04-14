import { z } from 'zod';

export const BasePreferencesSchema = z
  .object({
    budgetMin: z
      .number({ message: 'Budget min must be a number' })
      .min(0, 'Budget min must be at least 0'),
    budgetMax: z
      .number({ message: 'Budget max must be a number' })
      .min(0, 'Budget max must be at least 0'),
    preferredDistrict: z
      .string({ message: 'Preferred district must be a string' })
      .min(2, 'The name of the area is too short')
      .max(100, 'The name of the area is too long'),
    apartmentType: z
      .enum(['Новостройка', 'Вторичка'], 
      { message: 'Apartment type must be either "Новостройка" or "Вторичка"' }),
    areaMin: z
      .number({ message: 'Area min must be a number' })
      .min(0, 'Area min must be at least 0'),
    areaMax: z
      .number({ message: 'Area max must be a number' })
      .min(0, 'Area max must be at least 0'),
    roomsCount: z.number({ message: 'Rooms count min must be a number' }),  // 0 комнат - студия, поэтому минимальное количество комнат может быть 0
    hasBalcony: z.boolean({ message: 'Поле должно быть true/false' }),
    hasLoggia: z.boolean({ message: 'Поле должно быть true/false' }),
    floorMin: z
      .number({ message: 'Floor min must be a number' })
      .int({ message: 'Floor min must be an integer' })
      .min(0, 'Floor min must be at least 0'),
    floorMax: z
      .number({ message: 'Floor max must be a number' })
      .int({ message: 'Floor max must be an integer' })
      .min(1, 'Floor max must be at least 1'),  
    houseType: z
      .enum(['Панельный', 'Кирпичный', 'Монолитный'], 
      { message: 'House type must be either "Панельный", "Кирпичный" or "Монолитный"' }),
    minutesToMetro: z
      .number({ message: 'Minutes to metro must be a number' })
      .int({ message: 'Minutes to metro must be an integer' })
      .min(0, 'Minutes to metro must be at least 0')
      .max(120, 'Minutes to metro must be at most 120'),
  })
  .strict();

export const CreatePreferencesSchema = BasePreferencesSchema
  .refine(data => data.budgetMin <= data.budgetMax, {
    message: 'The minimum budget cannot be more than the maximum',
    path: ['budgetMin'],
  })
  .refine(data => data.areaMin <= data.areaMax, {
    message: 'The minimum area cannot be more than the maximum',
    path: ['areaMin'],
  })
  .refine(data => data.floorMin <= data.floorMax, {
    message: 'The minimum floor cannot be more than the maximum',
    path: ['floorMin'],
  });

  export const UpdatePreferencesSchema = BasePreferencesSchema.partial()
  .refine(data => {
    // Проверяем только если оба поля присутствуют в запросе
    if (data.budgetMin !== undefined && data.budgetMax !== undefined) {
      return data.budgetMin <= data.budgetMax;
    }
    return true;
  }, {
    message: 'The minimum budget cannot be more than the maximum',
    path: ['budgetMin'],
  })
  .refine(data => {
    if (data.areaMin !== undefined && data.areaMax !== undefined) {
      return data.areaMin <= data.areaMax;
    }
    return true;
  }, {
    message: 'The minimum area cannot be more than the maximum',
    path: ['areaMin'],
  })
  .refine(data => {
    if (data.floorMin !== undefined && data.floorMax !== undefined) {
      return data.floorMin <= data.floorMax;
    }
    return true;
  }, {
    message: 'The minimum floor cannot be more than the maximum',
    path: ['floorMin'],
  });

export type CreatePreferencesDTO = z.infer<typeof CreatePreferencesSchema>;

export type UpdatePreferencesDTO = z.infer<typeof UpdatePreferencesSchema>;

export const PreferenceResponseSchema = CreatePreferencesSchema.extend({
  id: z.uuid(),
  userId: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PreferenceResponseDTO = z.infer<typeof PreferenceResponseSchema>;

