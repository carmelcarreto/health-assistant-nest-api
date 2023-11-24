import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseIntPipe, NotFoundException, BadRequestException } from '@nestjs/common';
import { DietsService } from './diets.service';
import { CreateDietDto } from './dto/create-diet.dto';
import { UpdateDietDto } from './dto/update-diet.dto';
import { validate } from 'class-validator';

@Controller('diets')
export class DietsController {
  constructor(private readonly dietsService: DietsService) {}

  @Post()
  async create(@Body(new ValidationPipe({errorHttpStatusCode: 422})) createDietDto: CreateDietDto) {
    return await this.dietsService.create(createDietDto);
  }

  @Get()
  async findAll() {
      return await this.dietsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const diet = await this.dietsService.findOne(id);
    return diet;
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDietDto: UpdateDietDto) {
    return await this.dietsService.update(id, updateDietDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.dietsService.remove(id);
  }
}
