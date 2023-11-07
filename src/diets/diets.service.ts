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

  async create(createDietDto: CreateDietDto) {
    const existingDiet = await this.dietRepository.findOne({where: { id: 1, name: 'Baja en grasas'}});

    if(existingDiet){
      throw new ConflictException('Ya existe una dieta con ese Id y ese nombre');
    }

    const diet = this.dietRepository.create(createDietDto);
    return await this.dietRepository.save(diet);
  }

  async findAll() {
    const diets = await this.dietRepository.find();

    if(!diets || diets.length === 0){
      throw new NotFoundException('No se encontro ninguna dieta');
    }
    return diets;
  }

  async findOne(id: number) {  
    const diet = await this.dietRepository.findOne({where: {id} });

    if(!diet){
      throw new NotFoundException(`La dieta con el Id ${id} no existe`);
    }
    return diet;
  }

  async update(id: number, updateDietDto: UpdateDietDto) {
    
    const existingDiet = await this.dietRepository.findOne({ where: { id } });

    if (!existingDiet) {
        throw new NotFoundException(`La dieta con el Id ${id} no existe`);
    }

    const errors = await validate(updateDietDto);

    if (errors.length > 0) {
        throw new BadRequestException('La validación de los campos ha fallado');
    }

    const updateDiet = await this.dietRepository.findOne({ where: { id } });
    return updateDiet;
}

  async remove(id: number) {
    const existingDiet = await this.dietRepository.findOne({where: {id} });

    if(!existingDiet){
      throw new NotFoundException(`La dieta con el Id ${id} no existe`);
    }
  }
}
