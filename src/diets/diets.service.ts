import { BadRequestException, Injectable, NotFoundException, ConflictException, InternalServerErrorException  } from '@nestjs/common';
import { CreateDietDto } from './dto/create-diet.dto';
import { UpdateDietDto } from './dto/update-diet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Diet } from './entities/diet.entity';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';

@Injectable()
export class DietsService {
  constructor(
    @InjectRepository(Diet)
    private readonly dietRepository: Repository<Diet>,
  ){}

  async create(createDietDto: CreateDietDto): Promise<Diet> {
    try {
      const existingDiet = await this.dietRepository.findOne({where: {name: createDietDto.name}});
      if(existingDiet){
        throw new ConflictException('There is already a diet with that name');
      }
      const diet = this.dietRepository.create(createDietDto);
      return await this.dietRepository.save(diet);
    } catch (error) {
      if(error instanceof ConflictException || error instanceof BadRequestException){
        throw error;
      }
      throw new InternalServerErrorException('Error when creating the diet', error.message);
    }
  }

  async findAll() {
    const diets = await this.dietRepository.find();

    if(!diets || diets.length === 0){
      throw new NotFoundException('No diet found');
    }
    return diets;
  }

  async findOne(id: number) {  
    const diet = await this.dietRepository.findOne({where: {id} });
    if(!diet){
      throw new NotFoundException(`Diet with Id ${id} does not exist`);
    }
    return diet;
  }

  async update(id: number, updateDietDto: UpdateDietDto) {
    const errors = await validate(updateDietDto);
    
    if(errors.length > 0){
      throw new BadRequestException(errors);
    }

    const existingDiet = await this.dietRepository.findOne({ where: {id} });
    
    if(!existingDiet){
      throw new NotFoundException('Diet with Id ${id} was not found');
    }
    existingDiet.name = updateDietDto.name;
    await this.dietRepository.save(existingDiet);

    return existingDiet;
  }

  async remove(id: number) {
    const existingDiet = await this.dietRepository.findOne({where: {id} });

    if(!existingDiet){
      throw new NotFoundException(`Diet with Id ${id} was not found`);
    }
    return await this.dietRepository.remove(existingDiet);
  }
}

