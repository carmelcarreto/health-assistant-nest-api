import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, BadRequestException, InternalServerErrorException, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { DietsService } from './diets.service';
import { CreateDietDto } from './dto/create-diet.dto';
import { UpdateDietDto } from './dto/update-diet.dto';
import { Diet } from './entities/diet.entity';

@Controller('diets')
export class DietsController {
  constructor(private readonly dietsService: DietsService) {}

  /**
   * Crea una nueva dieta si tanto el campo "id" como el campo "name" son proporcionados.
   * @param createDietDto Datos de la nueva dieta.
   * @returns La nueva dieta creada.
   */
  @Post()
  async create(@Body(new ValidationPipe()) createDietDto: CreateDietDto) {
    
    if(!createDietDto.id || !createDietDto.name){
      throw new BadRequestException('El campo Id y name no pueden estar vacios');
    }
    return await this.dietsService.create(createDietDto);
  }

  @Get()
  async findAll(): Promise<Diet[]> {
    try{
      return await this.dietsService.findAll();
    }catch(error){
      throw new InternalServerErrorException('Error al buscar las dietas');
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {

    const diet = await this.dietsService.findOne(id);
    if(!diet){
      throw new NotFoundException('La dieta no se encontro con el Id proporcionado');
    }
    return diet;
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDietDto: UpdateDietDto) {
  
    const existingDiet = await this.dietsService.findOne(id);

    if(!existingDiet){
      throw new NotFoundException('La dieta no se encontro con el Id proporcionado');
    }
    return this.dietsService.update(id, updateDietDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
  
    const existingDiet = await this.dietsService.findOne(id);
    
    if(!existingDiet){
      throw new NotFoundException('La dieta no se encontro con el Id proporcionado');
    }
  }
}
