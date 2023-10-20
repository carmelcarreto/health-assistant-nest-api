import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateDietDto {
    @IsInt()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;
}
