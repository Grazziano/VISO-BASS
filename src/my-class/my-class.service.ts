import { Injectable } from '@nestjs/common';
import { CreateMyClassDto } from './dto/create-my-class.dto';
import { UpdateMyClassDto } from './dto/update-my-class.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MyClass, MyClassDocument } from './schemas/my-class.schema';
import { Model } from 'mongoose';

@Injectable()
export class MyClassService {
  constructor(
    @InjectModel(MyClass.name) private myClassModel: Model<MyClassDocument>,
  ) {}

  create(createMyClassDto: CreateMyClassDto) {
    const newMyClass = new this.myClassModel(createMyClassDto);
    return newMyClass.save();
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
