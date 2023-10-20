import { IsInt, IsString } from "class-validator";

export class CreateDietDto {
    @IsInt()
    id: number;

    @IsString()
    name: string;
}

