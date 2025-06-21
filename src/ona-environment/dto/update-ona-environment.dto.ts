import { PartialType } from '@nestjs/mapped-types';
import { CreateOnaEnvironmentDto } from './create-ona-environment.dto';

export class UpdateOnaEnvironmentDto extends PartialType(
  CreateOnaEnvironmentDto,
) {}
