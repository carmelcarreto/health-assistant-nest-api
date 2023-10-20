import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateDietDto {
    @IsInt()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;
}

