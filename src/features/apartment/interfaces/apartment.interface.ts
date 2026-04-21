import type { ApartmentWithImages } from '@common/mappers/apartment.mapper';
import { CreateApartmentDTO } from '../dto/apartment.dto';

export interface IApartmentService {
  upsertApartment(data: CreateApartmentDTO): Promise<ApartmentWithImages>;
  getApartmentById(id: string): Promise<ApartmentWithImages>;
  getAllApartments(): Promise<ApartmentWithImages[]>;
  deleteApartment(id: string): Promise<void>;
}
