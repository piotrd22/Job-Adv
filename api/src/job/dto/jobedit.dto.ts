import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class JobEditDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  tech?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  position?: string;
}
