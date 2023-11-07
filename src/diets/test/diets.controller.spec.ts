import { Test, TestingModule } from '@nestjs/testing';
import { DietsController } from '../diets.controller';
import { DietsService } from '../diets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Diet } from '../entities/diet.entity';
import { CreateDietDto } from '../dto/create-diet.dto';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

    it('CreateDiet: should handle empty id and name', async () => {
        const createDietDto: CreateDietDto = { id: 1, name: '' };
        try{
            await dietsController.create(createDietDto);
            fail('La funcion create deberia haber lanzado una excepcion');
        }catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('El campo Id y name no pueden estar vacios');
        }
    });

    it('FindAllDiets: should return all diets ', async () => {
        const mockDietData = [{ id: 1, name: 'Baja en grasas' }, { id: 2, name: 'Baja en gluten' }];
        jest.spyOn(dietsService, 'findAll').mockResolvedValue(mockDietData);
        const result = await dietsController.findAll();
        expect(result).toEqual(mockDietData);
    });

    it('FindAllDiets: should handle errors and throw an exception on error', async () => {
        jest.spyOn(dietsService, 'findAll').mockRejectedValue(new Error('Simulated error'));
        try {
            await dietsController.findAll();
        } catch (error) {
            expect(error).toBeInstanceOf(InternalServerErrorException);
            expect(error.message).toBe('Error al buscar las dietas');
        }
    });

    it('FindOneDiet: should return a diet when a valid Id is provided', async () => {
        const mockDiet = {id: 1, name: 'Baja en Sodio'};
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
        expect(error.message).toEqual('La dieta no se encontro con el Id proporcionado');
        }
    });

    it('FindOneDiet: should throw NotFoundException when a non-existing Id is provided', async () => {
        jest.spyOn(dietsService, 'findOne').mockResolvedValue(null);

        try {
            await dietsController.findOne(2);
        } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('La dieta no se encontro con el Id proporcionado');
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
    
      it('UpdateDiet: should throw BadRequestException for invalid ID', async () => {
        const id = 3;
        const updateDietDto: UpdateDietDto = { id: 1, name: 'Baja en grasas'};

        jest.spyOn(dietsService, 'findOne').mockResolvedValue(null);
        
        try {
          await dietsController.update(id, updateDietDto);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    
      it('UpdateDiet: should throw NotFoundException for non-existent diet', async () => {
        const id = 1; // Provide an ID for a non-existent diet
        const updateDietDto: UpdateDietDto = { id: 1, name: 'Baja en grasas'};
    
        jest.spyOn(dietsService, 'findOne').mockResolvedValue(null);
    
        try {
          await dietsController.update(id, updateDietDto);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
});
  

