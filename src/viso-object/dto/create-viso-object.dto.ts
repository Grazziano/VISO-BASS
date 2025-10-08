import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsNumber,
  IsMACAddress,
  IsNotEmpty,
} from 'class-validator';

export class CreateVisoObjectDto {
  @ApiProperty({
    description:
      'Endereço MAC único do dispositivo IoT (formato XX:XX:XX:XX:XX:XX)',
    example: '00:1B:44:11:3A:B7',
    type: 'string',
    pattern: '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$',
  })
  @IsMACAddress()
  @IsNotEmpty()
  obj_networkMAC: string;

  @ApiProperty({
    description: 'Nome identificador do objeto VISO no sistema',
    example: 'Sensor de Temperatura Sala 101',
    type: 'string',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  obj_name: string;

  // @IsString()
  // @IsNotEmpty()
  // obj_owner: string;

  @ApiProperty({
    description: 'Modelo específico do dispositivo IoT',
    example: 'DHT22-Pro',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  obj_model: string;

  @ApiProperty({
    description: 'Marca ou fabricante do dispositivo',
    example: 'Adafruit',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  obj_brand: string;

  // @IsString()
  // @IsNotEmpty()
  // obj_class: string;

  @ApiProperty({
    description: 'Lista de funcionalidades que o objeto pode executar',
    example: [
      'temperature_sensing',
      'humidity_monitoring',
      'data_transmission',
    ],
    type: 'array',
    items: { type: 'string' },
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  obj_function: string[];

  @ApiProperty({
    description: 'Restrições de uso ou operação do objeto',
    example: ['indoor_only', 'temperature_range_-10_50'],
    type: 'array',
    items: { type: 'string' },
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  obj_restriction: string[];

  @ApiProperty({
    description: 'Limitações técnicas ou físicas do dispositivo',
    example: ['battery_powered', 'wifi_required', 'max_range_100m'],
    type: 'array',
    items: { type: 'string' },
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  obj_limitation: string[];

  @ApiProperty({
    description: 'Nível de acesso ou permissão do objeto (0-10)',
    example: 5,
    type: 'number',
    minimum: 0,
    maximum: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  obj_access: number;

  @ApiProperty({
    description: 'Código de localização física do objeto',
    example: 101,
    type: 'number',
  })
  @IsNumber()
  @IsNotEmpty()
  obj_location: number;

  @ApiProperty({
    description: 'Qualificação ou rating do objeto (0-100)',
    example: 85,
    type: 'number',
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  obj_qualification: number;

  @ApiProperty({
    description:
      'Status operacional do objeto (0=inativo, 1=ativo, 2=manutenção)',
    example: 1,
    type: 'number',
    enum: [0, 1, 2],
  })
  @IsNumber()
  @IsNotEmpty()
  obj_status: number;
}
