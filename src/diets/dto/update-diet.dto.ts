import { IsInt, IsString, IsOptional } from "class-validator";

export class UpdateDietDto {
    @IsInt()
    @IsOptional()
    id: number;

    @IsString()
    @IsOptional()
    name?: string;
}
