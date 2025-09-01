import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateVisoClassDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the class' })
  class_name: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ description: 'Functions of the class' })
  class_function: string[];

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ description: 'Objects of the class' })
  objects: string[];

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ description: 'Creation date of the class' })
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ description: 'Update date of the class' })
  updatedAt?: Date;
}
