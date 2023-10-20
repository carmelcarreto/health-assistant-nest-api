import { BadRequestException, Injectable, NotFoundException, ConflictException  } from '@nestjs/common';
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
    const existingDiet = await this.dietRepository.findOne({where: { id: createDietDto.id, name: createDietDto.name}});

    if(existingDiet){
      throw new ConflictException('Ya existe una dieta con ese Id y ese nombre');
    }

    if(createDietDto.name.length < 3){
      throw new BadRequestException('El nombre debe tener al menos 3 caracteres');
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
    if(!id){
      throw new BadRequestException('Proporcione el Id para buscar una dieta');
    }
    
    const diet = await this.dietRepository.findOne({where: {id} });

    if(!diet){
      throw new NotFoundException(`La dieta con el Id ${id} no existe`);
    }
    return diet;
  }

  async update(id: number, updateDietDto: UpdateDietDto) {
    const existingDiet = await this.dietRepository.findOne({ where: {id} });
    
    if(!existingDiet){
      throw new NotFoundException(`La dieta con el Id ${id} no existe`);
    }
    const errors = await validate(updateDietDto);
    
    if(errors.length > 0){
      throw new BadRequestException('Validacion fallida');
    }
    await this.dietRepository.update(id, updateDietDto);
    const updateDiet = await this.dietRepository.findOne({where: {id} });
    return updateDiet;
  }

  async remove(id: number) {
    const existingDiet = await this.dietRepository.findOne({where: {id} });

    if(!existingDiet){
      throw new NotFoundException(`La dieta con el Id ${id} no existe`);
    }
    await this.dietRepository.remove(existingDiet);
    return 'La dieta ha sido eliminada exitosamente';
  }
}
