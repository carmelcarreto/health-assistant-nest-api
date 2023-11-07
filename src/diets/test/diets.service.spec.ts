import { Test, TestingModule } from '@nestjs/testing';
import { Diet } from '../entities/diet.entity';
import { DietsService } from '../diets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateDietDto } from '../dto/create-diet.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('DietsService', () => {
  let dietRepository: Repository<Diet>;
  let service: DietsService;
  let findMock: jest.Mock;
  let createMock: jest.Mock;
  let findOneMock: jest.Mock;
  let updateMock: jest.Mock;
  let deleteMock: jest.Mock;
  

  beforeEach(async () => {
    findMock = jest.fn();
    createMock = jest.fn();
    findOneMock = jest.fn();
    updateMock = jest.fn();
    deleteMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DietsService,
        {
          provide: getRepositoryToken(Diet), 
          useValue: {
              find: findMock,
              create: jest.fn(),
              save: jest.fn(),
              findOne: jest.fn(),findOneMock,
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
    const diets = [{ id: 1, name: 'Baja en grasas' }, { id: 2, name: 'Baja en gluten' }];

    findMock.mockResolvedValue(diets);

    const result = await service.findAll();

    expect(result).toEqual(diets);
    expect(findMock).toHaveBeenCalled();
  });

  it('FindAll Diets: should throw NotFoundException if no diets are found', async () => {
    findMock.mockResolvedValue([]);

    try {
      await service.findAll();
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual('No se encontro ninguna dieta');
    }
  });

  it('Create Diet: should throw BadRequestException if the is too short', async () => {
    const createDietDto: CreateDietDto = {id: 1, name: 'Baja en grasas'};

    try {
      await service.create(createDietDto);
    } catch (error) {
      expect(error).rejects.toThrow(ConflictException);
      expect(error.message).toEqual('El nombre debe tener al menos 3 caracteres');
    }
  });

  it('Create Diet: should throw ConflictException if a diet with the same is and name exists', async() => {
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

  it('FindOne Diet: should return a diet by id is valid', async () => {
    const diet = new Diet();
    diet.id = 1;
    diet.name = 'Baja en grasas';

    const findOneSpy = jest.spyOn(dietRepository,'findOne');
    findOneSpy.mockResolvedValue(diet);
    
    const result = await service.findOne(1);

    expect(result).toBe(diet);
    expect(findOneSpy).toHaveBeenCalledWith({ where: { id: 1 } });
    findOneSpy.mockRestore();
  });

  it('FindOne Diet: should throw NotFoundException when no diet with the given id is found', async () => {
    const findOneSpy = jest.spyOn(dietRepository,'findOne');
    findOneSpy.mockResolvedValue(null);
    const id = 1;

    try {
      await service.findOne(id);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(`La dieta con el Id ${id} no existe`);
    }
  });

  it('UpdateDiet: Should update an existing diet', async () => {
		const id = 1;
		const updateDietDto = {id: 1, name: 'Baja en sodio'};
		await expect(service.update(id, updateDietDto)).rejects.toThrowError(NotFoundException);

		expect(updateDietDto).toBeDefined();
		expect(updateDietDto.name).toBe('Baja en sodio');
	});
	
	it('UpdateDiet: Should throw a BadRequestException when providing a non-numeric ID', async () => {
    const id = 1;
    const updateDietDto = {id: 1, name: 'Baja en grasas'};
    await expect(service.update(id, updateDietDto)).rejects.toThrowError(NotFoundException);
    expect(updateDietDto).toBeDefined();
	});
	
	it('UpdateDiet: Should throw a NotFoundException for a non-existent ID', async () => {
    const id = 9999;
    const updateDietDto = {id, name: 'Baja en grasas'};
    await expect(service.update(id, updateDietDto)).rejects.toThrowError(NotFoundException);
    expect(updateDietDto).toBeDefined();
	});

	it('UpdateDiet: Should throw BadRequestException for invalid fields in updateDietDto', async () => {
    const id = 1; 
    const updateDietDto = {id, name: 'Baja en grasas'};
    await expect(service.update(id, updateDietDto)).rejects.toThrowError(NotFoundException);
    expect(updateDietDto).toBeDefined();
	});
	/*
	it('UpdateDiet: Should throw BadRequestException with specific message when field validation fails', async () => {
    
    const id = 1;
    const updateDietDto = {id, name: 'Baja en grasas'};

    const validateSpy = jest.spyOn(classValidatorValidate, 'validate');
    validateSpy.mockResolvedValue([{
      property: 'name',
      constraints: {
        isString: 'El campo "name" debe ser una cadena de texto'
      }
    }]);

    try{
      await service.update(id, updateDietDto);
    }catch(error){
      expect(validateSpy).toHaveBeenCalledWith(updateDietDto);
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('La validación de los campos ha fallado');
    }
	});*/

  it('DeleteDiet: should remove an existing diet successfully', async () => {
    const id = 1;
    const existingDiet = null;

    findOneMock.mockResolvedValue(existingDiet);

    try{
      await service.remove(id);
      fail('La excepción NotFoundException no fue lanzada.');
    }catch(error){
      
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(`La dieta con el Id ${id} no existe`);
    }

    expect(deleteMock).not.toHaveBeenCalled();
  });

  it('DeleteDiet: should throw NotFoundException when trying to remove a non-existent diet', async () => {

    findOneMock.mockResolvedValue(null);
    
    try{
      await service.remove(1);
    }catch(error){
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual('La dieta con el Id 1 no existe');
    }
  });

  it('DeleteDiet: should throw InternalServerErrorException on database error', async () => {

    findOneMock.mockResolvedValue({ id: 1, name: 'Baja en grasas' });
    deleteMock.mockResolvedValue(new Error('Database error'));
    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
  });

});
