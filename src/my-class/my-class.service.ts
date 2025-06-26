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

  async create(createMyClassDto: CreateMyClassDto): Promise<MyClass> {
    try {
      const newMyClass = new this.myClassModel(createMyClassDto);
      return newMyClass.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create MyClass: ${error.message}`);
      }
      throw new Error('Failed to create MyClass due to an unknown error');
    }
  }

  async findAll(): Promise<MyClass[]> {
    try {
      const myClasses = await this.myClassModel.find();
      return myClasses;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find MyClass: ${error.message}`);
      }
      throw new Error('Failed to find MyClass due to an unknown error');
    }
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
