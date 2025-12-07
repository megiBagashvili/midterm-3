import { Transform } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsString, Min, Max } from "class-validator";

export class UserQueryDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    age?: number;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    ageFrom?: number;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    ageTo?: number;

    @IsOptional()
    @IsIn(['m', 'f'])
    gender?: string;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @Min(1)
    page: number = 1;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @Max(100)
    limit: number = 10;
}