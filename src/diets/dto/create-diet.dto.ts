import { IsInt, IsString } from "@nestjs/class-validator";

export class CreateDietDto {
    @IsInt()
    id: number;

    @IsString()
    name: string;
}
