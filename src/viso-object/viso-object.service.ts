import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVisoObjectDto } from './dto/create-viso-object.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseVisoObjectDto } from './dto/response-viso-object.dto';
import { Model } from 'mongoose';
import { VisoObject, VisoObjectDocument } from './schema/viso-object.schema';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from 'src/auth/types/jwt-payload.interface';

@Injectable()
export class VisoObjectService {
  constructor(
    @InjectModel(VisoObject.name)
    private visoObjectModel: Model<VisoObjectDocument>,
  ) {}

  async create(
    createVisoObjectDto: CreateVisoObjectDto,
    user: JwtPayload,
  ): Promise<ResponseVisoObjectDto> {
    try {
      const object = new this.visoObjectModel({
        ...createVisoObjectDto,
        obj_owner: user.userId,
      });

      const savedObject = await object.save();
      return plainToInstance(ResponseVisoObjectDto, savedObject.toJSON());
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create object: ${(error as Error).message}`,
      );
    }
  }

  async findAll(): Promise<ResponseVisoObjectDto[]> {
    try {
      const objects = await this.visoObjectModel.find().lean().exec();

      return plainToInstance(ResponseVisoObjectDto, objects);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to find objects: ${(error as Error).message}`,
      );
    }
  }

  async findOne(id: string): Promise<ResponseVisoObjectDto> {
    try {
      const object = await this.visoObjectModel.findById(id).lean().exec();

      if (!object) {
        throw new NotFoundException(`Object with id ${id} not found`);
      }

      return plainToInstance(ResponseVisoObjectDto, object);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to find object: ${(error as Error).message}`,
      );
    }
  }
}
