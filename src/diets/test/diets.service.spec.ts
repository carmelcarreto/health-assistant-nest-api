import { Test, TestingModule } from '@nestjs/testing';
import { Diet } from '../entities/diet.entity';
import { DietsService } from '../diets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateDietDto } from '../dto/create-diet.dto';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UpdateDietDto } from '../dto/update-diet.dto';

describe('DietsService', () => {
  let dietRepository: Repository<Diet>;
  let service: DietsService;
  let findMock: jest.Mock;
  let updateMock: jest.Mock;
  let deleteMock: jest.Mock;
  

  beforeEach(async () => {
    findMock = jest.fn();
    updateMock = jest.fn();
    deleteMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DietsService,
        {
          provide: getRepositoryToken(Diet), 
          useValue: {
              find: findMock,
              findOne: jest.fn(),
              create: jest.fn(),
              save: jest.fn(),
              update: updateMock,
              remove: deleteMock,
          },
        },
      ],
    }).compile();

    service = module.get<DietsService>(DietsService);
    dietRepository = module.get<Repository<Diet>>(getRepositoryToken(Diet));
  });

  it('FindAll Diets: should return an array of diets', async () => {
    const mockDiets = [{ id: 1, name: 'Baja en grasas' }, { id: 2, name: 'Baja en gluten' }];
    findMock.mockResolvedValue(mockDiets);

    const result = await service.findAll();
    expect(result).toEqual(mockDiets);
    expect(findMock).toHaveBeenCalled();
  });

  it('FindAll Diets: should throw NotFoundException when no diets are found', async () => {
    jest.spyOn(dietRepository, 'find').mockResolvedValue([]);
    await expect(service.findAll()).rejects.toThrowError(NotFoundException);
  });

  it('Create Diet: should create a new diet', async () => {
    const createDietDto: CreateDietDto = {id: 1, name: 'Baja en grasas'};
    
    jest.spyOn(dietRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(dietRepository, 'create').mockReturnValue(createDietDto);
    jest.spyOn(dietRepository, 'save').mockResolvedValue(createDietDto);

    const result = await service.create(createDietDto);
    expect(result).toEqual(createDietDto);
  });

  it('Create Diet: should throw ConflictException if diet with the same name already exists', async () => {
    const createDietDto: CreateDietDto = {id: 1, name: 'Baja en grasas'};

    jest.spyOn(dietRepository, 'findOne').mockResolvedValue({ id: 1, name: 'Baja en grasas' });
    await expect(service.create(createDietDto)).rejects.toThrowError(ConflictException);
  });

  it('Create Diet: should throw InternalServerErrorException for other errors', async () => {
    const createDietDto: CreateDietDto = {id: 1, name: 'Baja en sodio' };
    
    jest.spyOn(dietRepository, 'findOne').mockRejectedValue(new Error('Some error'));
    await expect(service.create(createDietDto)).rejects.toThrowError(InternalServerErrorException);
  });

  it('FindOne Diet: should return a diet by id', async () => {
    const dietId = 1;
    const mockDiet = { id: dietId, name: 'Baja en sodio' };
    jest.spyOn(dietRepository, 'findOne').mockResolvedValue(mockDiet);

    const result = await service.findOne(dietId);

    expect(result).toEqual(mockDiet);
  });

  it('FindOne Diet: should throw NotFoundException if diet with the given id does not exist', async () => {
    const dietId = 2;
    jest.spyOn(dietRepository, 'findOne').mockResolvedValue(null);

    await expect(service.findOne(dietId)).rejects.toThrowError(NotFoundException);
  });

  it('UpdateDiet: should update and return the updated diet', async () => {
    const dietId = 1;
    const updateDietDto: UpdateDietDto = {id: 1, name: 'Baja en gluten' };
    const existingDiet = { id: dietId, name: 'Baja en sodio' };

    jest.spyOn(dietRepository, 'findOne').mockResolvedValue(existingDiet);

    const result = await service.update(dietId, updateDietDto);

    expect(result).toEqual({ ...existingDiet, name: 'Baja en gluten' });
  });

  it('UpdateDiet: should throw BadRequestException for invalid fields in updateDietDto', async () => {
    const id = 1; 
    const updateDietDto = {id, name: 'Baja en grasas'};
    await expect(service.update(id, updateDietDto)).rejects.toThrowError(NotFoundException);
    expect(updateDietDto).toBeDefined();
	});

  it('UpdateDiet: should throw NotFoundException if diet with the given id does not exist', async () => {
    const dietId = 2;
    const updateDietDto: UpdateDietDto = {id: 1, name: 'Baja en carbohidratos' };

    jest.spyOn(dietRepository, 'findOne').mockResolvedValue(null);

    await expect(service.update(dietId, updateDietDto)).rejects.toThrowError(NotFoundException);
	});
	
  it('DeleteDiet: should remove and return the removed diet', async () => {
    const dietId = 1;
    const existingDiet = { id: dietId, name: 'Baja en grasas' };

    jest.spyOn(dietRepository, 'findOne').mockResolvedValue(existingDiet);
    jest.spyOn(dietRepository, 'remove').mockResolvedValue(existingDiet);

    const result = await service.remove(dietId);

    expect(result).toEqual(existingDiet);
  });

  it('DeleteDiet: should throw NotFoundException if diet with the given id does not exist', async () => {
    const dietId = 2;

    jest.spyOn(dietRepository, 'findOne').mockResolvedValue(null);

    await expect(service.remove(dietId)).rejects.toThrowError(NotFoundException);
  });
});
