import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsBoolean()
  inStock: boolean;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}

export class ProductQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  inStockOnly?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: 'price' | 'name';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
