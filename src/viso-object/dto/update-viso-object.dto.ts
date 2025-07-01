import { PartialType } from '@nestjs/mapped-types';
import { CreateVisoObjectDto } from './create-viso-object.dto';

export class UpdateVisoObjectDto extends PartialType(CreateVisoObjectDto) {}
