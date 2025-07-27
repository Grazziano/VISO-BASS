import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInteractionDto {
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  inter_obj_i: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  inter_obj_j: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  inter_start: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional() // caso inter_end possa ser nulo inicialmente
  inter_end: Date;

  @IsBoolean()
  @IsNotEmpty()
  inter_feedback: boolean;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  inter_service: number;
}
