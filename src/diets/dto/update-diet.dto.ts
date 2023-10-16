import { IsInt, IsString, IsOptional } from "@nestjs/class-validator";

export class UpdateDietDto {
    @IsInt()
    @IsOptional()
    id?: number;

    @IsString()
    @IsOptional()
    name?: string;
}
