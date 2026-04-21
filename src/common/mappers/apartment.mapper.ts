import type {
  ApartmentResponseDTO,
  CreateApartmentDTO,
} from '@features/apartment/dto/apartment.dto';
import type { Prisma } from '@prisma/client';

export type ApartmentWithImages = Prisma.ApartmentGetPayload<{
  include: {
    images: true;
  };
}>;

export class ApartmentMapper {
  static toResponseDTO(apartment: ApartmentWithImages): ApartmentResponseDTO {
    return {
      id: apartment.id,
      title: apartment.title,
      description: apartment.description,
      address: apartment.address,
      price: apartment.price,
      district: apartment.district,
      apartmentType: apartment.apartmentType,
      area: apartment.area,
      roomsCount: apartment.roomsCount,
      hasBalcony: apartment.hasBalcony,
      hasLoggia: apartment.hasLoggia,
      floor: apartment.floor,
      houseType: apartment.houseType,
      minutesToMetro: apartment.minutesToMetro,
      nearestMetro: apartment.nearestMetro,
      images: apartment.images.map((image) => ({
        url: image.url,
        order: image.order,
      })),
      createdAt: apartment.createdAt,
      updatedAt: apartment.updatedAt,
    };
  }

  static toResponseDTOList(
    apartments: ApartmentWithImages[],
  ): ApartmentResponseDTO[] {
    return apartments.map((apartment) => this.toResponseDTO(apartment));
  }

  static toCreateInput(
    id: string,
    apartment: CreateApartmentDTO,
  ): Prisma.ApartmentCreateInput {
    const { images, ...apartmentData } = apartment;

    return {
      id,
      ...apartmentData,
      images: {
        create: images.map((image, index) => ({
          url: image.url,
          order: image.order ?? index,
        })),
      },
    };
  }

  static toUpdateInput(
    apartment: CreateApartmentDTO,
  ): Prisma.ApartmentUpdateInput {
    const { images, ...apartmentData } = apartment;

    return {
      ...apartmentData,
      images: {
        deleteMany: {},
        create: images.map((image, index) => ({
          url: image.url,
          order: image.order ?? index,
        })),
      },
    };
  }
}
