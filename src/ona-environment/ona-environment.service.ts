import { Injectable } from '@nestjs/common';
import { CreateOnaEnvironmentDto } from './dto/create-ona-environment.dto';
import { UpdateOnaEnvironmentDto } from './dto/update-ona-environment.dto';

@Injectable()
export class OnaEnvironmentService {
  create(createOnaEnvironmentDto: CreateOnaEnvironmentDto) {
    console.log(createOnaEnvironmentDto);
    return 'This action adds a new onaEnvironment';
  }

  findAll() {
    return `This action returns all onaEnvironment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} onaEnvironment`;
  }

  update(id: number, updateOnaEnvironmentDto: UpdateOnaEnvironmentDto) {
    console.log(updateOnaEnvironmentDto);
    return `This action updates a #${id} onaEnvironment`;
  }

  remove(id: number) {
    return `This action removes a #${id} onaEnvironment`;
  }
}
