import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { CreateApartmentDTO, CreateApartmentSchema } from './dto/apartment.dto';
import { ZodExceptionPipe } from '@common/pipes';
import type { IApartmentService } from './interfaces/apartment.interface';
import { ApartmentMapper } from '@common/mappers';

@Controller('apartment')
export class ApartmentController {
  constructor(
    @Inject('IApartmentService')
    private readonly apartmentService: IApartmentService,
  ) {}

  @Put()
  async upsertApartment(
    @Body(new ZodExceptionPipe(CreateApartmentSchema))
    createApartmentDto: CreateApartmentDTO,
  ) {
    const result =
      await this.apartmentService.upsertApartment(createApartmentDto);
    return ApartmentMapper.toResponseDTO(result);
  }

  @Get()
  async getAllApartments() {
    const result = await this.apartmentService.getAllApartments();
    return ApartmentMapper.toResponseDTOList(result);
  }

  @Get(':id')
  async getApartmentById(@Param('id') id: string) {
    const result = await this.apartmentService.getApartmentById(id);
    return ApartmentMapper.toResponseDTO(result);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteApartment(@Param('id') id: string): Promise<void> {
    await this.apartmentService.deleteApartment(id);
  }
}
