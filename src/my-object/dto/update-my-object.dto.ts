import { PartialType } from '@nestjs/mapped-types';
import { CreateMyObjectDto } from './create-my-object.dto';

export class UpdateMyObjectDto extends PartialType(CreateMyObjectDto) {}
