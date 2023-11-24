import { Test, TestingModule } from '@nestjs/testing';
import { DietsController } from '../diets.controller';
import { DietsService } from '../diets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Diet } from '../entities/diet.entity';
import { CreateDietDto } from '../dto/create-diet.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateDietDto } from '../dto/update-diet.dto';

describe('DietsController', () => {
    let dietsController: DietsController;
    let dietsService: DietsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        controllers: [DietsController],
        providers: [DietsService, {
            provide: getRepositoryToken(Diet), 
            useValue: {},
          },
        ],
    }).compile();

        dietsController = module.get<DietsController>(DietsController);
        dietsService = module.get<DietsService>(DietsService);
    });

    it('CreateDiet: should create a diet', async () => {
        const createDietDto: CreateDietDto = {
            id: 1,
            name:'Baja en grasas'
        };
        jest.spyOn(dietsService, 'create').mockResolvedValue(createDietDto);
        const result = await dietsController.create(createDietDto);
        expect(result).toEqual(createDietDto);
    });

    it('FindAllDiets: should return all diets ', async () => {
        const mockDietData = [{ id: 1, name: 'Baja en grasas' }, { id: 2, name: 'Baja en gluten' }];
        jest.spyOn(dietsService, 'findAll').mockResolvedValue(mockDietData);
        const result = await dietsController.findAll();
        expect(result).toEqual(mockDietData);
    });

    it('FindOneDiet: should return a diet when a valid Id is provided', async () => {
        const mockDiet = {id: 1, name: 'Baja en sodio'};
        jest.spyOn(dietsService, 'findOne').mockResolvedValue(mockDiet);

        const result = await dietsController.findOne(1);
        expect(result).toEqual(mockDiet);
    });

    it('FindOneDiet: should throw BabRequestException when an invalid Id is provided', async () => {
        
        jest.spyOn(dietsService, 'findOne').mockResolvedValue(null);

        try {
            await dietsController.findOne(2);
        } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Diet with Id ${id} does not exist');
        }
    });

    it('FindOneDiet: should throw NotFoundException when a non-existing Id is provided', async () => {
        jest.spyOn(dietsService, 'findOne').mockResolvedValue(null);

        try {
            await dietsController.findOne(2);
        } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Diet with Id ${id} does not exist');
        }
    });

    it('UpdateDiet: should update a diet', async () => {
        const id = 1;
        const updateDietDto: UpdateDietDto = { id: 1, name: 'Baja en grasas'};
        const existingDiet = { id: 1, name: 'Baja en grasas'};
    
        jest.spyOn(dietsService, 'findOne').mockResolvedValue(existingDiet);
        jest.spyOn(dietsService, 'update').mockResolvedValue(updateDietDto);
    
        const result = await dietsController.update(id, updateDietDto);
    
        expect(result).toEqual({id: 1, name:'Baja en grasas'});
      });
});
  

