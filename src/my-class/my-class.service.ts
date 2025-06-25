import { Injectable } from '@nestjs/common';
import { CreateMyClassDto } from './dto/create-my-class.dto';
import { UpdateMyClassDto } from './dto/update-my-class.dto';

@Injectable()
export class MyClassService {
  create(createMyClassDto: CreateMyClassDto) {
    console.log(createMyClassDto);
    return 'This action adds a new myClass';
  }

  findAll() {
    return `This action returns all myClass`;
  }

  findOne(id: number) {
    return `This action returns a #${id} myClass`;
  }

  update(id: number, updateMyClassDto: UpdateMyClassDto) {
    console.log(updateMyClassDto);
    return `This action updates a #${id} myClass`;
  }

  remove(id: number) {
    return `This action removes a #${id} myClass`;
  }
}
