import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VisoClass, VisoClassDocument } from './schemas/viso-class.schema';
import { isValidObjectId, Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { CreateVisoClassDto } from './dto/create-viso-class.dto';
import { VisoClassResponseDto } from './dto/viso-class-response.dto';
import { UpdateVisoClassDto } from './dto/update-viso-class.dto';

@Injectable()
export class VisoClassService {
  constructor(
    @InjectModel(VisoClass.name)
    private visoClassModel: Model<VisoClassDocument>,
  ) {}

  async create(
    createVisoClassDto: CreateVisoClassDto,
  ): Promise<VisoClassResponseDto> {
    try {
      const newMyClass = new this.visoClassModel(createVisoClassDto);
      const savedMyClass = await newMyClass.save();
      return plainToInstance(VisoClassResponseDto, savedMyClass.toJSON());
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create MyClass: ${error.message}`);
      }
      throw new Error('Failed to create MyClass due to an unknown error');
    }
  }

  async findAll(): Promise<VisoClassResponseDto[]> {
    try {
      const myClasses = await this.visoClassModel.find().lean().exec();
      return plainToInstance(VisoClassResponseDto, myClasses);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find MyClass: ${error.message}`);
      }
      throw new Error('Failed to find MyClass due to an unknown error');
    }
  }

  async findOne(id: string): Promise<VisoClassResponseDto> {
    const isValid = isValidObjectId(id);

    if (!isValid) {
      throw new NotFoundException(`MyClass with id ${id} not found`);
    }

    try {
      const myClass = await this.visoClassModel
        .findById({ _id: id })
        .lean()
        .exec();

      if (!myClass) {
        throw new NotFoundException(`MyClass with id ${id} not found 1223`);
      }

      return plainToInstance(VisoClassResponseDto, myClass);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find MyClass: ${error.message}`);
      }
      throw new Error('Failed to find MyClass due to an unknown error');
    }
  }

  update(id: number, updateVisoClassDto: UpdateVisoClassDto) {
    console.log(updateVisoClassDto);
    return `This action updates a #${id} myClass`;
  }

  remove(id: number) {
    return `This action removes a #${id} myClass`;
  }
}
