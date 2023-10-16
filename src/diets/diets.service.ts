import { Injectable } from '@nestjs/common';
import { CreateDietDto } from './dto/create-diet.dto';
import { UpdateDietDto } from './dto/update-diet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Diet } from './entities/diet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DietsService {
  constructor(
    @InjectRepository(Diet)
    private readonly dietRepository: Repository<Diet>,
  ){}

  async create(createDietDto: CreateDietDto) {
    const diet = this.dietRepository.create(createDietDto);
    return await this.dietRepository.save(diet);
  }

  async findAll() {
    return await this.dietRepository.find();
  }

  async findOne(id: number) {
    return await this.dietRepository.findOneBy({id});
  }

  async update(id: number, updateDietDto: UpdateDietDto) {
    return await this.dietRepository.update(id, updateDietDto);
  }

  async remove(id: number) {
    return this.dietRepository.delete(id);
  }
}

