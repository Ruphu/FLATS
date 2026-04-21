import { Controller, 
  Get, 
  Body, 
  Param, 
  Delete, 
  Put, 
  HttpCode, 
  HttpStatus, 
  Post,
  Inject} from '@nestjs/common';
import { CreateApartmentDTO, CreateApartmentSchema } from './dto/apartment.dto';
import { ZodExceptionPipe } from '@common/pipes';
import type { IApartmentService } from './interfaces/apartment.interface';


@Controller('apartment')
export class ApartmentController {
  constructor(
      @Inject('IApartmentService') private readonly apartmentService: IApartmentService,) {}

  @Post()
  async create(
    @Body(new ZodExceptionPipe(CreateApartmentSchema)) data: CreateApartmentDTO,
  ) {
    return await this.apartmentService.create(data);
  }

  @Put(':id')
  async upsertApartment(
    @Param('id') id: string,
    @Body(new ZodExceptionPipe(CreateApartmentSchema)) createApartmentDto: CreateApartmentDTO,
  ) {
    return await this.apartmentService.upsertApartment(id, createApartmentDto);
  }

  @Get(':id')
  async getApartmentById(@Param('id') id: string) {
    return await this.apartmentService.getApartmentById(id);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteApartment(@Param('id') id: string): Promise<void> {
    await this.apartmentService.deleteApartment(id);
  }
}
