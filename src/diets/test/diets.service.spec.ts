import { Test, TestingModule } from '@nestjs/testing';
import { Diet } from '../entities/diet.entity';
import { DietsService } from '../diets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateDietDto } from '../dto/create-diet.dto';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateDietDto } from '../dto/update-diet.dto';

describe('Find All diets', () => {
  let service: DietsService;
  let findMock: jest.Mock;

  beforeEach(async () => {
    findMock = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DietsService,
        {
          provide: getRepositoryToken(Diet),
          useValue: {
            find: findMock,
          },
        },
      ],
    }).compile();

    service = module.get<DietsService>(DietsService);
  });

  it('should return an array of diets', async () => {
    const diets = [{ id: 1, name: 'Baja en grasas' }, { id: 2, name: 'Baja en gluten' }];

    findMock.mockResolvedValue(diets);

    const result = await service.findAll();

    expect(result).toEqual(diets);
    expect(findMock).toHaveBeenCalled();
  });

  it('should throw NotFoundException if no diets are found', async () => {
    findMock.mockResolvedValue([]);

    try {
      await service.findAll();
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual('No se encontro ninguna dieta');
    }
  });
});

describe('Create diet', () => {
  let service: DietsService;
  let createMock: jest.Mock;

  beforeEach(async () => {
    createMock = jest.fn();
     const module: TestingModule = await Test.createTestingModule({
      providers: [ 
        DietsService,
        {
          provide: getRepositoryToken(Diet),
          useValue: {
            create: createMock,
            save: jest.fn(),
            findOne: jest.fn(),
          }
        },
      ],
    }).compile();

    service = module.get<DietsService>(DietsService);
  });

  it('should throw BadRequestException if the is too short', async () => {
    const createDietDto: CreateDietDto = {id: 1, name: 'Baja en grasas'};

    try {
      await service.create(createDietDto);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('El nombre debe tener al menos 3 caracteres');
    }
  });

  it('should throw ConflictException if a diet with the same is and name exists', async() => {
    const createDietDto: CreateDietDto = {id: 1, name: 'Baja en grasas'};
    const existingDiet = {id: 1, name: 'Baja en grasas'};

    createMock.mockReturnValue(createDietDto);
    service['dietRepository'].findOne = jest.fn().mockResolvedValue(existingDiet);

    try {
      await service.create(createDietDto);
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException);
      expect(error.message).toEqual('Ya existe una dieta con ese Id y ese nombre');
    }
  });
});

describe('FindOne diet by id', () => {
  let service: DietsService;
  let findOneMock: jest.Mock;

  beforeEach(async () => {
    findOneMock = jest.fn();
     const module: TestingModule = await Test.createTestingModule({
      providers: [ 
        DietsService,
        {
          provide: getRepositoryToken(Diet),
          useValue: {
            create: jest.fn(),
            findOne: findOneMock,
          }
        },
      ],
    }).compile();

    service = module.get<DietsService>(DietsService);
  });

  it('should return a diet by id', async () => {
    const diet = new Diet();
    diet.id = 1;
    diet.name = 'Baja en grasas';

    findOneMock.mockResolvedValue(diet);

    const result = await service.findOne(1);
    
    expect(result).toBe(diet);
    expect(findOneMock).toHaveBeenCalledWith({where: { id: 1 } });
  });
});

describe('Update diet', () => {
  let service: DietsService;
  let findOneMock: jest.Mock;
  let updateMock: jest.Mock;

  beforeEach(async () => {
    service: DietsService;
    findOneMock = jest.fn();
    updateMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DietsService,
        {
          provide: getRepositoryToken(Diet),
          useValue: {
            findOne: findOneMock,
            update: updateMock,
          },
        },
      ],
    }).compile();

    service = module.get<DietsService>(DietsService);
  });

  it('should update a diet', async () => {
    const id = 1;
    const updatedDiet = new Diet();
    updatedDiet.id = id;
    updatedDiet.name = 'Baja en grasas';

    findOneMock.mockResolvedValue(updatedDiet);
    updateMock.mockResolvedValue({ affected: 1 });

    const result = await service.update(id, updatedDiet);

    expect(result).toEqual(updatedDiet);
  });

  it('should throw NotFoundException if diet does not exist', async () => {
    const id = 1;
    const updateDietDto = new UpdateDietDto();
    updateDietDto.name = 'Baja en grasas';

    findOneMock.mockResolvedValue(null);

    expect(async () => {
      await service.update(id, updateDietDto);
    }).toThrowError(NotFoundException);
  });

  it('should throw BadRequestException if validation fails', async () => {
    const id = 1;
    const updateDietDto = new UpdateDietDto();
    updateDietDto.name = 'Baja en grasas';

    const existingDiet = new Diet();
    existingDiet.id = id;
    existingDiet.name = 'Baja en grasas';

    findOneMock.mockResolvedValue(existingDiet);

    expect(async () => { await service.update(id, updateDietDto);
    })
    .toThrowError(BadRequestException);
  });
});

describe('Remove diet by id', () => {
  let service: DietsService;
  let findOneMock: jest.Mock;
  let deleteMock: jest.Mock;

  beforeEach(async () => {
    findOneMock = jest.fn();
    deleteMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DietsService,
        {
          provide: getRepositoryToken(Diet),
          useValue: {
            findOne: findOneMock,
            remove: deleteMock,
          },
        },
      ],
    }).compile();

    service = module.get<DietsService>(DietsService);
  });

  it('should delete a diet by id', async () => {

    const id = 1;
    const existingDiet = new Diet();
    existingDiet.id = id;
    existingDiet.name = 'Baja en grasas';
    
    findOneMock.mockResolvedValue(existingDiet);
    deleteMock.mockResolvedValue({ raw: [], affected: 1 });

    const result = await service.remove(id);

    expect(result).toEqual('La dieta ha sido eliminada exitosamente');
    expect(deleteMock).toHaveBeenCalledWith({id: 1, name: 'Baja en grasas'});
  });

  it('should throw NotFoundException if diet does not exist', async () => {
    const id = 1;

    findOneMock.mockResolvedValue(null);

    try {
      await service.remove(id);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual(`La dieta con el Id ${id} no existe`);
    }
  });
});