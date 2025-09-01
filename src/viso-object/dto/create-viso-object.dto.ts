import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsNumber,
  IsMACAddress,
  IsNotEmpty,
} from 'class-validator';

export class CreateVisoObjectDto {
  @ApiProperty({ description: 'MAC address of the object' })
  @IsMACAddress()
  @IsNotEmpty()
  obj_networkMAC: string;

  @ApiProperty({ description: 'Name of the object' })
  @IsString()
  @IsNotEmpty()
  obj_name: string;

  // @IsString()
  // @IsNotEmpty()
  // obj_owner: string;

  @ApiProperty({ description: 'Model of the object' })
  @IsString()
  @IsNotEmpty()
  obj_model: string;

  @ApiProperty({ description: 'Brand of the object' })
  @IsString()
  @IsNotEmpty()
  obj_brand: string;

  // @IsString()
  // @IsNotEmpty()
  // obj_class: string;

  @ApiProperty({ description: 'Functions of the object' })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  obj_function: string[];

  @ApiProperty({ description: 'Restrictions of the object' })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  obj_restriction: string[];

  @ApiProperty({ description: 'Limitations of the object' })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  obj_limitation: string[];

  @ApiProperty({ description: 'Access of the object' })
  @IsNumber()
  @IsNotEmpty()
  obj_access: number;

  @ApiProperty({ description: 'Location of the object' })
  @IsNumber()
  @IsNotEmpty()
  obj_location: number;

  @ApiProperty({ description: 'Qualification of the object' })
  @IsNumber()
  @IsNotEmpty()
  obj_qualification: number;

  @ApiProperty({ description: 'Status of the object' })
  @IsNumber()
  @IsNotEmpty()
  obj_status: number;
}
