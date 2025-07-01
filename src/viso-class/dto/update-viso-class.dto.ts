import { PartialType } from '@nestjs/mapped-types';
import { CreateVisoClassDto } from './create-viso-class.dto';

export class UpdateVisoClassDto extends PartialType(CreateVisoClassDto) {}
