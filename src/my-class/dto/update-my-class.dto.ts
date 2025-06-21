import { PartialType } from '@nestjs/mapped-types';
import { CreateMyClassDto } from './create-my-class.dto';

export class UpdateMyClassDto extends PartialType(CreateMyClassDto) {}
