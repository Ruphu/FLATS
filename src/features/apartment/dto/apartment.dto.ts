import { z } from 'zod';

export const MetroStationEnum = z.enum([
  'Автово',
  'Адмиралтейская',
  'Академическая',
  'Балтийская',
  'Бухарестская',
  'Василеостровская',
  'Владимирская',
  'Волковская',
  'Выборгская',
  'Горьковская',
  'Гостиный двор',
  'Гражданский проспект',
  'Девяткино',
  'Достоевская',
  'Дунайская',
  'Елизаровская',
  'Звёздная',
  'Звенигородская',
  'Кировский завод',
  'Комендантский проспект',
  'Крестовский остров',
  'Купчино',
  'Ладожская',
  'Ленинский проспект',
  'Лесная',
  'Лиговский проспект',
  'Ломоносовская',
  'Маяковская',
  'Международная',
  'Московская',
  'Московские ворота',
  'Нарвская',
  'Невский проспект',
  'Новокрестовская',
  'Обводный канал',
  'Обухово',
  'Озерки',
  'Парк Победы',
  'Парнас',
  'Петроградская',
  'Пионерская',
  'Площадь Александра Невского',
  'Площадь Восстания',
  'Площадь Ленина',
  'Площадь Мужества',
  'Политехническая',
  'Приморская',
  'Пролетарская',
  'Проспект Большевиков',
  'Проспект Ветеранов',
  'Проспект Просвещения',
  'Пушкинская',
  'Рыбацкое',
  'Садовая',
  'Сенная площадь',
  'Спасская',
  'Спортивная',
  'Старая Деревня',
  'Технологический институт',
  'Удельная',
  'Улица Дыбенко',
  'Фрунзенская',
  'Черная речка',
  'Чернышевская',
  'Чкаловская',
  'Электросила',
  'Юго-Западная',
]);

export const ImageSchema = z.object({
  url: z.url('Должен быть корректный URL'),
  order: z.number().int().min(0).default(0),
});

export const BaseApartmentSchema = z.object({
  title: z.string()
    .min(3, 'The name is too short (min. 3 characters)')
    .max(200, 'The name is too long (max. 200 characters)'),
  description: z.string()
    .optional()
    .nullable(),
  address: z.string()
    .min(5, 'The address is too short (min. 5 characters)')
    .max(500, 'The address is too long (max. 500 characters)'),
  price: z.number()
    .int('The price must be an integer')
    .min(0, 'The price cannot be negative'),
  district: z.string()
    .min(2, 'The district name is too short')
    .max(100, 'The district name is too long'),
  apartmentType: z.enum(['Новостройка', 'Вторичка'], {
      message: 'Apartment type must be either "Новостройка" or "Вторичка"',
    }),
  area: z.number()
    .min(1, 'The area must be at least 1 m²')
    .max(1000, 'The area cannot exceed 1000 m²'),
  roomsCount: z.number()
    .int('The number of rooms must be an integer')
    .min(0, 'The number of rooms cannot be negative (0 - studio)')
    .max(20, 'Too many rooms (max. 20)'),
  hasBalcony: z.boolean().default(false),
  hasLoggia: z.boolean().default(false),
  floor: z.number()
    .int('The floor must be an integer')
    .min(0, 'The floor cannot be negative')
    .max(200, 'The floor is too high'),
  houseType: z.enum(['Панельный', 'Кирпичный', 'Монолитный'], {
      message:
        'House type must be either "Панельный", "Кирпичный" or "Монолитный"',
    }),
  minutesToMetro: z.number()
    .int('Minutes to metro must be an integer')
    .min(0, 'Minutes to metro cannot be negative')
    .max(120, 'Minutes to metro cannot exceed 120'),
  nearestMetro: MetroStationEnum,
  images: z.array(ImageSchema).optional().default([]),
}).refine(
  (data) => {
    if (data.description && data.description.length > 5000) {
      return false;
    }
    return true;
  },
  {
    message: 'The description cannot exceed 5000 characters',
    path: ['description'],
  }
);

export const CreateApartmentSchema = BaseApartmentSchema;

export const CreateApartmentDTO = BaseApartmentSchema;

export const ApartmentResponseDTO = BaseApartmentSchema.extend({
  id: z.uuid(),      
  createdAt: z.date(),           
  updatedAt: z.date(),           
});

export type CreateApartmentDTO = z.infer<typeof CreateApartmentDTO>;
export type ApartmentResponseDTO = z.infer<typeof ApartmentResponseDTO>;

