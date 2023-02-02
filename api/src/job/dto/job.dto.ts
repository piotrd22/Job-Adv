import { IsNotEmpty, IsString } from 'class-validator';

export class JobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  tech: string;

  @IsString()
  @IsNotEmpty()
  position: string;
}
