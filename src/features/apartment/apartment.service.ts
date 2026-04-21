import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ApartmentMapper } from '@common/mappers';
import type { ApartmentWithImages } from '@common/mappers/apartment.mapper';
import { PrismaService } from '@infra/prisma/prisma.service';
import { CreateApartmentDTO } from './dto/apartment.dto';

@Injectable()
export class ApartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertApartment(
    data: CreateApartmentDTO,
  ): Promise<ApartmentWithImages> {
    const apartmentId = data.id ?? randomUUID();

    return await this.prisma.apartment.upsert({
      where: { id: apartmentId },
      create: ApartmentMapper.toCreateInput(apartmentId, data),
      update: ApartmentMapper.toUpdateInput(data),
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async getAllApartments(): Promise<ApartmentWithImages[]> {
    return await this.prisma.apartment.findMany({
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async getApartmentById(id: string): Promise<ApartmentWithImages> {
    const apartment = await this.prisma.apartment.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!apartment) {
      throw new NotFoundException('Apartment not found');
    }

    return apartment;
  }

  async deleteApartment(id: string): Promise<void> {
    await this.getApartmentById(id);

    await this.prisma.apartment.delete({
      where: { id },
    });
  }
}
