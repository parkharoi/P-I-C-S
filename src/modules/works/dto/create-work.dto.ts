import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateWorkDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsString()
  description: string;

  @IsString()
  price: number;

  @IsOptional()
  @IsString()
  image_url?: string;
}
