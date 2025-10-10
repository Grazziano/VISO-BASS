import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VisoClass, VisoClassDocument } from './schemas/viso-class.schema';
import { isValidObjectId, Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { CreateVisoClassDto } from './dto/create-viso-class.dto';
import { VisoClassResponseDto } from './dto/viso-class-response.dto';

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
      for (const object of createVisoClassDto.objects) {
        if (!isValidObjectId(object)) {
          throw new Error('Invalid object ID');
        }
      }

      const newMyClass = new this.visoClassModel(createVisoClassDto);
      const savedMyClass = await newMyClass.save();
      return plainToInstance(VisoClassResponseDto, savedMyClass.toJSON());
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create class: ${(error as Error).message}`,
      );
    }
  }

  async findAll(): Promise<VisoClassResponseDto[]> {
    try {
      const myClasses = await this.visoClassModel.find().lean().exec();
      return plainToInstance(VisoClassResponseDto, myClasses);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to find classes: ${(error as Error).message}`,
      );
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
        throw new NotFoundException(`MyClass with id ${id} not found`);
      }

      return plainToInstance(VisoClassResponseDto, myClass);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to find class: ${(error as Error).message}`,
      );
    }
  }
}
