import { Injectable } from '@nestjs/common';
import { CreateMyObjectDto } from './dto/create-my-object.dto';
import { UpdateMyObjectDto } from './dto/update-my-object.dto';

@Injectable()
export class MyObjectService {
  create(createMyObjectDto: CreateMyObjectDto) {
    return 'This action adds a new myObject';
  }

  findAll() {
    return `This action returns all myObject`;
  }

  findOne(id: number) {
    return `This action returns a #${id} myObject`;
  }

  update(id: number, updateMyObjectDto: UpdateMyObjectDto) {
    return `This action updates a #${id} myObject`;
  }

  remove(id: number) {
    return `This action removes a #${id} myObject`;
  }
}
