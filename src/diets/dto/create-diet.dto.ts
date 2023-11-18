import {IsNotEmpty, IsString } from "class-validator";

export class CreateDietDto {
    id: number;

    @IsNotEmpty({message: 'The name field cannot be empty'})
    @IsString({message: 'The name field must be a character string'})
    name: string;
}

