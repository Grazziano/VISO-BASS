import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMyClassDto } from './dto/create-my-class.dto';
import { UpdateMyClassDto } from './dto/update-my-class.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MyClass, MyClassDocument } from './schemas/my-class.schema';
import { isValidObjectId, Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { MyClassResponseDto } from './dto/my-class-response.dto';

@Injectable()
export class MyClassService {
  constructor(
    @InjectModel(MyClass.name) private myClassModel: Model<MyClassDocument>,
  ) {}

  async create(
    createMyClassDto: CreateMyClassDto,
  ): Promise<MyClassResponseDto> {
    try {
      const newMyClass = new this.myClassModel(createMyClassDto);
      const savedMyClass = await newMyClass.save();
      return plainToInstance(MyClassResponseDto, savedMyClass.toJSON());
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create MyClass: ${error.message}`);
      }
      throw new Error('Failed to create MyClass due to an unknown error');
    }
  }

  async findAll(): Promise<MyClassResponseDto[]> {
    try {
      const myClasses = await this.myClassModel.find().lean().exec();
      return plainToInstance(MyClassResponseDto, myClasses);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find MyClass: ${error.message}`);
      }
      throw new Error('Failed to find MyClass due to an unknown error');
    }
  }

  async findOne(id: string): Promise<MyClassResponseDto> {
    const isValid = isValidObjectId(id);

    if (!isValid) {
      throw new NotFoundException(`MyClass with id ${id} not found`);
    }

    try {
      const myClass = await this.myClassModel
        .findById({ _id: id })
        .lean()
        .exec();

      if (!myClass) {
        throw new NotFoundException(`MyClass with id ${id} not found 1223`);
      }

      return plainToInstance(MyClassResponseDto, myClass);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find MyClass: ${error.message}`);
      }
      throw new Error('Failed to find MyClass due to an unknown error');
    }
  }

  update(id: number, updateMyClassDto: UpdateMyClassDto) {
    console.log(updateMyClassDto);
    return `This action updates a #${id} myClass`;
  }

  remove(id: number) {
    return `This action removes a #${id} myClass`;
  }
}
