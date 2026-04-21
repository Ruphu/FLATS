import { CreateApartmentDTO, ApartmentResponseDTO } from '../dto/apartment.dto';


export interface IApartmentService {
    create(data: CreateApartmentDTO): Promise<ApartmentResponseDTO>;

    upsertApartment(id: string, 
                    data: CreateApartmentDTO
                ): Promise<ApartmentResponseDTO>;

    getApartmentById(id: string): Promise<ApartmentResponseDTO>;
    deleteApartment(id: string): Promise<void>;

}