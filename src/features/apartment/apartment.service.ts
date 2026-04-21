import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApartmentDTO, ApartmentResponseDTO } from './dto/apartment.dto';
import { PrismaService } from '@infra/prisma/prisma.service';


@Injectable()
export class ApartmentService {
  constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateApartmentDTO): Promise<ApartmentResponseDTO> {
    const { images, ...apartmentData } = data;

    const result = await this.prisma.apartment.create({
      data: {
        ...apartmentData,
        images: {
          create: images?.map((img, index) => ({
            url: img.url,
            order: img.order ?? index,
          })) || [],
        },
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return result as unknown as ApartmentResponseDTO;
  }

  async upsertApartment(
    id: string,
    data: CreateApartmentDTO,
  ): Promise<ApartmentResponseDTO> {
    const { images, ...apartmentData } = data;

    const result = await this.prisma.apartment.upsert({
      where: { id },
      create: {
        id,
        ...apartmentData,
        images: {
          create: images?.map((img, index) => ({
            url: img.url,
            order: img.order ?? index,
          })) || [],
        },
      },
      update: {
        ...apartmentData,
        images: {
          // Удаляем старые и создаём новые
          deleteMany: {},
          create: images?.map((img, index) => ({
            url: img.url,
            order: img.order ?? index,
          })) || [],
        },
      },
      include:{
        images: true,  
      },
    });

    return result as ApartmentResponseDTO;
  }

  async getApartmentById(id: string): Promise<ApartmentResponseDTO> {
    const apartment = await this.prisma.apartment.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!apartment) {
      throw new NotFoundException('Apartment not found');
    }

    return apartment as ApartmentResponseDTO;
  }

  async deleteApartment(id: string): Promise<void> {
    await this.getApartmentById(id);

    await this.prisma.apartment.delete({
      where: { id },
    });
  }
}           



