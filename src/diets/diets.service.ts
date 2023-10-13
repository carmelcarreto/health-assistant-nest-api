import { Injectable } from '@nestjs/common';
import { CreateDietDto } from './dto/create-diet.dto';
import { UpdateDietDto } from './dto/update-diet.dto';

@Injectable()
export class DietsService {
  create(createDietDto: CreateDietDto) {
    return 'This action adds a new diet';
  }

  findAll() {
    return `This action returns all diets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} diet`;
  }

  update(id: number, updateDietDto: UpdateDietDto) {
    return `This action updates a #${id} diet`;
  }

  remove(id: number) {
    return `This action removes a #${id} diet`;
  }
}
