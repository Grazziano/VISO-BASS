import {
  IsString,
  IsArray,
  IsNumber,
  IsMACAddress,
  IsNotEmpty,
} from 'class-validator';

export class CreateVisoObjectDto {
  @IsMACAddress()
  @IsNotEmpty()
  obj_networkMAC: string;

  @IsString()
  @IsNotEmpty()
  obj_name: string;

  @IsString()
  @IsNotEmpty()
  obj_owner: string;

  @IsString()
  @IsNotEmpty()
  obj_model: string;

  @IsString()
  @IsNotEmpty()
  obj_brand: string;

  // @IsString()
  // @IsNotEmpty()
  // obj_class: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  obj_function: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  obj_restriction: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  obj_limitation: string[];

  @IsNumber()
  @IsNotEmpty()
  obj_access: number;

  @IsNumber()
  @IsNotEmpty()
  obj_location: number;

  @IsNumber()
  @IsNotEmpty()
  obj_qualification: number;

  @IsNumber()
  @IsNotEmpty()
  obj_status: number;
}
